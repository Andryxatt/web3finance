import ReactDOM from 'react-dom/client';
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter } from "react-router-dom";
import { Web3Provider } from '@ethersproject/providers';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';

import './index.css';
import App from './App';
function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}
const Web3ReactProviderPolygon = createWeb3ReactRoot('polygon')
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ThemeProvider>
    <BrowserRouter>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ReactProviderPolygon getLibrary={getLibrary}>
          <App />
        </Web3ReactProviderPolygon>
      </Web3ReactProvider>
    </BrowserRouter>  
  </ThemeProvider>
);