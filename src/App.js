import './App.css';
import HomeScreen from './Pages/HomeScreen';
import Header from "./Components/Header";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import theme from "./theme";
import NetworkModal from "./Components/NetworkModal";
import "@fontsource/inter";
import Dashboard from './Pages/Dashboard';
import Browse from './Pages/Browse';
import Web3 from "web3";
import { FaExternalLinkAlt } from "react-icons/fa";
import { 
  ChakraProvider,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalHeader,
  Link,
  Button 
} from "@chakra-ui/react";

function App() {

  const [currentAccount, setCurrentAccount] = useState(undefined);
  // const [ chainId, setChainId ] = useState();

  // useEffect(() => {
  //   setChainId(window.ethereum.networkVersion);
  // }, [])

  return (
    <>
      <ChakraProvider theme={theme}>
        <Router>
          <Header currentAccountSetter={setCurrentAccount} currentAccount={currentAccount} />
          <Switch>
            <Route exact path="/">
              <HomeScreen currentAccount={currentAccount} />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard currentAccount={currentAccount} />
            </Route>
            <Route exact path="/browse">
              <Browse />
            </Route>
          </Switch>
        </Router>
        {
          window.ethereum == undefined ?
          <Modal
            closeModalOnOverlayClick={false}
          >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Metamask Not Installed!</ModalHeader>
                <ModalBody>
                    Please Install Metamask.
                </ModalBody>
                <ModalFooter>
                    <Link 
                        href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" 
                        isExternal
                    >
                        <Button colorScheme="blue" mr={3} rightIcon={<FaExternalLinkAlt />}>
                            Install On Chrome 
                        </Button>
                    </Link>
                    <Link href="https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/" isExternal>
                        <Button colorScheme="orange" rightIcon={<FaExternalLinkAlt />}>
                            Install On Firefox 
                        </Button>
                    </Link>
                    
                </ModalFooter>
            </ModalContent>      
          </Modal>
          :
          null
        }
        {/* <NetworkModal isOpen={!(chainId == "137" || chainId == "4")} chainId={chainId} ethereum={window.ethereum} />  */}
      </ChakraProvider>
    </>
  );
}

export default App;
