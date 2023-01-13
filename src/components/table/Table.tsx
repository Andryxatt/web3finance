import Row from "./Row";
import TableHeader from "./TableHeader";
import { useAccount, useProvider } from "wagmi";
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
import { currentNetwork } from "../../store/network/networkSlice";
const Table = () => {
    const dispatch = useAppDispatch();
    const { address, isConnected } = useAccount()
    const tokens = useAppSelector(currentTokensList)
    const network = useAppSelector(currentNetwork)
    const provider = useProvider()
    useEffect(() => {
        console.log(network)
        dispatch(fetchTokensPricesGoerli({})).then(() => {
            if (isConnected && network.chainId === 5) {
                dispatch(fetchUserBalanceGoerli({ provider, address }))
            }
        })
        dispatch(fetchTokensPricesBsc({})).then(() => {
            if (isConnected && network.chainId === 97) {
                dispatch(fetchUserBalanceBsc({ provider, address }))
            }
        })
        dispatch(fetchTokensPricesPolygon({})).then(() => {
            if (isConnected && network.chainId === 80001) {
                dispatch(fetchUserBalancePolygon({ provider, address }))
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, network])
    return (
        <>
            <TableHeader />
            {tokens && tokens.map((element: any, index: number) => {
                return <Row key={index} element={element} />
            })}
        </>
    )
}
export default Table;


