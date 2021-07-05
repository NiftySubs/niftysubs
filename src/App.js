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

import { ChakraProvider } from "@chakra-ui/react";

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
        {/* <NetworkModal isOpen={!(chainId == "137" || chainId == "4")} chainId={chainId} ethereum={window.ethereum} />  */}
      </ChakraProvider>
    </>
  );
}

export default App;
