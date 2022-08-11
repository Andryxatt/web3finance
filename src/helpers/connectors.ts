import { InjectedConnector } from "@web3-react/injected-connector";
import { BscConnector } from '@binance-chain/bsc-connector'
import { WalletLinkConnector } from "@web3-react/walletlink-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { NetworkConnector } from "@web3-react/network-connector";
const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })
const bsc = new BscConnector({
  supportedChainIds: [56, 97] // later on 1 ethereum mainnet and 3 ethereum ropsten will be supported
})
const walletlink = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  appName: "Web3-react Demo",
  supportedChainIds: [1, 3, 4, 5, 42],
})
const walletconnect = new WalletConnectConnector({
  rpc: { 56: 'https://bsc-dataseed.binance.org/' },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
})
const polygon = new NetworkConnector({ urls: { 137: "https://polygonapi.terminet.io/rpc" } })
export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink,
  bsc: bsc,
  polygon: polygon
};
