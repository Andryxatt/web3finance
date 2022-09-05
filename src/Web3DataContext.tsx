import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useContext, createContext, useState, useEffect } from 'react';
import { connectors } from "./helpers/connectors";

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
};
const Web3Ctx = createContext<Partial<ContextProps>>({});

const Web3DataContext = ({ children }: any) => {
    const BalanceOfAbi = require("./contracts/balanceOfAbi.json");
    const { activate, active, account, deactivate, library } = useWeb3React();
    const [addressesFromFile, setAddressesFromFile] = useState<any[]>([]);
    const getUserBalanceToken = async (address:string, decimal:number) =>{
        const balanceOf = new Contract(address, BalanceOfAbi, library?.getSigner());
        const price = await balanceOf.balanceOf(account);
       return ethers.utils.formatUnits(price._hex, decimal);
    }
    const ConnectWallet = (connectorName: string) => {
        activate(connectors[connectorName]);
    }
    useEffect(() => {

    }, [active]);
    
    return (
        <Web3Ctx.Provider value={{
            active: active,
            account: account!,
            library: library!,
            activate: activate,
            ConnectWallet: ConnectWallet,
            addressesFromFile: addressesFromFile,
            setAddressesFromFile: setAddressesFromFile,
            getUserBalanceToken: getUserBalanceToken,
        }}>
            {children}
        </Web3Ctx.Provider>
    );
}
export default Web3DataContext;
export const Web3State = () => {
    return useContext(Web3Ctx);
};