import React from "react"
import AccountBalanceWalletTwoToneIcon from '@mui/icons-material/AccountBalanceWalletTwoTone'
import WalletNetwork from "./WalletNetwork"
import bnbIcon from "../../images/bnb-modal.png"
import metamaskIcon from "../../images/metamask-modal.svg"
import coinbaseIcon from "../../images/coinbase-modal.png"
import walletConnectIcon from "../../images/wallet-connect-modal.png"
import Modal from "../ui/Modal"
import { useAppSelector } from "../../store/hooks"
import { useAccount, useConnect } from 'wagmi'
import { currentNetwork, selectNetwork } from "../../store/network/networkSlice"
window.Buffer = window.Buffer || require("buffer").Buffer

const WalletModal = () => {
  const networks = useAppSelector(selectNetwork);
  const selectedNetwork = useAppSelector(currentNetwork);
 
  const setConnectorIcon = (connector: any) => {
    switch(connector.name){
      case "MetaMask":
        return metamaskIcon;
      case "WalletConnect":
        return walletConnectIcon;
      case "Coinbase Wallet":
        return coinbaseIcon;
      case "Injected":
        return bnbIcon;
      default:
        return metamaskIcon;
    }
  }
  const getChainId = () => {
    switch(selectedNetwork.name){
      case "Binance Smart Chain Testnet":
        return 97;
      case "Ethereum":
        return 1;
      case "Polygon Mumbai":
        return 80001;
      case "Goerli":
        return 5;
      default:
        return 5;
    }
  }
  const { address } = useAccount()
  const { connect, connectors, isLoading, pendingConnector } =
    useConnect()
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
        {address === null ? 'Connect Wallet' : address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Connect Wallet'}
      </button>
      <Modal clas shown={modalShown} close={() => { toggleModal(false) }}>
        <h1 className="px-3 text-center modal-title">1. Choose Network</h1>
        <div className="flex flex-row flex-wrap md:flex-col sm:flex-col">
          {
            networks.map((network: any, index: number) => {
              return <WalletNetwork icon={network.icon} key={index} chainId={network.id} name={network.name} isActive={network.isActive} />
            })
          }
        </div>
        <h1 className="px-3 text-center modal-title">2. Choose Wallet</h1>
        <div className="flex flex-row flex-wrap md:flex-col sm:flex-col">
          {connectors.map((connector) => (
            <div
              key={connector.id}
              onClick={() => connect({ connector, chainId:getChainId() })} className="cursor-pointer flex items-center w-[50%] md:w-[100%] flex-col relative mb-3 hover:bg-blue-300"
            >
              <img alt="Metamask" className="sm:max-w-[50px] max-w-[100px]" src={setConnectorIcon(connector)} />
              <span> {connector.name}  {!connector.ready && ' (unsupported)'}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  ' (connecting)'}</span>
              <p>Connect to your {connector.name}</p>
            </div>
          ))}

          {/* <div className="cursor-pointer flex items-center w-[50%] md:w-[100%] flex-col relative mb-3 hover:bg-blue-300">
            <img className="sm:max-w-[50px] max-w-[100px]" alt="Coinbase" src={coinbaseIcon} />
            <span>Coinbase Wallet</span>
          </div>
          <div className="cursor-pointer flex items-center w-[50%] md:w-[100%] flex-col relative mb-3 hover:bg-blue-300">
            <img className="sm:max-w-[50px] max-w-[100px]" alt="Binance" src={bnbIcon} />
            <span>Binance Chain Wallet</span>
          </div>
          <div className="cursor-pointer flex items-center w-[50%] md:w-[100%] flex-col relative mb-3 hover:bg-blue-300" >
            <img className="sm:max-w-[50px] max-w-[100px]" alt="Wallet Connect" src={walletConnectIcon} />
            <span>Wallet Connect</span>
          </div> */}
        </div>
      </Modal>
    </>
  );
}
export default WalletModal;


