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
    fetchTokensPricesBscT,
    fetchUserBalanceBscT,
    fetchTokensPricesEth,
    fetchUserBalanceEth,
    fetchTokensPricesAvalanche,
    fetchUserBalanceAvalanche,
    fetchUserBalanceOptimism,
    fetchTokensPricesOptimism,
    fetchTokensPricesArbitrum,
    fetchUserBalanceArbitrum,
} from "../../store/token/tokenSlice";
import { currentNetwork, changeSelectedNetwork } from "../../store/network/networkSlice";
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
        console.log("network", chain)
        if(chain){
            dispatch(fetchTokensPricesEth({})).then(() => {
                if (isConnected && chain.id === 1) {
                    dispatch(fetchUserBalanceEth({ provider, address }))
                }
            })
            dispatch(fetchTokensPricesBscT({})).then(() => {
                if (isConnected && chain.id === 97) {
                    dispatch(fetchUserBalanceBscT({ provider, address }))
                }
            })
            dispatch(fetchTokensPricesBsc({})).then(() => {
                if (isConnected && chain.id === 56) {
                    dispatch(fetchUserBalanceBsc({ provider, address }))
                }
            })
            dispatch(fetchTokensPricesPolygon({})).then(() => {
                if (isConnected && chain.id === 137) {
                    dispatch(fetchUserBalancePolygon({ provider, address }))
                }
            })
            dispatch(fetchTokensPricesAvalanche({})).then(() => {
                if (isConnected && chain.id === 43114) {
                    dispatch(fetchUserBalanceAvalanche({ provider, address }))
                }
            })
            dispatch(fetchTokensPricesArbitrum({})).then(() => {
                if (isConnected && chain.id === 42161) {
                    dispatch(fetchUserBalanceArbitrum({ provider, address }))
                }
            })
            dispatch(fetchTokensPricesOptimism({})).then(() => {
                if (isConnected && chain.id === 10) {
                    dispatch(fetchUserBalanceOptimism({ provider, address }))
                }
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, chain, address, network])
    // useEffect(() => {

    //     const fetchTokenPricesAndBalance = async (fetchTokenPrices, fetchUserBalance, networkId) => {
    //         await dispatch(fetchTokenPrices({}));
    //         if (isConnected && network.id === networkId) {
    //           await dispatch(fetchUserBalance({ provider, address }));
    //         }
    //     };

    //     if (network.id === 1) {
    //         fetchTokenPricesAndBalance(fetchTokensPricesEth, fetchUserBalanceEth, 1);
    //     }
    //     if (network.id === 10) {
    //         fetchTokenPricesAndBalance(fetchTokensPricesOptimism, fetchUserBalanceOptimism, 10);
    //     }
    //     else if (network.id === 97) {
    //         fetchTokenPricesAndBalance(fetchTokensPricesBscT, fetchUserBalanceBscT, 97);
    //     }
    //     else if (network.id === 56) {
    //         fetchTokenPricesAndBalance(fetchTokensPricesBsc, fetchUserBalanceBsc, 56);
    //     }
    //     else if (network.id === 137) {
    //         fetchTokenPricesAndBalance(fetchTokensPricesPolygon, fetchUserBalancePolygon, 137);
    //     }
    //     else if (network.id === 43114) {
    //         fetchTokenPricesAndBalance(fetchTokensPricesAvalanche, fetchUserBalanceAvalanche, 43114);
    //     }
    //     else if (network.id === 42161) {
    //         fetchTokenPricesAndBalance(fetchTokensPricesArbitrum, fetchUserBalanceArbitrum, 42161);
    //     }
    //     // //   fetchTokenPricesAndBalance(fetchTokensPricesGoerli, fetchUserBalanceGoerli, 5);
    //     //   fetchTokenPricesAndBalance(fetchTokensPricesEth, fetchUserBalanceEth, 1);
    //     //   fetchTokenPricesAndBalance(fetchTokensPricesOptimism, fetchUserBalanceOptimism, 10);
    //     //   fetchTokenPricesAndBalance(fetchTokensPricesBscT, fetchUserBalanceBscT, 97);
    //     //   fetchTokenPricesAndBalance(fetchTokensPricesBsc, fetchUserBalanceBsc, 56);
    //     //   fetchTokenPricesAndBalance(fetchTokensPricesPolygon, fetchUserBalancePolygon, 137);
    //     //   fetchTokenPricesAndBalance(fetchTokensPricesAvalanche, fetchUserBalanceAvalanche, 43114);
    //     //   fetchTokenPricesAndBalance(fetchTokensPricesArbitrum, fetchUserBalanceArbitrum, 42161);
    //     // //   fetchTokenPricesAndBalance(fetchTokensPricesMumbai, fetchUserBalanceMumbai, 80001);
    //     //   fetchTokenPricesAndBalance(fetchTokensPricesOptimism, fetchUserBalanceOptimism, 10);

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [network]);
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


