import React from "react"
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone'
import { Button } from "@material-tailwind/react"
import WalletNetwork from "./WalletNetwork"
import { Web3State } from "../../Web3DataContext"
import bnbIcon from "../../images/bnb-modal.png"
import metamaskIcon from "../../images/metamask-modal.svg"
import coinbaseIcon from "../../images/coinbase-modal.png"
import walletConnectIcon from "../../images/wallet-connect-modal.png"
import Modal from "../ui/Modal"
window.Buffer = window.Buffer || require("buffer").Buffer

const WalletModal = () => {
  const {
    account,
    ConnectWallet,
    SwitchNetwork,
    networks,
    setNetworks
  } = Web3State();

  const [chainSelected, setChainSelected] = React.useState<any>(null)
  const changeNetwork = async (e: any) => {
    document.querySelectorAll(".network_wrapper").forEach((el: any) => {
      el.classList.remove("active-network");
    })
    const name = e.target.textContent;
    e.currentTarget.className = "network_wrapper active-network";
    const newState = networks.map((obj: any) => {
      if (obj.name === name) {
        setChainSelected(obj)
        SwitchNetwork(obj);
        return { ...obj, isActive: true };
      }
      else {
        return { ...obj, isActive: false };
      }
    });
    setNetworks(newState);
  }
  const [modalShown, toggleModal] = React.useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleModal(!modalShown);
        }}
        className="black bg-orange-400 font-bold rounded-lg text-md py-3 px-5 h-12 mt-3 hover:bg-orange-500 lg:w-[200px] lg:absolute lg:right-5 lg:mt-0 ">
        <AccountBalanceWalletTwoToneIcon />
        {account === null ? 'Connect Wallet' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}
      </button>
      <Modal shown={modalShown} close={() => { toggleModal(false) }}>
        <h1 className="px-3 text-center modal-title">1. Choose Network</h1>
        <div className="flex items-center flex-row flex-wrap">
          {
            networks.map((network: any, index: number) => {
              return <WalletNetwork icon={network.icon} key={index} name={network.name} isActive={network.isActive} switchNetwork={changeNetwork} />
            })
          }

        </div>
        <h1 className="px-3 text-center modal-title">2. Choose Wallet</h1>
        <div className="flex items-center flex-row flex-wrap">
          <div className="network_wrapper hover:bg-blue-300"
            onClick={() => { ConnectWallet?.("injected", chainSelected) }}>
            <img alt="Metamask" src={metamaskIcon} />
            <span>Metamask</span>
            <p>Connect to your MetaMask</p>
          </div>
          <div className="network_wrapper hover:bg-blue-300" onClick={() => ConnectWallet?.("coinbaseWallet", chainSelected)}>
            <img alt="Coinbase" src={coinbaseIcon} />
            <span>Coinbase Wallet</span>
          </div>
          <div className="network_wrapper hover:bg-blue-300" onClick={() => {
            ConnectWallet?.("bsc", chainSelected)
          }}>
            <img alt="Binance" src={bnbIcon} />
            <span>Binance Chain Wallet</span>
          </div>
          <div className="network_wrapper hover:bg-blue-300" onClick={() => ConnectWallet?.("walletConnect", chainSelected)}>
            <img alt="Wallet Connect" src={walletConnectIcon} />
            <span>Wallet Connect</span>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default WalletModal;


