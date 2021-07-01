import "./Components.css";
import niftysubs from '../assets/niftysubs.svg';
import { Button, HStack, Text } from "@chakra-ui/react";
function Header() {
  return (
    <HStack padding={3} className="Header">
      <div className="headercomp">
        <img className="headerlogo" src={niftysubs} alt="Niftysubs Logo"></img>
        <Button variant="ghost">Browse</Button>
      </div>
      <div></div>
      <div className="headercomp">
        <Button alignSelf="flex-start" color="#E6017A" backgroundColor="rgba(230,1,122,0.08)">Connect Wallet</Button>
      </div>
    </HStack>
  );
}

export default Header;
