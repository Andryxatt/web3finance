import Row from "./Row";
import TableHeader from "./TableHeader";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    currentTokensList,
    fetchTokensPricesBsc,
    fetchTokensPricesGoerli,
    fetchTokensPricesPolygon,
    fetchUserBalanceBsc,
    fetchUserBalanceGoerli,
    fetchUserBalancePolygon
} from "../../store/token/tokenSlice";
import {  currentNetwork, changeSelectedNetwork } from "../../store/network/networkSlice";
import { ToastContainer } from "react-toastify";
import RowToken from "./RowToken";
const Table = () => {
    const { chain } = useNetwork()
    const dispatch = useAppDispatch();
    const { address, isConnected } = useAccount()
    const tokens = useAppSelector(currentTokensList)
    const network = useAppSelector(currentNetwork)
    const provider = useProvider()
    useEffect(() => {
        if(network){
            dispatch(fetchTokensPricesGoerli({})).then(() => {
                if (isConnected && network.id === 5) {
                    dispatch(fetchUserBalanceGoerli({ provider, address }))
                }
            })
            dispatch(fetchTokensPricesBsc({})).then(() => {
                if (isConnected && network.id === 97) {
                    dispatch(fetchUserBalanceBsc({ provider, address }))
                }
            })
            dispatch(fetchTokensPricesPolygon({})).then(() => {
                if (isConnected && network.id === 80001) {
                    dispatch(fetchUserBalancePolygon({ provider, address }))
                }
            })
        }
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, network, address])
    useEffect(() =>{
        if(chain !== undefined){
            dispatch(changeSelectedNetwork(chain))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[chain])
    return (
        <>
        <ToastContainer/>
            <TableHeader />
            {tokens && tokens.map((token: any, index: number) => {
                return <Row key={index} token={token} />
            })}
            <RowToken/>
        </>
    )
}
export default Table;


