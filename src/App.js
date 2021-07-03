import './App.css';
import HomeScreen from './Pages/HomeScreen';
import Header from "./Components/Header";
import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import theme from "./theme";

import "@fontsource/inter";
import Dashboard from './Pages/Dashboard';

import { ChakraProvider } from "@chakra-ui/react";

function App() {

  const [currentAccount, setCurrentAccount] = useState(undefined);

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
              <Dashboard />
            </Route>
          </Switch>
        </Router>
      </ChakraProvider>
    </>
  );
}

export default App;
