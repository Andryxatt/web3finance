import { useEffect, useState } from "react";
import { Web3State } from "../../../Web3DataContext";
import MultiSendError from "./MultiSendError";

const Summary = (props:any) =>{
    const { 
        addressesFromFile,
         countTransactions,
          totalTokensToMultiSend,
           getUserTokenBalance,
            getUserNativeBalance,
             currentNetwork,
             calculateApproximateFeeTokenNative,
              totalAmount,
              calculateApproximateFeeNative
            } = Web3State();
    const [txCount, setTxCount] = useState(0);
    const [totalTokens, setTotalTokens] = useState(0);
    const [userTokenBalance, setUserTokenBalance] = useState(0);
    const [userNativeBalance, setUserNativeBalance] = useState(0);
    const [approximateCostTx, setApproximateCostTx] = useState(0);
    const [error, setError] = useState(false);
    useEffect(()=>{
        setTxCount(countTransactions(props.isNative));
        setTotalTokens(totalTokensToMultiSend());
        const nativeBalance = async () =>{
            const balance = await getUserNativeBalance();
            setUserNativeBalance(balance);
        }
        nativeBalance();
        const tokenBalance = async () => {
            const balance = await getUserTokenBalance(props.token.address, props.token.decimal);
            if(props.ssNative){
                setUserTokenBalance(userNativeBalance);
            }
            setUserTokenBalance(balance);
        }
        tokenBalance();
        if(totalTokens > userTokenBalance ){
            setError(true);
        }
        else {
            setError(false);
        }
        const calculateCost = async () =>{
            if(props.token.isNative){
                const res = await calculateApproximateFeeNative();
                console.log("res", res);
                setApproximateCostTx(res)
            }
            else if(props.isPayToken){

            }
            else {
                const res = await calculateApproximateFeeTokenNative(props.token.address, props.token.decimal);
                setApproximateCostTx(res);
            }
        
        }
        calculateCost();
    }, [addressesFromFile, totalTokens, userTokenBalance, error])
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
                               {txCount}
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
              {error ? <MultiSendError error={`Insufficient ${!props.token.isNative ? props.token.name : currentNetwork.Currency} balance, Please have at least ${totalAmount} ${!props.token.isNative ? props.token.name : currentNetwork.Currency} `}/>: null} 

            </div>
    )
}
export default Summary;
