import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MoralisProvider } from 'react-moralis';
import 'font-awesome/css/font-awesome.min.css';



ReactDOM.render(
  <MoralisProvider
    appId="yXYoxCHXnLT54ylFTQUM48MmxJWCYnFIKdirLvJU"
    serverUrl="https://l0ofdtitry2q.usemoralis.com:2053/server"
  >
    <App />
  </MoralisProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
