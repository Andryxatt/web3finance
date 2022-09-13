import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useContext, createContext, useState, useEffect } from 'react';
import { connectors } from "./helpers/connectors";
import ContractsAdresses from "./contracts/AddressesContracts.json";
import OracleAbi from "./contracts/oracle/Oracle.json";
import FeeShareAbi from "./contracts/FeeShare.json";
import { toHex } from "./helpers/utils";

type ContextProps = {
    active: boolean,
    account: string,
    library: any,
    activate: any,
    isConnected: boolean,
    ConnectWallet?: (connectorName: string) => void,
    addressesFromFile: any,
    setAddressesFromFile: any,
    getUserBalanceToken: any,
    getAssetFeePerAddress: any,
    nativeTokenFeePerAddress: string
};
const Web3Ctx = createContext<Partial<ContextProps>>({});

const Web3DataContext = ({ children }: any) => {
    const BalanceOfAbi = require("./contracts/balanceOfAbi.json");
    
    const { activate, active, account, deactivate, library, chainId } = useWeb3React();
    const [addressesFromFile, setAddressesFromFile] = useState<any[]>([]);
    const [nativeTokenFeePerAddress, setNativeTokenFeePerAddress] = useState("");

    const getAssetFeePerAddress = async () => {
        const oracleContract = new Contract(ContractsAdresses.oracle, OracleAbi, library.getSigner());
        const feeShareContract = new Contract(ContractsAdresses.feeShare, FeeShareAbi, library.getSigner());
        console.log(feeShareContract);
        console.log("oracleContract", oracleContract);
        const res = await feeShareContract.calculateFee();
        setNativeTokenFeePerAddress(ethers.utils.formatUnits(res, 18));
    }
    const getUserBalanceToken = async (address:string, decimal:number) =>{
        const balanceOf = new Contract(address, BalanceOfAbi, library?.getSigner());
        const price = await balanceOf.balanceOf(account);
       return ethers.utils.formatUnits(price._hex, decimal);
    }
    const ConnectWallet = async (connectorName: string) => {
       
        activate(connectors[connectorName]);
        
    }
    useEffect(() => {
        if(active){
            getAssetFeePerAddress();
            console.log("chainId", chainId);
            library?.provider.request({
               method: "wallet_switchEthereumChain",
               params: [{ chainId: toHex(4) }]
             });
       }
    }, [active, chainId]);
    
    return (
        <Web3Ctx.Provider value={{
            active: active,
            account: account!,
            library: library!,
            activate,
            ConnectWallet,
            addressesFromFile: addressesFromFile,
            setAddressesFromFile,
            getUserBalanceToken,
            getAssetFeePerAddress,
            nativeTokenFeePerAddress
        }}>
            {children}
        </Web3Ctx.Provider>
    );
}
export default Web3DataContext;
export const Web3State = () => {
    return useContext(Web3Ctx);
};