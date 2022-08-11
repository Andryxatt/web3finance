import { useWeb3React } from "@web3-react/core";
import { toHex } from "../../helpers/utils";

function WalletNetwork({ name, icon }: any) {
  const {
    library,
    active,
    chainId
  } = useWeb3React();
  const switchNetwork = async (e: any) => {
    document.querySelectorAll(".network_wrapper").forEach((el: any) => {
      el.classList.remove("active-network");
    })
    e.currentTarget.className = "network_wrapper active-network";

    let newChainId = 0;
    switch (name) {
      case "Rinkeby Testnet":
        newChainId = 4;
        break;
      case "Polygon (Matic)":
        newChainId = 137;
        break;
      case "Binance Smart Chain":
        newChainId = 56;
        break;
      case "Ethereum":
        newChainId = 1;
        break;
      default:
        newChainId = 1;
        break;
    }
     if (active) {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(newChainId) }]
      });
     }
  }
  return (
    <div className="network_wrapper" onClick={(e) => { switchNetwork(e) }}>
      <img src={icon} />
      <span>{name}</span>
    </div>
  )
}
export default WalletNetwork;