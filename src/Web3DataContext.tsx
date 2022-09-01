import { useWeb3React } from "@web3-react/core";
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
};
const Web3Ctx = createContext<Partial<ContextProps>>({});

const Web3DataContext = ({ children }: any) => {
    const { activate, active, account, deactivate, library } = useWeb3React();
    const [addressesFromFile, setAddressesFromFile] = useState<any[]>([]);

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
        }}>
            {children}
        </Web3Ctx.Provider>
    );
}
export default Web3DataContext;
export const Web3State = () => {
    return useContext(Web3Ctx);
};