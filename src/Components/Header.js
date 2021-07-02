import "./Components.css";
import niftysubs from '../assets/niftysubs.svg';
import { Button, HStack, Text, Tag, TagLabel, Avatar, interactivity } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import svgAvatarGenerator from "../utils/avatar";


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
    } else {
      setIsMetamaskInstalled(false);
    }
  }, [currentAccount])

  

  const getCurrentAccount = async () => {
    setIsLoading(true);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts"});
    currentAccountSetter(accounts[0]);
    console.log(accounts[0]);
    setIsLoading(false);
  }

  return (
    <HStack padding={3} className="Header">
      <div className="headercomp">
        <img className="headerlogo" src={niftysubs} alt="Niftysubs Logo"></img>
        <Button variant="ghost">Browse</Button>
      </div>
      <div></div>
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
