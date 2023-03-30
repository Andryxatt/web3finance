import ReactDOM from 'react-dom/client';
import { ThemeProvider } from "@material-tailwind/react";
import { BrowserRouter } from "react-router-dom";
import { store } from './store/store'
import { Provider } from 'react-redux'
import { bscTestnet, polygonMumbai, mainnet, goerli, polygon, bsc, avalanche, optimism, arbitrum } from 'wagmi/chains'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import './index.css';
import App from './App';

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, bscTestnet, polygonMumbai, polygon, bsc, avalanche, optimism, arbitrum],
  [
    publicProvider()
  ],
)
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains, options:{
      shimChainChangedDisconnect: true,
      shimDisconnect: true,
    } }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
   <Provider store={store}>
  <ThemeProvider>
    <BrowserRouter>
    <WagmiConfig client={client}>
          <App />
    </WagmiConfig>
    </BrowserRouter>  
  </ThemeProvider>
  </Provider>
);