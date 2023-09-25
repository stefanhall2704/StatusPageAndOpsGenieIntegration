import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import reportWebVitals from "./reportWebVitals";
import { authProvider } from './authProvider';
import App from "./App";
import { AzureAD } from 'react-aad-msal';



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AzureAD provider={authProvider} forceLogin={true}>
    <App />
  </AzureAD>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
