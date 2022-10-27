import { Contract, ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Web3State } from "../../../Web3DataContext";
import MultiSendError from "./MultiSendError";

const Summary = (props: any) => {
    const {
        addressesFromFile,
        totalTokensToMultiSend,
        getUserTokenBalance,
        getUserNativeBalance,
        currentNetwork,
        calculateApproximateFeeNative,
        speedNetwork,
        library,
        account
    } = Web3State();
    const [totalTokens, setTotalTokens] = useState(0);
    const [userTokenBalance, setUserTokenBalance] = useState(0);
    const [userNativeBalance, setUserNativeBalance] = useState(0);
    const [approximateCostTx, setApproximateCostTx] = useState("");
    const [txData, setTxData] = useState<any>({});
    const [error, setError] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [txGasUnits, setTxGasUnits] = useState<any>();
    const [countTransactions, setCountTransactions] = useState(0);
    const contractsAddresses = require("./../../../contracts/AddressesContracts.json")
    const OracleAbi = require("./../../../contracts/oracle/Oracle.json");
    const FeeShareAbi = require("./../../../contracts/FeeShare.json");
    const RTokenAbi = require("./../../../contracts/RTokenAbi.json");
    const MinimalForwarderAbi = require("./../../../contracts/MinimalForwarderAbi.json");
    const calculateApproximateFeeTokenNative = async () =>{
        const feeShare  = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = addressesFromFile.map((item: any) => {
            return item.amount.toString().trim();
        });
        const feePerAddressNative = await feeShare["calculateFee(address)"](props.token.address);
        const ammount = addressesFromFile.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b.amount), 0);
        setTotalAmount(ammount);
        arrayOfAmounts.unshift(ammount.toString());
        const addresses = addressesFromFile.map((item: any) => { return item.address });
        addresses.unshift(contractsAddresses[currentNetwork.name][0].FeeShare);
        // const isRToken = await feeShare.getRTokenAddress(addressToken);
        console.log(ethers.utils.formatUnits(feePerAddressNative.toString(), 'ether'), "sss");
        console.log(ethers.utils.formatUnits(feePerAddressNative.mul(addressesFromFile.length)), "feePerAddressNative");
        const adde = ethers.utils.parseEther('0.000000000000000001')
        console.log(ethers.utils.formatUnits(feePerAddressNative.mul(addressesFromFile.length).add(adde)), "feePerAddressNativea");
        const msgValue = feePerAddressNative.mul(addressesFromFile.length).add(adde);
        console.log("msgValue", msgValue);
        const txInfo = {
            value: msgValue,
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseEther(item);
        });
        const rTokenContract = new Contract(props.token.address, RTokenAbi, library?.getSigner());
        const allowance = await rTokenContract.allowance(account, contractsAddresses[currentNetwork.name][0].FeeShare);
        console.log(parseFloat(ethers.utils.formatEther(msgValue)), "parseFloat(ethers.utils.formatEther(msgValue))");
        console.log(userNativeBalance, "userNativeBalance");
        if(parseFloat(ethers.utils.formatEther(msgValue)) > userNativeBalance){
            setApproximateCostTx(ethers.utils.formatEther(msgValue))
            setError(true);
            return;
        }
            if (parseFloat(ethers.utils.formatUnits(allowance.toString(), props.token.decimal)) >= ammount) {
                const gasUsed = await feeShare.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo);
                const fee = gasUsed.mul(ethers.utils.parseUnits(speedNetwork,'gwei'));
                setApproximateCostTx(ethers.utils.formatUnits(fee.add(msgValue), 'ether'));
                if(addressesFromFile.length < 254){
                    setCountTransactions(1)
                }
                else {
                    setCountTransactions(Math.ceil(addressesFromFile.length / 254))
                }
                
            }
            else {
                const units = await rTokenContract.estimateGas.approve(contractsAddresses[currentNetwork.name][0].FeeShare, ethers.utils.parseUnits(ammount.toString(), props.token.decimal));
                if(addressesFromFile.length < 254){
                    setCountTransactions(2)
                }
                else {
                    setCountTransactions(Math.ceil(addressesFromFile.length / 254) + 1)
                }
                const fee = units.mul(ethers.utils.parseUnits(speedNetwork,'gwei'));
                setApproximateCostTx(ethers.utils.formatUnits(fee.add(msgValue), 'ether'));
                setTxGasUnits(ethers.utils.formatUnits(fee, 'ether'));
            }      
    }
    const sendTransactionToken = async () => {
        const feeShareContract = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = addressesFromFile.map((item: any) => {
            return item.amount.toString().trim();
        });
        const feePerAddressNative = await feeShareContract["calculateFee()"]();
        console.log(feePerAddressNative.toString());
        const amount = addressesFromFile.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b.amount), 0);
        console.log(amount, "amount");
        const addresses = addressesFromFile.map((item: any) => { return item.address });
        // const isRToken = await feeShareContract.getRTokenAddress(addressToken);
        // const msgValue = isRToken === null || undefined ?
        //     parseFloat('0.2') * (addressesFromFile.length) + parseFloat("0.0000000000000001") :
        //     parseFloat(feePerAddressNative!) * (addressesFromFile.length) + parseFloat("0.0000000000000001");
        const msgValue = parseFloat(ethers.utils.formatEther(feePerAddressNative!)) * (addressesFromFile.length) + parseFloat(amount.toString()) + parseFloat("0.0000000000000001");
        const txInfo = {
            value: ethers.utils.parseUnits(msgValue.toString()),
            maxFeePerGas: ethers.utils.parseUnits(speedNetwork, "gwei"),
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item, props.tokedn.decimal);
        });
        console.log(finalAmount, "finalAmount");
        const rTokenContract = new Contract(props.token.address, RTokenAbi, library?.getSigner());
        const allowance = await rTokenContract.allowance(account, contractsAddresses[currentNetwork.name][0].FeeShare);
        console.log(ethers.utils.formatUnits(allowance.toString()), "allowance");
        const idToast1 = toast.loading("Processing transaction please wait...")
        if (parseFloat(ethers.utils.formatUnits(allowance.toString(), props.token.decimal)) >= parseFloat(amount.toString())) {
            feeShareContract["multiSend(address,address[],uint256[])"](props.tokedn.address, addresses, finalAmount, txInfo)
                .then((res: any) => {
                    res.wait().then((res: any) => {
                        toast.success("Transaction sent successfully");
                        console.log(res);
                    })
                }).catch((err: any) => {
                    // console.log(err);
                    toast.update(idToast1, { render: "Rejected", type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                })
        }
        else {
            rTokenContract.approve(contractsAddresses[currentNetwork.name][0].FeeShare, ethers.utils.parseUnits(amount.toFixed(6).toString(), props.token.decimal))
                .then((res: any) => {
                    res.wait().then(async (res: any) => {
                        const units = await feeShareContract.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo)
                        setTxGasUnits(units);
                        toast.update(idToast1, { render: "All is good", type: "success", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                        toast.update(idToast1, { render: "Please wait...", isLoading: true });
                        feeShareContract["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo).then((res: any) => {
                            res.wait().then((res: any) => {
                                toast.update(idToast1, { render: "All is good", type: "success", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                                console.log(res)
                            })
                        })
                    }).catch((err: any) => {
                        toast.update(idToast1, { render: "Rejected", type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                    })
                }).catch((err: any) => {
                    toast.update(idToast1, { render: "Rejected", type: "error", autoClose: 2000, isLoading: false });
                });
        }
    }
     

   
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
       
       
    },[getUserNativeBalance, getUserTokenBalance, props.isNative, props.token.address, props.token.decimal, totalTokensToMultiSend]);
    useEffect(()=>{
        calculateApproximateFeeTokenNative();
    },[speedNetwork, userNativeBalance])
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
