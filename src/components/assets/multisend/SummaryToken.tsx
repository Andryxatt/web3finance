import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import MultiSendError from "./MultiSendError";
import {
    addressesToSend,
    calculateTotalAmountTokens,
    removeSendedAddress,
    selectedSpeed
} from "../../../store/multiDeposit/multiDepositSlice";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { currentNetwork } from "../../../store/network/networkSlice";
import { fetchUserBalanceGoerli } from "../../../store/token/tokenSlice";
import { useAccount, useProvider, useNetwork } from "wagmi";
import { fetchSigner } from '@wagmi/core';
import contractsAddresses from "./../../../contracts/AddressesContracts.json";
import FeeShareAbi from "./../../../contracts/FeeShare.json";
import ERC20Abi from "./../../../contracts/ERC20Abi.json";
// import MinimalForwarderAbi from "./../../../contracts/MinimalForwarderAbi.json";
import { toast } from "react-toastify";
interface TxInformation {
    method: any;
    token: any;
    addressesToSend: any[];
    finalAmount: any[];
    txInfo: {
        value: any;
    };
    isApproved: boolean;
}
export function SummaryToken(props: any) {
    const networkSpeed = useAppSelector(selectedSpeed)
    const dispatch = useAppDispatch();
    const network = useAppSelector(currentNetwork);
    const provider = useProvider();
    const { chain } = useNetwork();
    const { address, isConnected } = useAccount();
    //Preloader
    const [loading, setLoading] = useState(true);
    //Balance Native currency
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [txFee, setTxFee] = useState("0");
    const [gasPrice, setGasPrice] = useState("0");
    const [totalFee, setTotalFee] = useState("0");
    //Totak ammount of tokens to send 
    const [ammount, setAmmount] = useState("0");
    //Transaction information
    const [txToSend, setTxToSend] = useState<TxInformation>();
    //Array of addresses and amounts to send
    const addressesAndAmounts = useAppSelector(addressesToSend);
    const totalAmmountTokensToSend = useAppSelector(calculateTotalAmountTokens);
    //Errors
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [isCalculated, setIsCalculated] = useState(false);
    const [userTokenBalance, setUserTokenBalance] = useState("0");
    const [tokenDecimals, setTokenDecimals] = useState(0);
    const [tokenSymbol, setTokenSymbol] = useState("");

    const calculateTokenAndPayNative = async () => {
        setIsCalculated(false);
        setLoading(false);
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        // const rTokenAbi = await feeShare.getRTokenAddress(props.tokenAddress);
        const tokenErc20 = new Contract(props.tokenAddress, ERC20Abi, signer);
        const userBalanceToken = await tokenErc20.balanceOf(address);
        const decimals = await tokenErc20.decimals();
        const symbol = await tokenErc20.symbol();
        setTokenDecimals(decimals);
        setTokenSymbol(symbol);
        setUserTokenBalance(userBalanceToken.toString())
        let addressesArray = [];
        let amountsArray = [];
        if (addressesAndAmounts.length === 0) {
            addressesArray = [];
            amountsArray = [];
            setGasPrice("0");
            setTxFee("0");
            setTotalFee("0");
            setTotalTransactions(0);
            setAmmount("0");
            setLoading(false);
            setIsCalculated(true);
        }
        else {
            if (addressesAndAmounts.length > 253) {
                addressesArray = addressesAndAmounts.slice(0, 253).map((item: any) => {
                    return item.address;
                });
                amountsArray = addressesAndAmounts.slice(0, 253).map((item: any) => {
                    return item.amount.toString().trim();
                });
            }
            else {
                addressesArray = addressesAndAmounts.map((item: any) => {
                    return item.address;
                });
                amountsArray = addressesAndAmounts.map((item: any) => {
                    return item.amount.toString().trim();
                });
            }
            const ammountT = amountsArray.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b), 0);
            setAmmount(ammountT.toString())
            const feePerAddressNative = ethers.utils.parseUnits("200000000000000000", 'wei');
            const msgValue = feePerAddressNative.mul(addressesAndAmounts.length);
            const txInfo = {
                value: msgValue,
                "maxFeePerGas": ethers.utils.parseUnits(networkSpeed.maxFeePerGasFloat, 'gwei'),
                "maxPriorityFeePerGas": ethers.utils.parseUnits(networkSpeed.maxPriorityFeePerGasFloat, 'gwei')
            }
            const finalAmount = amountsArray.map((item: any) => {
                return ethers.utils.parseUnits(item);
            });
            const isApproved = await tokenErc20.allowance(address, contractsAddresses[network.name][0].FeeShare);
            if (ammountT > userBalanceToken) {
                setError(true);
                setErrorMessage("You don't have enough balance to pay the fee")
                setLoading(false);
                setIsCalculated(true);
            }
            if (+ethers.utils.formatUnits(isApproved, decimals) >= ammountT) {
                const txInform = {
                    method: "multiSend(address,address[],uint256[])",
                    token: props.tokenAddress,
                    addressesToSend: addressesArray,
                    finalAmount,
                    txInfo,
                    isApproved: true
                }
                if (addressesAndAmounts.length === 0) {
                    setGasPrice("0");
                    setTxFee("0");
                    setTotalFee("0");
                    setTxToSend(txInform);
                    setAmmount("0");
                    setLoading(false);
                    setIsCalculated(true);
                }
                else {
                    const unitsUsed = await feeShare.estimateGas["multiSend(address,address[],uint256[])"](props.tokenAddress, addressesArray, finalAmount, txInfo);
                    setTxToSend(txInform);
                    setGasPrice(ethers.utils.formatUnits(ethers.utils.parseUnits(networkSpeed.maxFeePerGasFloat, 'gwei').mul(unitsUsed), 'gwei'));
                    setTxFee(ethers.utils.formatUnits(feePerAddressNative.mul(addressesArray.length)))
                    setTotalFee(ethers.utils.formatEther(feePerAddressNative.mul(addressesArray.length).add(ethers.utils.parseUnits(networkSpeed.maxFeePerGasFloat, 'gwei').mul(unitsUsed))));
                    setIsCalculated(true);
                    setLoading(false);
                }
                if (addressesAndAmounts.length === 0) {
                    setTotalTransactions(0)
                }
                else {
                    setTotalTransactions(addressesAndAmounts.length / 253 === 0 ? 1 : Math.ceil(addressesAndAmounts.length / 253));
                }
            }
            else {
                const txInform = {
                    method: "multiSend(address,address[],uint256[])",
                    token: props.tokenAddress,
                    addressesToSend: addressesArray,
                    finalAmount,
                    txInfo,
                    isApproved: false
                }
                const ammountToApprove = ethers.utils.parseUnits(totalAmmountTokensToSend.toString(), decimals);
                const unitsUsed = await tokenErc20.estimateGas.approve(contractsAddresses[network.name][0].FeeShare, ammountToApprove);
                setAmmount(ammountT.toString());
                setGasPrice(ethers.utils.formatUnits(ethers.utils.parseUnits(networkSpeed.maxFeePerGasFloat, 'gwei').mul(unitsUsed)));
                setTotalFee(ethers.utils.formatUnits(ethers.utils.parseUnits(networkSpeed.maxFeePerGasFloat, 'gwei').mul(unitsUsed)));
                setTxToSend(txInform);
                setLoading(false);
                setIsCalculated(true);
                if (addressesAndAmounts.length === 0) {
                    setTotalTransactions(0)
                }
                else {
                    setTotalTransactions(addressesAndAmounts.length / 253 === 0 ? 2 : Math.ceil(addressesAndAmounts.length / 253) + 1);
                }
            }
        }
    }
    const sendTokenAndPayNative = async () => {
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        const tokenErc20 = new Contract(props.tokenAddress, ERC20Abi, signer);
        const decimals = await tokenErc20.decimals();
        const isApproved = await tokenErc20.allowance(address, contractsAddresses[network.name][0].FeeShare);
        if (parseFloat(ethers.utils.formatUnits(isApproved, decimals)) >= parseFloat(ammount)) {
            const idToastSendTokenNativeFee = toast.loading("Sending transaction please wait...")
            feeShare[txToSend.method](props.tokenAddress, txToSend.addressesToSend, txToSend.finalAmount, txToSend.txInfo).then((tx: any) => {
                tx.wait().then((receipt: any) => {
                    toast.update(idToastSendTokenNativeFee, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                    if (isConnected && network.id === 5) {
                        dispatch(fetchUserBalanceGoerli({ provider, address }))
                        dispatch(removeSendedAddress(txToSend.addressesToSend.length))
                        calculateTokenAndPayNative();
                    }
                }).catch((err: any) => {
                    console.log(err, "err")
                    toast.update(idToastSendTokenNativeFee, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                })
            }).catch((err: any) => {
                console.log(err, "err")
                toast.update(idToastSendTokenNativeFee, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
            });
        }
        else {
            const approveToast = toast.loading("Approving please wait...")
            if (network.id === 97) {
                const gasPrice = await provider.getGasPrice();
                tokenErc20.approve(contractsAddresses[network.name][0].FeeShare, ethers.utils.parseUnits(ammount, decimals), gasPrice).then((res: any) => {
                    res.wait().then(async (receipt: any) => {
                        toast.update(approveToast, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                        setTxToSend({ ...txToSend, isApproved: true });
                        await calculateTokenAndPayNative()
                        await sendTokenAndPayNative()
                    }).catch((err: any) => {
                        toast.update(approveToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                    });
                }).catch((err: any) => {
                    toast.update(approveToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                })
            }
            else {
                tokenErc20.approve(contractsAddresses[network.name][0].FeeShare, ethers.utils.parseUnits(ammount, decimals), { "maxFeePerGas": ethers.utils.parseUnits(networkSpeed.maxFeePerGasFloat, 'gwei'), "maxPriorityFeePerGas": ethers.utils.parseUnits(networkSpeed.maxPriorityFeePerGasFloat, 'gwei') }).then((res: any) => {
                    res.wait().then(async (receipt: any) => {
                        toast.update(approveToast, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                        setTxToSend({ ...txToSend, isApproved: true });
                        await calculateTokenAndPayNative()
                        await sendTokenAndPayNative()
                    }).catch((err: any) => {
                        toast.update(approveToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                    });
                }).catch((err: any) => {
                    toast.update(approveToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                })
            }
        }
    }
    useEffect(() => {
        if (networkSpeed !== undefined) {
            calculateTokenAndPayNative()
        }
    }, [addressesAndAmounts, networkSpeed]) // eslint-disable-line react-hooks/exhaustive-deps
    const sendTransaction = async () => {
        sendTokenAndPayNative()
    }
    return (
        <div className="mb-3">
            {
                loading ? <div className="loader-container justify-center flex">
                    <div className="spinner"></div>
                </div> :
                    <div>
                        <h3>Summary</h3>
                        <div className={` ${!isCalculated ? 'blur-sm' : ''} bg-white flex flex-row w-full rounded-md`}>
                            <div className="flex flex-col w-full">
                                <div className="px-3 py-3 flex flex-col border-b-2">
                                    <span className="text-xl text-blue-900 font-bold">
                                        {txToSend?.addressesToSend.length}
                                    </span>
                                    <span className="text-xs text-gray-400">Total number of addresses </span>
                                </div>
                                <div className="px-3 py-3 flex flex-col border-b-2">
                                    <span className="text-xl text-blue-900 font-bold">
                                        {totalTransactions}
                                    </span>
                                    <span className="text-xs text-gray-400">Total number of transactions needed </span>
                                </div>
                                <div className="px-3 py-3 flex flex-col">
                                    <span className="text-xl text-blue-900 font-bold">
                                        {
                                            `${parseFloat(totalFee).toFixed(12)} - ${chain?.nativeCurrency.symbol}`
                                        }
                                    </span>
                                    {
                                        <span className="text-gray-400 text-sm"> {txFee} commision fee  + {gasPrice} transaction fee </span>
                                    }
                                    <span className="text-xs text-gray-400">Approximate cost of operation </span>
                                </div>
                            </div>
                            <div className="flex flex-col border-l-2 w-full">
                                <div className="px-3 py-3 flex flex-col border-b-2">
                                    <span className="text-xl text-blue-900 font-bold">
                                        {ammount} {props.tokenSymbol}
                                    </span>
                                    <span className="text-xs text-gray-400">Total number of tokens to be sent </span>
                                </div>
                                <div className="px-3 py-3 flex flex-col border-b-2">
                                    <span className="text-xl text-blue-900 font-bold">
                                        {`${parseFloat(ethers.utils.formatUnits(userTokenBalance, tokenDecimals)).toFixed(4)} ${tokenSymbol}`}
                                    </span>
                                    <span className={" text-xs text-gray-400"}>
                                        Your token balance
                                    </span>
                                </div>
                                <div className="px-3 py-3 flex flex-col">
                                    <span className="text-xl text-blue-900 font-bold">
                                        {parseFloat(totalFee).toFixed(4)} {chain?.nativeCurrency.symbol} + {totalAmmountTokensToSend}  {tokenSymbol}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Total amount to send
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* {error ? <MultiSendError error={`Insufficient ${!props.token.isNative ? props.token.name : chain.nativeCurrency.symbol} balance, Please have at least ${totalAmmountTokensToSend} ${!props.token.isNative ? props.token.name : chain.nativeCurrency.symbol} `} /> : null} */}
                        {errorMessage ? <MultiSendError error={errorMessage} /> : null}
                        <div className="mt-2">
                            <button className="bg-blue-500 text-white font-bold px-5 py-1 mr-2 rounded-md" onClick={props.showPrev}>Prev</button>
                            {!isCalculated || error ?
                                <button className="bg-neutral-400 text-white font-bold px-5 py-1 rounded-md backdrop:blur-md" disabled>Send</button> :
                                <button className="bg-neutral-800 text-white font-bold px-5 py-1 rounded-md" onClick={sendTransaction}>Send</button>}
                        </div>
                    </div>
            }
        </div>
    )
}
export default SummaryToken;
