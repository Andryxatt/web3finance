import { useWeb3React } from "@web3-react/core";
import { useContext, createContext, useState, useEffect } from 'react';
import { connectors } from "./helpers/connectors";
import { toHex } from "./helpers/utils";


type ContextProps = {
    active: boolean,
    account: string,
    library: any,
    activate: any,
    isConnected: boolean,
    ConnectWallet?: (connectorName: string, chainId:any) => void,
    addressesFromFile: any,
    setAddressesFromFile: any,
    getUserBalanceToken: any,
    nativeTokenFeePerAddress: string,
    isFeeInToken: boolean,
    setIsFeeInToken: any,
    userTokenBalance: any,
    chainId: any,
    checkNetwork: any
};
const Web3Ctx = createContext<Partial<ContextProps>>({});

const Web3DataContext = ({ children }: any) => {
    const { activate, active, account, library, chainId } = useWeb3React();
    const [addressesFromFile, setAddressesFromFile] = useState<any[]>([]);
    const [isFeeInToken, setIsFeeInToken] = useState<boolean>(false);
    const [currentChainId, setCurrentChainId] = useState<any>(0);
    const ConnectWallet = async (connectorName: string, chainId:any) => {
        activate(connectors[connectorName]);
        setCurrentChainId(chainId);
    }
    const checkNetwork = async (networkId:any) => {
        try {
            console.log("chainId", chainId)
            console.log("networkId", networkId)
            if (chainId !== networkId) {
                await library?.provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: toHex(networkId) }]
                });
            }
        } catch (err) {
            // This error code indicates that the chain has not been added to MetaMask
            if (err.code === 4902) {
                await library?.provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId: toHex(networkId),  rpcUrls: ['https://bsctestapi.terminet.io/rpc'], chainName: 'Smartchain Testnet' }],
                });
            }
        }
    }
    useEffect(() => {
        if (active) {
            checkNetwork(currentChainId);
        }

    }, [active, account, chainId, currentChainId]);

return (
    <Web3Ctx.Provider value={{
        active: active,
        account: account!,
        library: library!,
        activate,
        ConnectWallet,
        addressesFromFile: addressesFromFile,
        setAddressesFromFile,
        isFeeInToken,
        setIsFeeInToken,
        chainId,
        checkNetwork
    }}>
        {children}
    </Web3Ctx.Provider>
);
}
export default Web3DataContext;
export const Web3State = () => {
    return useContext(Web3Ctx);
};