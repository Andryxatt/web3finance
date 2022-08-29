import { useWeb3React } from "@web3-react/core";
import { useContext, createContext, useState } from 'react';
import { connectors } from "./helpers/connectors";
type ContextProps = { 
    active: boolean,
    account: string,
    library: any,
    activate: any,
    isConnected: boolean,
    ConnectWallet?:(connectorName:string)=>void,
  };
const Web3Ctx = createContext<Partial<ContextProps>>({});

const Web3DataContext = ({ children }: any) => {
    const { activate, active, account, deactivate, library } = useWeb3React();
    const ConnectWallet = (connectorName:string) => {
        activate(connectors[connectorName]);
    }
    return (
        <Web3Ctx.Provider value={{
            active: active,
            account: account!,
            library: library!,
            activate: activate,
            ConnectWallet: ConnectWallet,
        }}>
            {children}
        </Web3Ctx.Provider>
    );
}
export default Web3DataContext;
export const Web3State = () => {
    return useContext(Web3Ctx);
};