import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "./assets/main.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import theme from "./theme";
import "@fontsource/inter";

import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.render(
  <>
    <ChakraProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={App} />
        </Switch>
      </Router>
    </ChakraProvider>
  </>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
