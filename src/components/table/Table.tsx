import Row from "./Row";
import TableHeader from "./TableHeader";
import { useAccount, useNetwork, useProvider } from "wagmi";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    currentTokensList,
    fetchTokensPricesBsc,
    fetchTokensPricesPolygon,
    fetchUserBalanceBsc,
    fetchUserBalancePolygon,
    fetchTokensPricesEth,
    fetchUserBalanceEth,
    fetchTokensPricesAvalanche,
    fetchUserBalanceAvalanche,
    fetchUserBalanceOptimism,
    fetchTokensPricesOptimism,
    fetchTokensPricesArbitrum,
    fetchUserBalanceArbitrum,
} from "../../store/token/tokenSlice";
import { changeSelectedNetwork } from "../../store/network/networkSlice";
import { ToastContainer } from "react-toastify";
import RowToken from "./RowToken";
const Table = () => {
    const { chain } = useNetwork()
    const dispatch = useAppDispatch();
    const { address, isConnected } = useAccount()
    const tokens = useAppSelector(currentTokensList)
    const provider = useProvider()
    useEffect(() => {
        const fetchTokenPricesAndBalance = async (fetchUserBalance, fetchPrices, networkId) => {
            if (isConnected && chain.id === networkId) {
                dispatch(fetchPrices({})).then(() => {
                     dispatch(fetchUserBalance({ provider, address }));
                });
            }
        };
        if(chain !== undefined){
            if (chain.id === 1) {
                fetchTokenPricesAndBalance( fetchUserBalanceEth, fetchTokensPricesEth, 1);
            }
            if (chain.id === 10) {
                fetchTokenPricesAndBalance(fetchUserBalanceOptimism, fetchTokensPricesOptimism, 10);
            }
            // else if (chain.id === 97) {
            //     fetchTokenPricesAndBalance(fetchUserBalanceBscT, fetchTokensPricesBscT, 97);
            // }
            else if (chain.id === 56) {
                fetchTokenPricesAndBalance(fetchUserBalanceBsc,fetchTokensPricesBsc, 56);
            }
            else if (chain.id === 137) {
                fetchTokenPricesAndBalance(fetchUserBalancePolygon,fetchTokensPricesPolygon, 137);
            }
            else if (chain.id === 43114) {
                fetchTokenPricesAndBalance(fetchUserBalanceAvalanche,fetchTokensPricesAvalanche, 43114);
            }
            else if (chain.id === 42161) {
                fetchTokenPricesAndBalance(fetchUserBalanceArbitrum,fetchTokensPricesArbitrum, 42161);
            }
        }
      
        // //   fetchTokenPricesAndBalance(fetchTokensPricesGoerli, fetchUserBalanceGoerli, 5);
        //   fetchTokenPricesAndBalance(fetchTokensPricesEth, fetchUserBalanceEth, 1);
        //   fetchTokenPricesAndBalance(fetchTokensPricesOptimism, fetchUserBalanceOptimism, 10);
        //   fetchTokenPricesAndBalance(fetchTokensPricesBscT, fetchUserBalanceBscT, 97);
        //   fetchTokenPricesAndBalance(fetchTokensPricesBsc, fetchUserBalanceBsc, 56);
        //   fetchTokenPricesAndBalance(fetchTokensPricesPolygon, fetchUserBalancePolygon, 137);
        //   fetchTokenPricesAndBalance(fetchTokensPricesAvalanche, fetchUserBalanceAvalanche, 43114);
        //   fetchTokenPricesAndBalance(fetchTokensPricesArbitrum, fetchUserBalanceArbitrum, 42161);
        // //   fetchTokenPricesAndBalance(fetchTokensPricesMumbai, fetchUserBalanceMumbai, 80001);
        //   fetchTokenPricesAndBalance(fetchTokensPricesOptimism, fetchUserBalanceOptimism, 10);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chain]);
    useEffect(() => {
        if (chain !== undefined) {
            dispatch(changeSelectedNetwork(chain))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chain])
    return (
        <>
            <ToastContainer />
            <TableHeader />
            {tokens && tokens.map((token: any, index: number) => {
                return <Row key={index} token={token} />
            })}
            <RowToken />
        </>
    )
}
export default Table;


