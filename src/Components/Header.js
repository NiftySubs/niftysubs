import "./Components.css";
import niftysubs from '../assets/niftysubs.svg';
import { 
  Button, 
  HStack, 
  Text, 
  Tag, 
  TagLabel, 
  Avatar,
  Spacer 
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import svgAvatarGenerator from "../utils/avatar";
import { Link } from "react-router-dom";
import Web3 from "web3";

function Header({ currentAccountSetter, currentAccount }) {

  const [ isLoading, setIsLoading ] = useState(false);
  const [ avatar, setAvatar ] = useState(undefined);
  const [ isMetamaskInstalled, setIsMetamaskInstalled ] = useState(false);

  useEffect(() => {
    if(window.ethereum) {
      setIsMetamaskInstalled(true);  
      let svg = svgAvatarGenerator(currentAccount, {dataUri: true});
      setAvatar(svg);
      window.ethereum.on("accountsChanged", (accounts) => {
        currentAccountSetter(accounts[0]);
      })
      // const web3 = new Web3(window.ethereum);
      // window.ethereum.on("chainChanged", async (chainId) => {
      //   const newChainId = await web3.eth.getChainId();
      //   chainIdSetter(newChainId);
      // });
    } else {
      setIsMetamaskInstalled(false);
    }
  }, [currentAccount])

  

  const getCurrentAccount = async () => {
    setIsLoading(true);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts"});
    currentAccountSetter(accounts[0]);
    setIsLoading(false);
  }

  return (
    <HStack padding={3} className="Header">
      <div className="headercomp">
        <Link to="/"><img className="headerlogo" src={niftysubs} alt="Niftysubs Logo"></img></Link>
        <Link to = "/"><Button variant="ghost">Browse</Button></Link>
        <Link to = "/video/60e2fffd61b758393271368c"><Button ml={3} variant="ghost">Video</Button></Link>
      </div>
      <Spacer />
      <Link to="/dashboard"><Button variant="ghost">Dashboard</Button></Link>
      <div className="headercomp">
        {
          isMetamaskInstalled ? 
          currentAccount ? 
          <Tag
            size="lg"
            borderRadius="full"
            ml={3}
            mr={-2}
            background="rgba(230,1,122,0.08)"
          >
            <TagLabel color="#E6017A">
                {`${currentAccount.substr(0,6)}...${currentAccount.substr(-4)}`}
            </TagLabel>
            <Avatar borderStyle="solid" borderColor="#E6017A" borderWidth="2px" padding="1px" mr="-13px" ml={4} size="sm" bg="transparent" src={avatar} />
          </Tag>
          :
          <Button isLoading={isLoading} onClick={getCurrentAccount} alignSelf="flex-start" color="#E6017A" backgroundColor="rgba(230,1,122,0.08)">Connect Wallet</Button>
          :
          <Button isLoading={isLoading} alignSelf="flex-start" color="#E6017A" backgroundColor="rgba(230,1,122,0.08)">Install Metamask</Button>
        }
        
      </div>
    </HStack>
  );
}

export default Header;
