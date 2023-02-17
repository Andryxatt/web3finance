import { Contract, ethers, Wallet } from "ethers";
import { useEffect, useRef, useState } from "react";
import MultiSendError from "./MultiSendError";
import {
    addressesToSend,
    calculateTotalAmountTokens,
    removeSendedAddress,
    selectedSpeed
} from "../../../store/multiDeposit/multiDepositSlice";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { currentNetwork } from "../../../store/network/networkSlice";
import { fetchUserBalanceGoerli, fetchUserBalancePolygon, fetchUserBalanceBsc } from "../../../store/token/tokenSlice";
import { useAccount, useProvider, useNetwork, useContractEvent } from "wagmi";
import { fetchSigner, signTypedData } from '@wagmi/core';
import contractsAddresses from "./../../../contracts/AddressesContracts.json";
import FeeShareAbi from "./../../../contracts/FeeShare.json";
import RTokenAbi from "./../../../contracts/RTokenAbi.json";
import MinimalForwarderAbi from "./../../../contracts/MinimalForwarderAbi.json";
import { toast, ToastContainer } from "react-toastify";
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
    //Signed transaction
    const [signedTxToSend, setSignedTxToSend] = useState<any>();
    //Array of addresses and amounts to send
    const addressesAndAmounts = useAppSelector(addressesToSend);
    const totalAmmountTokensToSend = useAppSelector(calculateTotalAmountTokens);
    //Errors
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [feeShareAddress, setFeeShareAddress] = useState();

    const toastId = useRef(null);
    const [isCalculated, setIsCalculated] = useState(false);
    const toastPayToken = () => toastId.current = toast("Sending transaction please wait...", { autoClose: false });
   
    useContractEvent({
        address: feeShareAddress,
        abi: FeeShareAbi,
        eventName: 'feeDetails',
        listener(amm1, amm2, amm3, amm4, amm5, amm6) {
            toast.update(toastId.current, { render: "Transaction successfully!", type: toast.TYPE.SUCCESS, autoClose: 3000 });
            dispatch(fetchUserBalanceGoerli({ provider, address }))
            dispatch(removeSendedAddress(txToSend.addressesToSend.length))
            calculateTokenAndPayToken();
         },
        once: true,
    })
    useEffect(() => {
        if(network){
            setFeeShareAddress(contractsAddresses[network.name][0].FeeShare);
        }
        
    }, [network]);
  
    const calculateNative = async () => {
        setIsCalculated(false)
        setError(false);
        setErrorMessage('');
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
        const totalAmmountTokens = amountsArray.reduce((acc: any, b: any) => (acc + +b), 0.0);
        const finalAmount = amountsArray.map((item: any) => {
            return ethers.utils.parseUnits(item);
        });

        finalAmount.unshift(ethers.utils.parseUnits(totalAmmountTokens.toString()));
        addressesArray.unshift(contractsAddresses[network.name][0].FeeShare);
        const msgValue = feePerAddressNative.mul(totalTokensToSend).add(ethers.utils.parseEther(totalAmmountTokens.toString()));
        const txInfo = {
            value: msgValue,
            "maxFeePerGas":ethers.utils.parseUnits(networkSpeed.maxFeePerGas.toString(), 'gwei'),
            "maxPriorityFeePerGas": ethers.utils.parseUnits(networkSpeed.maxPriorityFeePerGas.toFixed(2), 'gwei')
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
                setIsCalculated(true);
            }
            else {
                const unitsUsed = await feeShare.estimateGas["multiSend(address[],uint256[])"](addressesArray, finalAmount, txInfo);
             
                setGasPrice(ethers.utils.formatUnits(ethers.utils.parseUnits(networkSpeed.maxFeePerGas.toString(), 'gwei').mul(unitsUsed)));
                setTxFee(ethers.utils.formatUnits(feePerAddressNative.mul(totalTokensToSend)))
                setTotalFee(ethers.utils.formatUnits(feePerAddressNative.mul(totalTokensToSend).add(ethers.utils.parseUnits(networkSpeed.maxFeePerGas.toString(), 'gwei').mul(unitsUsed))));
                setTxToSend(txInform);
                setAmmount(totalAmmountTokens.toString());
                setLoading(false);
                setIsCalculated(true);
            }

        }
        catch {
            setError(true);
            setErrorMessage("Gas price too low")
            setLoading(false);
            setIsCalculated(true);
        }
    }
    const sendNativeTx = async () => {
        setIsCalculated(false);
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        const idToast = toast.loading("Sending transaction please wait...")
        feeShare[txToSend.method](txToSend.addressesToSend, txToSend.finalAmount, txToSend.txInfo).then((tx: any) => {
            tx.wait().then(async (receipt: any) => {
                dispatch(removeSendedAddress(txToSend.addressesToSend.length));
                setIsCalculated(true);
                toast.update(idToast, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                if (isConnected && network.id === 5) {
                    dispatch(fetchUserBalanceGoerli({ provider, address }))
                }
                else if(isConnected && network.id === 80001){
                    dispatch(fetchUserBalancePolygon({ provider, address }))
                }
                else if(isConnected && network.id === 97){
                    dispatch(fetchUserBalanceBsc({ provider, address }))
                }
            }).catch((err: any) => {
                toast.update(idToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                setIsCalculated(true);
            })
        }).catch((err: any) => {
            toast.update(idToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
            setIsCalculated(true);
        });

    }

    const calculateTokenAndPayNative = async () => {
        setIsCalculated(false);
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        const feePerAddressNative = await feeShare["calculateFee()"]();
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
            const msgValue = feePerAddressNative.mul(addressesAndAmounts.length);
            const txInfo = {
                value: msgValue,
                "maxFeePerGas":ethers.utils.parseUnits(networkSpeed.maxFeePerGas.toString(), 'gwei'),
                "maxPriorityFeePerGas":ethers.utils.parseUnits(networkSpeed.maxPriorityFeePerGas.toFixed(2), 'gwei'),
                
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
                setIsCalculated(true);
            }
            if (+ethers.utils.formatUnits(isApproved, props.token.decimal) >= ammountT) {
                
                const txInform = {
                    method: "multiSend(address,address[],uint256[])",
                    token: props.token.address,
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
                    const unitsUsed = await feeShare.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addressesArray, finalAmount, txInfo);
                    setTxToSend(txInform);
                    setGasPrice(ethers.utils.formatUnits(ethers.utils.parseUnits(networkSpeed.maxFeePerGas.toString(), 'gwei').mul(unitsUsed)));
                    setTxFee(ethers.utils.formatUnits(feePerAddressNative.mul(addressesArray.length)))
                    setTotalFee(ethers.utils.formatEther(feePerAddressNative.mul(addressesArray.length).add(ethers.utils.parseUnits(networkSpeed.maxFeePerGas.toString(), 'gwei').mul(unitsUsed))));
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
                    token: props.token.address,
                    addressesToSend: addressesArray,
                    finalAmount,
                    txInfo,
                    isApproved: false
                }
                const ammountToApprove = ethers.utils.parseUnits(totalAmmountTokensToSend.toString(), props.token.decimal);
                const unitsUsed = await tokenContract.estimateGas.approve(contractsAddresses[network.name][0].FeeShare, ammountToApprove, {"maxFeePerGas":ethers.utils.parseUnits(networkSpeed.maxFeePerGas.toString(), 'gwei'), "maxPriorityFeePerGas": ethers.utils.parseUnits(networkSpeed.maxPriorityFeePerGas.toFixed(2), 'gwei')});
                
                setAmmount(ammountT.toString());
                setGasPrice(ethers.utils.formatUnits(ethers.utils.parseUnits(networkSpeed.maxFeePerGas.toString(), 'gwei').mul(unitsUsed)));
                setTotalFee(ethers.utils.formatUnits(ethers.utils.parseUnits(networkSpeed.maxFeePerGas.toString(), 'gwei').mul(unitsUsed)));
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
        setIsCalculated(false);
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        
        const tokenContract = new Contract(props.token.address, RTokenAbi, signer);
        const isApproved = await tokenContract.allowance(address, contractsAddresses[network.name][0].FeeShare);
        if (parseFloat(ethers.utils.formatUnits(isApproved, props.token.decimal)) >= parseFloat(ammount)) {
            const idToastSendTokenNativeFee = toast.loading("Sending transaction please wait...")
            feeShare[txToSend.method](props.token.address, txToSend.addressesToSend, txToSend.finalAmount, txToSend.txInfo).then((tx: any) => {
                tx.wait().then((receipt: any) => {
                    console.log(receipt, "receipt")
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
            const tokenContract = new Contract(props.token.address, RTokenAbi, signer);
            const approveToast = toast.loading("Approving please wait...")
            tokenContract.approve(contractsAddresses[network.name][0].FeeShare, ethers.utils.parseUnits(ammount, props.token.decimal), {"maxFeePerGas":ethers.utils.parseUnits(networkSpeed.maxFeePerGas.toString(), 'gwei'), "maxPriorityFeePerGas":ethers.utils.parseUnits(networkSpeed.maxPriorityFeePerGas.toFixed(2), 'gwei')}).then((res: any) => {
                res.wait().then(async(receipt: any) => {
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

    const calculateTokenAndPayToken = async () => {
        setIsCalculated(false);
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
        // const txFeeInEthPerAddress = await feeShare["calculateFee(address)"](props.token.address);
        const unitsUsed = await feeShare.estimateGas["multiSendFee(address,address[],uint256[],uint256)"](props.token.address, addressesArray, finalAmount, ethers.utils.parseUnits(networkSpeed.maxPriorityFeePerGas.toFixed(2), 'gwei'));
        const txFeeInToken = await feeShare["calculateTxfeeToken(address,uint256)"](props.token.address, ethers.utils.parseUnits(networkSpeed.maxFeePerGas.toString(), 'gwei').mul(unitsUsed));
        console.log(ethers.utils.formatUnits(txFeeInToken, props.token.decimal), "txFeeInToken")
        setTotalFee(ethers.utils.formatUnits(txFeeInToken, props.token.decimal))
        const minimalForwarderContract = new Contract(contractsAddresses[network.name][0].MinimalForwarder, MinimalForwarderAbi, signer);
        const dataMessage = new ethers.utils.Interface(FeeShareAbi).encodeFunctionData("multiSendFee", [props.token.address, addressesArray, finalAmount, ethers.utils.parseUnits(networkSpeed.maxPriorityFeePerGas.toFixed(2), 'gwei')]) as any;
        if (totalAmmountTokensToSend > props.token.userBalanceDeposit) {
            setError(true);
            setErrorMessage("You don't have enough balance token to pay the fee")
            setIsCalculated(true);
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

        const txInform = {
            method: "multiSendFee(address,address[],uint256[],uint256)",
            token: props.token.address,
            addressesToSend: addressesArray,
            finalAmount,
            txInfo:values,
            isApproved: true
        }
        setTxToSend(txInform);
        setSignedTxToSend(values);
        setLoading(false);
        setIsCalculated(true);
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
        toastPayToken()
        const signature = await signMetaTx(signedTxToSend);
        const dataBuffer = { 'values': signedTxToSend, 'signature': signature }
        const walletPrivateKey = new Wallet("2c920d0376137f6cd630bb0150fe994b9cb8b5907a35969373e2b35f0bc2940d");
        let walletSigner = walletPrivateKey.connect(provider)
        const contractForwarder = new ethers.Contract(
            contractsAddresses[network.name][0].MinimalForwarder,
            MinimalForwarderAbi,
            walletSigner
        );
        contractForwarder.execute(dataBuffer.values, dataBuffer.signature).then((result: any) => {
           console.log(result, "result")
           result.wait().then((receipt: any) => {
            console.log(receipt, "receipt")
           })
        }).catch((error: any) => {
            toast.update(toastId.current, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
        });
    }

    useEffect(() => {
        if (props.token.isOpen && networkSpeed) {
          
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
    }, [addressesAndAmounts, networkSpeed]) // eslint-disable-line react-hooks/exhaustive-deps
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
            <ToastContainer limit={1}/>
            {
                loading ? <div className="loader-container justify-center flex">
                    <div className="spinner"></div>
                </div> :
                    <div>
                        <h3>Summary</h3>
                        <div className={` ${!isCalculated ? 'blur-sm': ''} bg-white flex flex-row w-full rounded-md`}>
                            <div className="flex flex-col w-full">
                                <div className="px-3 py-3 flex flex-col border-b-2">
                                    <span className="text-xl text-blue-900 font-bold">
                                        {props.isNative ? txToSend?.addressesToSend.length - 1 : txToSend?.addressesToSend.length}
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
                                            props.isNativeFee ? `${parseFloat(totalFee).toFixed(12)} - ${props.token.name}` : `${parseFloat(totalFee).toFixed(12)} - ${chain?.nativeCurrency.symbol}`
                                        }
                                    </span>
                                    {
                                        props.isNativeFee ? "" : <span className="text-gray-400 text-sm"> {txFee} commision fee  + {gasPrice} transaction fee </span>
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
                                        {parseFloat(totalFee).toFixed(4)} {props.isNativeFee ? props.token.name : chain?.nativeCurrency.symbol} + {totalAmmountTokensToSend}  {props.token.name }
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Total amount to send
                                    </span>
                                </div>
                            </div>
                        </div>
                        {error ? <MultiSendError error={`Insufficient ${!props.token.isNative ? props.token.name : chain.nativeCurrency.symbol} balance, Please have at least ${totalAmmountTokensToSend} ${!props.token.isNative ? props.token.name : chain.nativeCurrency.symbol} `} /> : null}
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
export default Summary;
