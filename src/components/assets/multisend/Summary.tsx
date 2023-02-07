import { Contract, ethers, Wallet } from "ethers";
import { useEffect, useState } from "react";
import MultiSendError from "./MultiSendError";
import {
    addressesToSend,
    totalAddresses,
    calculateTotalAmountTokens,
    removeSendedAddress
} from "../../../store/multiDeposit/multiDepositSlice";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { currentNetwork } from "../../../store/network/networkSlice";
import { nativeBalance, fetchUserBalanceGoerli } from "../../../store/token/tokenSlice";
import { useAccount, useProvider, useNetwork } from "wagmi";
import { fetchSigner, signTypedData } from '@wagmi/core';
import contractsAddresses from "./../../../contracts/AddressesContracts.json";
import FeeShareAbi from "./../../../contracts/FeeShare.json";
import RTokenAbi from "./../../../contracts/RTokenAbi.json";
import MinimalForwarderAbi from "./../../../contracts/MinimalForwarderAbi.json";
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
export function Summary(props: any) {
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    const balanceNative = useAppSelector(nativeBalance);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [txFee, setTxFee] = useState("0");
    const [gasPrice, setGasPrice] = useState("0");
    const [totalFee, setTotalFee] = useState("0");
    //Totak ammount of tokens to send 
    const [ammount, setAmmount] = useState("0");
    const [txToSend, setTxToSend] = useState<TxInformation>();
    const [signedTxToSend, setSignedTxToSend] = useState<any>();
    const addressesAndAmounts = useAppSelector(addressesToSend);
    const network = useAppSelector(currentNetwork);
    const countAddresses = useAppSelector(totalAddresses);
    const totalAmmountTokensToSend = useAppSelector(calculateTotalAmountTokens);
    const provider = useProvider();
    const { address, isConnected } = useAccount();

    const { chain } = useNetwork();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const calculateNative = async () => {
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        const feePerAddressNative = await feeShare["calculateFee()"]();
        if (addressesAndAmounts.length === 0) {
            setTotalTransactions(0)
        }
        else {
            setTotalTransactions(addressesAndAmounts.length / 253 === 0 ? 1 : Math.ceil(addressesAndAmounts.length / 253));
        }
        let addressesArray = [];
        let amountsArray = [];
        if (addressesAndAmounts.length === 0) {
            addressesArray = [];
            amountsArray = [];
        }
        else if (addressesAndAmounts.length > 253) {
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
            amountsArray = addressesAndAmounts.slice(0, 253).map((item: any) => {
                return item.amount.toString().trim();
            });
        }
        const totalTokensToSend = addressesArray.length;
        const totalAmmountTokens = amountsArray.reduce((acc: any, b: any) => (acc + +b), 0);
        const finalAmount = amountsArray.map((item: any) => {
            return ethers.utils.parseUnits(item);
        });

        finalAmount.unshift(ethers.utils.parseUnits(totalAmmountTokens.toFixed(5).toString()));
        addressesArray.unshift(contractsAddresses[network.name][0].FeeShare);
        const msgValue = feePerAddressNative.mul(totalTokensToSend).add(ethers.utils.parseEther(totalAmmountTokens.toFixed(5).toString()));
        const txInfo = {
            value: msgValue,
        }

        const txInform = {
            method: "multiSend(address[],uint256[])",
            token: props.token.address,
            addressesToSend: addressesArray,
            finalAmount,
            txInfo,
            isApproved: true
        }
        try {
            if (addressesAndAmounts.length === 0) {
                setGasPrice("0");
                setTxFee("0");
                setTotalFee("0");
                setTxToSend(txInform);
                setAmmount("0");
                setLoading(false);
            }
            else {
                const unitsUsed = await feeShare.estimateGas["multiSend(address[],uint256[])"](addressesArray, finalAmount, txInfo);
                const gasPrices = await provider.getGasPrice();
                setGasPrice(ethers.utils.formatUnits(gasPrices.mul(unitsUsed)));
                setTxFee(ethers.utils.formatUnits(feePerAddressNative.mul(totalTokensToSend)))
                setTotalFee(ethers.utils.formatUnits(feePerAddressNative.mul(totalTokensToSend).add(gasPrices.mul(unitsUsed))));
                setTxToSend(txInform);
                setAmmount(totalAmmountTokens.toFixed(5).toString());
                setLoading(false);
            }

        }
        catch {
            setError(true);
            setErrorMessage("You don't have enough balance to pay the fee")
            setLoading(false);
        }
    }
    const sendNativeTx = async () => {
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        const idToast = toast.loading("Sending transaction please wait...")
        feeShare[txToSend.method](txToSend.addressesToSend, txToSend.finalAmount, txToSend.txInfo).then((tx: any) => {
            tx.wait().then(async (receipt: any) => {
                if (isConnected && network.id === 5) {
                    toast.update(idToast, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                    dispatch(fetchUserBalanceGoerli({ provider, address }))
                    dispatch(removeSendedAddress(txToSend.finalAmount.length - 1))
                }
            }).catch((err: any) => {
                toast.update(idToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
            })
        }).catch((err: any) => {
            toast.update(idToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
        });

    }
    const calculateTokenAndPayNative = async () => {
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        const feePerAddressNative = await feeShare["calculateFee()"]();
        let addressesArray = [];
        let amountsArray = [];
        if (addressesAndAmounts.length === 0) {
            addressesArray = [];
            amountsArray = [];
        }
        else if (addressesAndAmounts.length > 253) {
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
            amountsArray = addressesAndAmounts.slice(0, 253).map((item: any) => {
                return item.amount.toString().trim();
            });
        }
        const ammountT = amountsArray.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b), 0);
        console.log(ammountT)
        setAmmount(ammountT.toFixed(5).toString())
        const msgValue = feePerAddressNative.mul(addressesAndAmounts.length);
        const txInfo = {
            value: msgValue,
        }
        const finalAmount = amountsArray.map((item: any) => {
            return ethers.utils.parseUnits(item);
        });
        const tokenContract = new Contract(props.token.address, RTokenAbi, signer);
        const isApproved = await tokenContract.allowance(address, contractsAddresses[network.name][0].FeeShare);
        if (ammountT > props.token.userBalance) {
            setError(true);
            setErrorMessage("You don't have enough balance to pay the fee")
            setLoading(false);
        }
        console.log(isApproved, "isApproved")
        if (parseFloat(ethers.utils.formatUnits(isApproved, props.token.decimal)) >= ammountT.toFixed(5)) {
            console.log("isApproved")
            const txInform = {
                method: "multiSend(address,address[],uint256[])",
                token: props.token.address,
                addressesToSend:addressesArray,
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
            }
            else {
            const unitsUsed = await feeShare.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addressesArray, finalAmount, txInfo);
            console.log(unitsUsed, "unitsUsed")
            const gasPrices = await provider.getGasPrice();
            setGasPrice(ethers.utils.formatUnits(gasPrices.mul(unitsUsed)));
            setTxFee(ethers.utils.formatUnits(feePerAddressNative.mul(addressesArray.length)))
            setTotalFee(ethers.utils.formatUnits(feePerAddressNative.mul(addressesArray.length).add(gasPrices.mul(unitsUsed))));
            setTxToSend(txInform);
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
                token: props.token.address,
                addressesToSend:addressesArray,
                finalAmount,
                txInfo,
                isApproved: false
            }
            const ammountToApprove = ethers.utils.parseUnits(totalAmmountTokensToSend.toString(), props.token.decimal);
            const unitsUsed = await tokenContract.estimateGas.approve(contractsAddresses[network.name][0].FeeShare,ammountToApprove);
            const gasPrices = await provider.getGasPrice();
            setAmmount(ammountT.toString());
            setGasPrice(ethers.utils.formatUnits(gasPrices.mul(unitsUsed)));
            setTotalFee(ethers.utils.formatUnits(gasPrices.mul(unitsUsed)));
            setTxToSend(txInform);
            setLoading(false);
            if (addressesAndAmounts.length === 0) {
                setTotalTransactions(0)
            }
            else {
                setTotalTransactions(addressesAndAmounts.length / 253 === 0 ? 2 : Math.ceil(addressesAndAmounts.length / 253) + 1);
            }
        }
    }
    const sendTokenAndPayNative = async () => {
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
       
        if (txToSend.isApproved) {
            const idToast = toast.loading("Sending transaction please wait...")
            feeShare[txToSend.method](props.token.address, txToSend.addressesToSend, txToSend.finalAmount, txToSend.txInfo).then((tx: any) => {
                tx.wait().then((receipt: any) => {
                    console.log(receipt, "receipt")
                    if (isConnected && network.chainId === 5) {
                        toast.update(idToast, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                        dispatch(fetchUserBalanceGoerli({ provider, address }))
                        dispatch(removeSendedAddress(txToSend.finalAmount.length))
                    }
                }).catch((err: any) => {
                    console.log(err, "err")
                    toast.update(idToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                })
            }).catch((err: any) => {
                console.log(err, "err")
                toast.update(idToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
            });
        }
        else {
            const tokenContract = new Contract(props.token.address, RTokenAbi, signer);
            const idToast = toast.loading("Approving please wait...")
            tokenContract.approve(contractsAddresses[network.name][0].FeeShare, ethers.utils.parseUnits(ammount, props.token.decimal)).then((res:any)=>{
                res.wait().then((receipt: any) => {
                    calculateTokenAndPayNative()
                }).catch((err: any) => {
                    toast.update(idToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                 });
            }).catch((err:any)=>{
                toast.update(idToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
            })
            
        }

    }

    const calculateTokenAndPayToken = async () => {
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        //first 
        if (addressesAndAmounts.length === 0) {
            setTotalTransactions(0)
        }
        else {
            setTotalTransactions(addressesAndAmounts.length / 253 === 0 ? 1 : Math.ceil(addressesAndAmounts.length / 253));
        }
        let addressesArray = [];
        let amountsArray = [];
        if (addressesAndAmounts.length === 0) {
            addressesArray = [];
            amountsArray = [];
        }
        else if (addressesAndAmounts.length > 253) {
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
            amountsArray = addressesAndAmounts.slice(0, 253).map((item: any) => {
                return item.amount.toString().trim();
            });
        }
        const ammountT = amountsArray.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b), 0);
        setAmmount(ammountT.toString())
        const finalAmount = amountsArray.map((item: any) => {
            return ethers.utils.parseUnits(item);
        });
        const txFeeInEthPerAddress = await feeShare["calculateFee(address)"](props.token.address);
        const unitsUsed = await feeShare.estimateGas["multiSendFee(address,address[],uint256[],uint256)"](props.token.address, addressesArray, finalAmount, 0);
        const gasPrice = await provider.getGasPrice();
        const txFeeInToken = await feeShare["calculateTxfeeToken(address,uint256)"](props.token.address, gasPrice.mul(unitsUsed));
        setTotalFee(ethers.utils.formatUnits(txFeeInToken.add(txFeeInEthPerAddress.mul(addressesArray.length)), props.token.decimal))
        const minimalForwarderContract = new Contract(contractsAddresses[network.name][0].MinimalForwarder, MinimalForwarderAbi, signer);
        const dataMessage = new ethers.utils.Interface(FeeShareAbi).encodeFunctionData("multiSendFee", [props.token.address, addressesArray, finalAmount, 0]) as any;
        if(totalAmmountTokensToSend > props.token.userBalanceDeposit){
            setError(true);
            setErrorMessage("You don't have enough balance token to pay the fee")
        }
        const nonce = await minimalForwarderContract.getNonce(address);
        const values = {
            from: address,
            to: contractsAddresses[network.name][0].FeeShare,
            value: 0,
            gas: 210000,
            nonce: nonce.toString(),
            data: dataMessage,
        }

        setSignedTxToSend(values);
        setLoading(false);
    }
    const signMetaTx = async (req: any) => {
        // return signature
        console.log(req, "req");
        const signature = await signTypedData({
            domain: {
                chainId: chain.id,
                name: 'FeeShare',
                verifyingContract: contractsAddresses[network.name][0].MinimalForwarder,
                version: '1.0.0',
            },
            types: {
                // Refer to PrimaryType
                ForwardRequest: [
                    { name: 'from', type: 'address' },
                    { name: 'to', type: 'address' },
                    { name: 'value', type: 'uint256' },
                    { name: 'gas', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'data', type: 'bytes' },
                ],
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                ],
            },
            value: {
                from: req.from,
                to: req.to,
                value: ethers.BigNumber.from("0"),
                gas: ethers.BigNumber.from("210000"),
                nonce: req.nonce.toString(),
                data: req.data.toString(),
            },
        })
        return signature;
    }
    const sendSignedTransaction = async () => {
        const signature = await signMetaTx(signedTxToSend);
        const dataBuffer = { 'values': signedTxToSend, 'signature': signature }
        const walletPrivateKey = new Wallet("2c920d0376137f6cd630bb0150fe994b9cb8b5907a35969373e2b35f0bc2940d");
        let walletSigner = walletPrivateKey.connect(provider)
        const contractForwarder = new ethers.Contract(
            contractsAddresses[network.name][0].MinimalForwarder,
            MinimalForwarderAbi,
            walletSigner
        );
        const result = await contractForwarder.execute(dataBuffer.values, dataBuffer.signature);
        console.log(result, "result");
    }

    useEffect(() => {
        if (props.token.isOpen) {
            if (props.isNative) {
                calculateNative()
            }
            else if (!props.isNativeFee) {
                calculateTokenAndPayNative()
            }
            else {
                calculateTokenAndPayToken()
            }
        }
    }, [addressesAndAmounts]) // eslint-disable-line react-hooks/exhaustive-deps
    const sendTransaction = async () => {
        console.log("sendTransaction");
        if (props.isNative) {
            sendNativeTx()
        }
        else if (!props.isNativeFee) {
            sendTokenAndPayNative()
        }
        else {
            sendSignedTransaction()
        }
    }
    return (
        <div className="mb-3">
            {
                loading ? <div className="loader-container justify-center flex">
                    <div className="spinner"></div>
                </div> :
                    <div>
                        <h3>Summary</h3>
                        <div className="bg-white flex flex-row w-full rounded-md">
                            <div className="flex flex-col w-full">
                                <div className="px-3 py-3 flex flex-col border-b-2">
                                    <span className="text-xl text-blue-900 font-bold">
                                        {countAddresses}
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
                                        props.isNativeFee ?  `${parseFloat(totalFee).toFixed(12)} - ${props.token.name}`  :  `${parseFloat(totalFee).toFixed(12)} - ${chain.nativeCurrency.symbol}`
                                        }
                                     </span>
                                    {
                                        props.isNativeFee ? "" : <span className="text-gray-400 text-sm"> {txFee} commision fee  + {gasPrice} gas price </span>
                                    }
                                    
                                    <span className="text-xs text-gray-400">Approximate cost of operation </span>
                                </div>
                            </div>
                            <div className="flex flex-col border-l-2 w-full">
                                <div className="px-3 py-3 flex flex-col border-b-2">
                                    <span className="text-xl text-blue-900 font-bold">
                                        {ammount} {props.token.name}
                                    </span>
                                    <span className="text-xs text-gray-400">Total number of tokens to be sent </span>
                                </div>
                                <div className="px-3 py-3 flex flex-col border-b-2">
                                    <span className="text-xl text-blue-900 font-bold">
                                        {!props.isNativeFee ? `${parseFloat(props.token.userBalance).toFixed(4)} ${props.token.name}` : `${parseFloat(props.token.userBalanceDeposit).toFixed(4)}  ${props.token.name}`}
                                    </span>
                                    <span className={" text-xs text-gray-400"}>
                                        Your token balance {props.isNativeFee ? " deposited in the contract" : ""}
                                    </span>
                                </div>
                                <div className="px-3 py-3 flex flex-col">
                                    <span className="text-xl text-blue-900 font-bold">
                                        {parseFloat(balanceNative[0].userBalance).toFixed(4)} {chain.nativeCurrency.symbol}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Your native currency balance
                                    </span>
                                </div>
                            </div>
                        </div>
                        {error ? <MultiSendError error={`Insufficient ${!props.token.isNative ? props.token.name : chain.nativeCurrency.symbol} balance, Please have at least ${totalAmmountTokensToSend} ${!props.token.isNative ? props.token.name : chain.nativeCurrency.symbol} `} /> : null}
                        {errorMessage ? <MultiSendError error={"Not enoth value to send transaction"} /> : null}
                        <div className="mt-2">
                            <button className="bg-blue-500 text-white font-bold px-5 py-1 mr-2 rounded-md" onClick={props.showPrev}>Prev</button>
                            {error ?
                                <button className="bg-neutral-400 text-white font-bold px-5 py-1 rounded-md" disabled onClick={sendTransaction}>Send</button> :
                                <button className="bg-neutral-800 text-white font-bold px-5 py-1 rounded-md" onClick={sendTransaction}>Send</button>}
                        </div>
                    </div>
            }



        </div>
    )
}
export default Summary;
