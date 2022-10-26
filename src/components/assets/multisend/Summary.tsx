import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { Web3State } from "../../../Web3DataContext";
import MultiSendError from "./MultiSendError";

const Summary = (props: any) => {
    const {
        addressesFromFile,
        countTransactions,
        totalTokensToMultiSend,
        getUserTokenBalance,
        getUserNativeBalance,
        currentNetwork,
        calculateApproximateFeeTokenNative,
        totalAmount,
        calculateApproximateFeeNative,
        speedNetwork,
        txGasUnits
    } = Web3State();
    const [totalTokens, setTotalTokens] = useState(0);
    const [userTokenBalance, setUserTokenBalance] = useState(0);
    const [userNativeBalance, setUserNativeBalance] = useState(0);
    const [approximateCostTx, setApproximateCostTx] = useState(0);
    const [error, setError] = useState(false);
    const calculateCost = useCallback(() => {
        if (props.token.isNative) {
             calculateApproximateFeeNative();
             const res = ethers.utils.parseUnits(speedNetwork, "gwei").mul(txGasUnits)
             setApproximateCostTx(parseFloat(ethers.utils.formatUnits(res, 'ether')));
         }
         // else if (props.isPayToken) {
         //     const res = await calculateApproximateFeeTokenNative(props.token.address, props.token.decimal);
         //     console.log("res", res);
         //     setApproximateCostTx(res)
         // }
         else {
              calculateApproximateFeeTokenNative(props.token.address, props.token.decimal);
             const res = ethers.utils.parseUnits(speedNetwork, "gwei").mul(txGasUnits);
             console.log("res", res);
             setApproximateCostTx(parseFloat(ethers.utils.formatUnits(res, 'ether')));
         }
    },[props.token.isNative, props.token.address, props.token.decimal, speedNetwork, txGasUnits, calculateApproximateFeeNative, calculateApproximateFeeTokenNative]);
 

    
    useEffect(() => {
        
        setTotalTokens(totalTokensToMultiSend());
        const nativeBalance = async () => {
            const balance = await getUserNativeBalance();
            setUserNativeBalance(balance);
            if (props.isNative) {
                setUserTokenBalance(balance);
            }
        }
        nativeBalance();
        const tokenBalance = async () => {
            const balance = await getUserTokenBalance(props.token.address, props.token.decimal);
            if (!props.isNative) {
                setUserTokenBalance(balance);
            }
           
        }
        tokenBalance();
        calculateCost();
       
    },[calculateCost, getUserNativeBalance, getUserTokenBalance, props.isNative, props.token.address, props.token.decimal, totalTokensToMultiSend]);
    useEffect(() =>{
        console.log("totalTokens", totalTokens);
        console.log("userTokenBalance", userTokenBalance);
        if (totalTokens > userTokenBalance) {
            setError(true);
        }
        else {
            setError(false);
        }
    }, [totalTokens, userTokenBalance, error, userNativeBalance])
    useEffect(() =>{
        calculateCost();
    },[speedNetwork,calculateCost])
    return (
        <div className="mb-3">
            <h3>Summary</h3>
            <div className="bg-white flex flex-row w-full rounded-md">
                <div className="flex flex-col w-full">
                    <div className="px-3 py-3 flex flex-col border-b-2">
                        <span className="text-xl text-blue-900 font-bold">{addressesFromFile.length}</span>
                        <span className="text-xs text-gray-400">Total number of addresses </span>
                    </div>
                    <div className="px-3 py-3 flex flex-col border-b-2">
                        <span className="text-xl text-blue-900 font-bold">
                            {countTransactions}
                        </span>
                        <span className="text-xs text-gray-400">Total number of transactions needed </span>
                    </div>
                    <div className="px-3 py-3 flex flex-col">
                        <span className="text-xl text-blue-900 font-bold">
                            {approximateCostTx}
                        </span>
                        <span className="text-xs text-gray-400">Approximate cost of operation </span>
                    </div>
                </div>
                <div className="flex flex-col border-l-2 w-full">
                    <div className="px-3 py-3 flex flex-col border-b-2">
                        <span className="text-xl text-blue-900 font-bold">
                            {totalTokens}
                        </span>
                        <span className="text-xs text-gray-400">Total number of tokens to be sent </span>
                    </div>
                    <div className="px-3 py-3 flex flex-col border-b-2">
                        <span className="text-xl text-blue-900 font-bold">
                            {!props.token.isNative ? userTokenBalance : userNativeBalance} {!props.token.isNative ? props.token.name : currentNetwork.Currency}
                        </span>

                        <span className={" text-xs text-gray-400"}>
                            Your token balance
                        </span>
                    </div>
                    <div className="px-3 py-3 flex flex-col">
                        <span className="text-xl text-blue-900 font-bold">
                            {userNativeBalance} {currentNetwork.Currency}
                        </span>
                        <span className="text-xs text-gray-400">
                            Your {currentNetwork.Currency} balance
                        </span>
                    </div>
                </div>
            </div>
            {error ? <MultiSendError error={`Insufficient ${!props.token.isNative ? props.token.name : currentNetwork.Currency} balance, Please have at least ${totalAmount} ${!props.token.isNative ? props.token.name : currentNetwork.Currency} `} /> : null}

        </div>
    )
}
export default Summary;
