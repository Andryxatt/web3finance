import React, { useEffect } from "react"
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
import { useMediaQuery } from 'react-responsive'
window.Buffer = window.Buffer || require("buffer").Buffer

const WalletModal = () => {
  const networks = useAppSelector(selectNetwork);
  const selectedNetwork = useAppSelector(currentNetwork);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const { address } = useAccount()
  const { connect, connectors, isLoading, pendingConnector } =
    useConnect()
  const [modalShown, toggleModal] = React.useState(false);
  const setConnectorIcon = (connector: any) => {
    switch (connector.name) {
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
  const chainIds = {
    Ethereum: 1,
    // Goerli: 5,
    Optimism: 10,
    "Binance Smart Chain": 56,
    "Binance Smart Chain Testnet": 97,
    Polygon: 137,
    // "Polygon Mumbai": 80001,
    "Arbitrum": 42161,
    Avalanche: 43114
  };
  
  const getChainId = () => {
    const selectedChainId = chainIds[selectedNetwork.name];
    return selectedChainId ? selectedChainId : 5;
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [connectorElements, setConnectorElements] = React.useState([])
  useEffect(() => {
    for (let i = 0; i < connectors.length; i++) {
      const connector = connectors[i]
      if (connectors[i].name === "MetaMask") {
        const connector = connectors[2]
        connectorElements.push(
          <div
            onClick={() => connect({ connector, chainId: getChainId() })} className={`cursor-pointer flex items-center w-[50%] md:w-[100%] flex-col relative mb-3 hover:bg-blue-300`}
          >
            <img alt="Metamask" className="sm:max-w-[50px] max-w-[100px]" src={metamaskIcon} />
            <span> MetaMask  {!connector.ready && ' (unsupported)'}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}</span>
            <p>Connect to your MetaMask</p>
          </div>
        )
      }
      else {
        connectorElements.push(
          <div
            onClick={() => connect({ connector, chainId: getChainId() })} className={` ${isMobile && (connector.name === "MetaMask" || connector.name === "Injected" || connector.name === "Coinbase Wallet") ? "hidden" : ""} cursor-pointer flex items-center w-[50%] md:w-[100%] flex-col relative mb-3 hover:bg-blue-300`}
          >
            <img alt="Metamask" className="sm:max-w-[50px] max-w-[100px]" src={setConnectorIcon(connector)} />
            <span> {connector.name}  {!connector.ready && ' (unsupported)'}
              {isLoading &&
                connector.id === pendingConnector?.id &&
                '(connecting)'}</span>
            <p>Connect to your {connector.name}</p>
          </div>
        )
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleModal(!modalShown);
        }}
        className="black bg-orange-400 font-bold rounded-lg text-md py-3 px-5 h-12 hover:bg-orange-500 lg:w-[200px] lg:absolute lg:right-5 lg:mt-0 ">
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
        {
          isMobile ? <div className="flex flex-row flex-wrap md:flex-col sm:flex-col">
            {connectorElements}
          </div>
            :
            <div className="flex flex-row flex-wrap md:flex-col sm:flex-col">
              {connectors.map((connector) => (
                <div
                  key={connector.id}
                  onClick={() => connect({ connector, chainId: getChainId() })} className="cursor-pointer flex items-center w-[50%] md:w-[100%] flex-col relative mb-3 hover:bg-blue-300"
                >
                  <img alt="Metamask" className="sm:max-w-[50px] max-w-[100px]" src={setConnectorIcon(connector)} />
                  <span> {connector.name}  {!connector.ready && ' (unsupported)'}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      ' (connecting)'}</span>
                  <p>Connect to your {connector.name}</p>
                </div>
              ))}
            </div>
        }


      </Modal>
    </>
  );
}
export default WalletModal;


