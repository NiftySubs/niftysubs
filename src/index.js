import React from 'react';
import ReactDOM from 'react-dom';
import { ColorModeScript } from "@chakra-ui/react";
import './index.css';
import App from './App';
import "./assets/main.css";
import reportWebVitals from './reportWebVitals';
import theme from "./theme"

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
