import React, { useEffect } from "react"
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone'
import { Button } from "@material-tailwind/react"
import WalletNetwork from "./WalletNetwork"
import { Web3State } from "../../Web3DataContext"
import bnbIcon from "../../images/bnb-modal.png"
import ethIcon from "../../images/eth-modal.png"
import metamaskIcon from "../../images/metamask-modal.svg"
import coinbaseIcon from "../../images/coinbase-modal.png"
import polyhonIcon from "../../images/polygon-modal.svg"
import binanceIcon from "../../images/binance.png"
import ethereum from "../../images/ethereum.png"
import walletConnectIcon from "../../images/wallet-connect-modal.png"
import Modal from "../ui/Modal"
window.Buffer = window.Buffer || require("buffer").Buffer

const WalletModal = () => {
  const {
   account,
   ConnectWallet
} = Web3State();

  const [modalShown, toggleModal] = React.useState(false);
  useEffect(() => {

  },[account])
  return (
    <>
      <Button onClick={() => {
        toggleModal(!modalShown);
      }} className="black bg-orange-400 rounded-lg text-md py-3 px-5 h-12 mt-3 hover:bg-orange-500"><AccountBalanceWalletTwoToneIcon />
        {account === null ? 'Connect Wallet' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}</Button>
      <Modal shown={modalShown} close={() => { toggleModal(false) }}>
        <h1 className="px-3 text-center modal-title">1. Choose Network</h1>
        <div className="flex items-center flex-row flex-wrap">
          <WalletNetwork icon={binanceIcon} name="Binance Smart Chain" />
          <WalletNetwork icon={polyhonIcon} name="Polygon (Matic)" />
          <WalletNetwork icon={ethIcon} name="Rinkeby Testnet" />
          <WalletNetwork icon={ethereum} name="Rinkeby Mainnet" />
        </div>
        <h1 className="px-3 text-center modal-title">2. Choose Wallet</h1>
        <div className="flex items-center flex-row flex-wrap">
          <div className="network_wrapper hover:bg-blue-300"
            onClick={() => {ConnectWallet?.("injected")} }>
            <img alt="Metamask" src={metamaskIcon} />
            <span>Metamask</span>
            <p>Connect to your MetaMask</p>
          </div>
          <div className="network_wrapper hover:bg-blue-300" onClick={() => ConnectWallet?.("coinbaseWallet") }>
            <img alt="Coinbase" src={coinbaseIcon} />
            <span>Coinbase Wallet</span>
          </div>
          <div className="network_wrapper hover:bg-blue-300" onClick={() => {
            ConnectWallet?.("bsc")
          }}>
            <img alt="Binance" src={bnbIcon} />
            <span>Binance Chain Wallet</span>
          </div>
          <div className="network_wrapper hover:bg-blue-300" onClick={() => ConnectWallet?.("walletConnect") }>
            <img alt="Wallet Connect" src={walletConnectIcon} />
            <span>Wallet Connect</span>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default WalletModal;


