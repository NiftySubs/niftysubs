// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;


import {
    ISuperfluid,
    ISuperToken,
    ISuperApp,
    ISuperAgreement,
    SuperAppDefinitions,
    ContextDefinitions
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
// When ready to move to leave Remix, change imports to follow this pattern:
// "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {
    IConstantFlowAgreementV1
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import {
    SuperAppBase
} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";

import {
    ISuperfluidToken
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidToken.sol";

interface IPublicLock {
    function grantKeys(
    address[] calldata _recipients,
    uint[] calldata _expirationTimestamps,
    address[] calldata _keyManagers
    ) external;

    function beneficiary() external view returns (address);

    function expireAndRefundFor(
    address _keyOwner,
    uint amount
    ) external;

    function getTokenIdFor(
    address _account
    ) external view returns (uint);

    function expirationDuration() 
    external view returns (uint256 );
}

contract SuperApp is SuperAppBase {
    ISuperfluid private _host; // host
    IConstantFlowAgreementV1 private _cfa; // the stored constant flow agreement class address
    ISuperToken private _acceptedToken; // accepted token
    int96 public _requiredFlowRate;
    
    mapping(address => address) public userToLockMapping;
    
    constructor(
        ISuperfluid host,
        IConstantFlowAgreementV1 cfa,
        ISuperToken acceptedToken,
        int96 requiredFlowRate) {
        assert(address(host) != address(0));
        assert(address(cfa) != address(0));
        assert(address(acceptedToken) != address(0));

        _host = host;
        _cfa = cfa;
        _acceptedToken = acceptedToken;
        _requiredFlowRate = requiredFlowRate;


        uint256 configWord =
            SuperAppDefinitions.APP_LEVEL_FINAL |
            SuperAppDefinitions.BEFORE_AGREEMENT_CREATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_UPDATED_NOOP |
            SuperAppDefinitions.BEFORE_AGREEMENT_TERMINATED_NOOP;

        _host.registerApp(configWord);
    }

    function _updateOutflow(bytes calldata ctx, address lockAddress, address flowSender)
        private
        returns (bytes memory newCtx)
    {
      newCtx = ctx;
      
      // @dev This will give me the new flowRate, as it is called in after callbacks
      int96 netFlowRate = _cfa.getNetFlow(_acceptedToken, address(this));

    //   address lockAddress = abi.decode(_host.decodeCtx(ctx).userData, (address));
      address _receiver = IPublicLock(lockAddress).beneficiary();
      
      (,int96 outFlowRate,,) = _cfa.getFlow(_acceptedToken, address(this), _receiver);
      int96 inFlowRate = netFlowRate + outFlowRate;
      if (inFlowRate < 0) inFlowRate = -inFlowRate; // Fixes issue when inFlowRate is negative

      // @dev If inFlowRate === 0, then delete existing flow.
      if (inFlowRate == int96(0)) {
        // @dev if inFlowRate is zero, delete outflow.
        (newCtx, ) = _host.callAgreementWithContext(
            _cfa,
            abi.encodeWithSelector(
                _cfa.deleteFlow.selector,
                _acceptedToken,
                address(this),
                _receiver,
                new bytes(0) // placeholder
            ),
            "0x",
            newCtx
        );
        userToLockMapping[flowSender] = address(0);
       } else if (outFlowRate != int96(0)){
            (newCtx, ) = _host.callAgreementWithContext(
                _cfa,
                abi.encodeWithSelector(
                    _cfa.updateFlow.selector,
                    _acceptedToken,
                    _receiver,
                    inFlowRate,
                    new bytes(0) // placeholder
                ),
                "0x",
                newCtx
            );
        } else if(outFlowRate == int96(0)) {
      // @dev If there is no existing outflow, then create new flow to equal inflow
          (newCtx, ) = _host.callAgreementWithContext(
              _cfa,
              abi.encodeWithSelector(
                  _cfa.createFlow.selector,
                  _acceptedToken,
                  _receiver,
                  inFlowRate,
                  new bytes(0) // placeholder
              ),
              "0x",
              newCtx
          );
        }
    }
    
    function afterAgreementCreated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32, // _agreementId,
        bytes calldata _agreementData,
        bytes calldata ,// _cbdata,
        bytes calldata _ctx
    )
        external override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        // get the flowsender and flowreceiver for the stream that invoked the hook.
        (address flowSender, address flowReceiver) = abi.decode(_agreementData, (address, address));
        
        // get the lockAddress from the arguments.
        address lockAddress = abi.decode(_host.decodeCtx(_ctx).userData, (address));
        IPublicLock lock = IPublicLock(lockAddress);

        // unlock protocol stuff.
        address[] memory _recipients = new address[](1);
        uint256[] memory _expirationTimestamps = new uint256[](1);
        address[] memory _keyManagers = new address[](1);
        
        _recipients[0] = flowSender;
        _expirationTimestamps[0] = block.timestamp + lock.expirationDuration(); // block.timestamp + expirationDuration.
        _keyManagers[0] = address(this);

        // grant keys to the user.
        lock.grantKeys(_recipients, _expirationTimestamps, _keyManagers);
        
        // update the mapping so that we can keep track of current content lock.
        userToLockMapping[flowSender] = lockAddress;
        return _updateOutflow(_ctx, userToLockMapping[flowSender], flowSender);
    }
    
    function afterAgreementUpdated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 ,//_agreementId,
        bytes calldata _agreementData,
        bytes calldata ,//_cbdata,
        bytes calldata _ctx
    )
        external override
        onlyExpected(_superToken, _agreementClass)
        onlyHost
        returns (bytes memory newCtx)
    {
        newCtx = _ctx;

        // lock address from arguments.
        address lockAddress = abi.decode(_host.decodeCtx(_ctx).userData, (address));
        (address flowSender, address flowReceiver) = abi.decode(_agreementData, (address, address));
        (,int96 inFlowRate,,) = _cfa.getFlow(_acceptedToken, flowSender, flowReceiver);
        
        // if user updates the flowRate to less than required to keep the stream on then revert back.
        if(inFlowRate < _requiredFlowRate) {
            revert("FlowRate less than required");
        }

        if(userToLockMapping[flowSender] != lockAddress) {
            // get the lock address of content the user was consuming.
            IPublicLock prevLock = IPublicLock(userToLockMapping[flowSender]);
            // expire the key for the previous content.
            prevLock.expireAndRefundFor(flowSender, 0);
            // get the beneficiary for the previous content.
            address prevReceiver = prevLock.beneficiary();
            // get the flow rate from superApp to previous lock beneficiary.
            (,int96 appToCreatorFlowRate,,) = _cfa.getFlow(_acceptedToken, address(this), prevReceiver);
            
            // if after subtract the flowRate from the previous lock beneficiary it comes to zero then delete flow else update flow.
            if(appToCreatorFlowRate - _requiredFlowRate == 0) {
                (newCtx, ) = _host.callAgreementWithContext(
                    _cfa,
                    abi.encodeWithSelector(
                        _cfa.deleteFlow.selector,
                        _acceptedToken,
                        address(this),
                        prevReceiver,
                        new bytes(0) // placeholder
                    ),
                    "0x",
                    newCtx
                );
                userToLockMapping[flowSender] = address(0);
            } else {
                (newCtx, ) = _host.callAgreementWithContext(
                    _cfa,
                    abi.encodeWithSelector(
                        _cfa.updateFlow.selector,
                        _acceptedToken,
                        prevReceiver,
                        appToCreatorFlowRate - _requiredFlowRate,
                        new bytes(0) // placeholder
                    ),
                    "0x",
                    newCtx
                );
            }

            // change the current content lock.
            userToLockMapping[flowSender] = lockAddress;
        }

        return _ctx;
    }

    function afterAgreementTerminated(
        ISuperToken _superToken,
        address _agreementClass,
        bytes32 ,//_agreementId,
        bytes calldata _agreementData,
        bytes calldata ,//_cbdata,
        bytes calldata _ctx
    )
        external override
        onlyHost
        returns (bytes memory newCtx)
    {
        // According to the app basic law, we should never revert in a termination callback
        if (!_isSameToken(_superToken) || !_isCFAv1(_agreementClass)) return _ctx;
        
        newCtx = _ctx;
        (address flowSender, address flowReceiver) = abi.decode(_agreementData, (address, address));
        address lockAddress = userToLockMapping[flowSender];
        if(lockAddress != address(0)) {
            IPublicLock lock = IPublicLock(lockAddress);
            lock.expireAndRefundFor(flowSender, 0);
        }
        return _updateOutflow(_ctx, userToLockMapping[flowSender], flowSender);
    }
    
    function _isSameToken(ISuperToken superToken) private view returns (bool) {
        return address(superToken) == address(_acceptedToken);
    }

    function _isCFAv1(address agreementClass) private view returns (bool) {
        return ISuperAgreement(agreementClass).agreementType()
            == keccak256("org.superfluid-finance.agreements.ConstantFlowAgreement.v1");
    }

    modifier onlyHost() {
        require(msg.sender == address(_host), "RedirectAll: support only one host");
        _;
    }

    modifier onlyExpected(ISuperToken superToken, address agreementClass) {
        require(_isSameToken(superToken), "RedirectAll: not accepted token");
        require(_isCFAv1(agreementClass), "RedirectAll: only CFAv1 supported");
        _;
    }

    
    
}