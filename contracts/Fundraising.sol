pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";



contract Fundraising {
    using SafeMath for uint256;

    struct Fundraise {
        address fundraiser;
        address beneficiary;
        uint256 fundraiseGoal;
        uint256 fundraiseStartTime;
        uint256 fundraiseDeadline;
        string fundraiseAgenda;
        uint256 amountFunded;
    }

    event Donation(address donator, uint256 fundraiseId, uint256 donationAmount);
    event FundraiseCreated(address fundraiser, address beneficiary, uint256 fundraiseGoal, uint256 fundraiseDeadline);
    event BeneficiaryChanged(uint256 fundraiseId, address newBeneficiary);
    event FundraiseComplete(uint256 fundraiseId, address beneficiary);
    event DonationClaimed(uint256 fundraiseId, address claimer, uint256 claimAmount);

    Fundraise[] allFundraises;

    mapping(address => uint256[]) fundraiserToFundraise;
    mapping(address => uint256[]) donatorToFundraise;
    mapping(uint256 => mapping(address => uint256)) donatorToDonation;

    function getFundraise(uint256 fundraiseId) external view returns(Fundraise memory) {
        return allFundraises[fundraiseId];
    }

    modifier onlyFundraiser(uint256 fundraiseId) {
        Fundraise memory fundraise = allFundraises[fundraiseId];
        require(msg.sender == fundraise.fundraiser, "Only Fundraiser is allowed");
        _;
    }

    modifier onlyBeneficiary(uint256 fundraiseId) {
        Fundraise memory fundraise = allFundraises[fundraiseId];
        require(msg.sender == fundraise.beneficiary, "Only beneficiary is allowed");
        _;
    }

    modifier afterDeadline(uint256 fundraiseId) {
        Fundraise memory fundraise = allFundraises[fundraiseId];
        require(block.timestamp > fundraise.fundraiseDeadline, "Fundraise is still ongoing");
        _;
    }

    function donate(uint256 fundraiseId) external payable {
        Fundraise storage fundraise = allFundraises[fundraiseId];
        require(fundraise.fundraiseDeadline > block.timestamp, "Fundraise is not accepting anymore donations");        
        require(fundraise.fundraiseGoal.sub(fundraise.amountFunded).sub(msg.value) >= 0, "Fundraise is complete no more donations accepted");
        fundraise.amountFunded = fundraise.amountFunded.add(msg.value); // increase amountFunded to Donation
        donatorToDonation[fundraiseId][msg.sender] = donatorToDonation[fundraiseId][msg.sender].add(msg.value);
        donatorToFundraise[msg.sender].push(fundraiseId); // if a person donates 2 times then 2 id's are added.
        emit Donation(msg.sender, fundraiseId, msg.value);
    }

    function createFundraise(address beneficiary, uint256 fundraiseGoal, string memory fundraiseAgenda, uint256 fundraiseDeadline) external {
        Fundraise memory fundraise = Fundraise(msg.sender, beneficiary, fundraiseGoal, block.timestamp, fundraiseDeadline, fundraiseAgenda, 0);
        allFundraises.push(fundraise);
        fundraiserToFundraise[msg.sender].push(allFundraises.length - 1);
        emit FundraiseCreated(msg.sender, beneficiary, fundraiseGoal, fundraiseDeadline);
    } 

    function getBeneficiary(uint256 fundraiseId) external view returns(address) {
        Fundraise memory fundraise = allFundraises[fundraiseId];
        return fundraise.beneficiary;
    }

    function setBeneficiary(uint256 fundraiseId, address newBeneficiary) onlyFundraiser(fundraiseId) external {
        Fundraise storage fundraise = allFundraises[fundraiseId];
        fundraise.beneficiary = newBeneficiary;
        emit BeneficiaryChanged(fundraiseId, newBeneficiary);
    }

    function getDonationAmount(uint256 fundraiseId) external view returns(uint256) {
        return donatorToDonation[fundraiseId][msg.sender];
    }

    function claimFundraised(uint256 fundraiseId) onlyBeneficiary(fundraiseId) afterDeadline(fundraiseId) external {
        Fundraise memory fundraise = allFundraises[fundraiseId];
        require(fundraise.fundraiseGoal.sub(fundraise.amountFunded) == 0, "Fundraise was a failure cannot claim funds");
        payable(fundraise.beneficiary).transfer(fundraise.fundraiseGoal);
        emit FundraiseComplete(fundraiseId, fundraise.beneficiary);
    }

    function claimDonation(uint256 fundraiseId) afterDeadline(fundraiseId) external {
        Fundraise memory fundraise = allFundraises[fundraiseId];
        uint256 donationAmount = donatorToDonation[fundraiseId][msg.sender];
        require(donationAmount > 0, "No Donation made");
        require(fundraise.fundraiseGoal.sub(fundraise.amountFunded) > 0, "Fundraise was a success cannot claim donation");
        payable(msg.sender).transfer(donationAmount);
        fundraise.amountFunded = fundraise.amountFunded.sub(donationAmount);
        donatorToDonation[fundraiseId][msg.sender] = 0;
        emit DonationClaimed(fundraiseId, msg.sender, donationAmount);
    }
    
    function getAmountFunded(uint256 fundraiseId) external view returns(uint256) {
        Fundraise memory fundraise = allFundraises[fundraiseId];
        return fundraise.amountFunded;
    }
}