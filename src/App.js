import './App.css';
import HomeScreen from './Pages/HomeScreen';
import Header from "./Components/Header";
import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import theme from "./theme";
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
  const [ chainId, setChainId ] = useState();
  const [ isLoading, setIsLoading ] = useState(false);

  const getCurrentAccount = async () => {
    setIsLoading(true);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts"});
    setCurrentAccount(accounts[0]);
    setIsLoading(false);
  }

  useEffect(() => {
    if(window.ethereum && currentAccount){
      setChainId(window.ethereum.networkVersion);
      
      window.ethereum.on("accountsChanged", (accounts) => {
        setCurrentAccount(accounts[0]);
      })

      window.ethereum.on("chainChanged", (newChainId) => {
        setChainId(newChainId.substr(-1, 1));
      })
    }
  }, [currentAccount]);


  return (
    <>
      <ChakraProvider theme={theme}>
        <Router>
          <Header currentAccount={currentAccount} />
          {
            window.ethereum == undefined ?
            <Modal
              isOpen={true}
              isCentered={true}
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
            <>
              {
                currentAccount == undefined ?
                <Modal
                  isOpen={true}
                  isCentered={true}
                  closeModalOnOverlayClick={false}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader textAlign="center">Connect Wallet to continue</ModalHeader>
                    <ModalFooter justifyContent="center">
                        <Button onClick={getCurrentAccount} isLoading={isLoading} colorScheme="pink" mr={3}>
                            Connect Wallet
                        </Button>                      
                    </ModalFooter>
                  </ModalContent>
                  
                </Modal>
                :
                chainId == "4" || chainId == undefined ?
                null
                :
                <Modal
                  isOpen={true}
                  isCentered={true}
                  closeModalOnOverlayClick={false}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Network Not Supported</ModalHeader>
                    <ModalBody>
                        Please Switch to Rinkeby Network.
                    </ModalBody>
                    <ModalFooter>                        
                    </ModalFooter>
                </ModalContent>      
              </Modal>
              }
            </>
          }
          <Switch>
            <Route exact path="/video/:id">
              <HomeScreen currentAccount={currentAccount} />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard currentAccount={currentAccount} />
            </Route>
            <Route exact path="/">
              <Browse />
            </Route>
          </Switch>
        </Router>
        
      </ChakraProvider>
    </>
  );
}

export default App;
