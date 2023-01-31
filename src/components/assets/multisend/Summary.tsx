import { Contract, ethers, Wallet } from "ethers";
import { useEffect, useState } from "react";
import MultiSendError from "./MultiSendError";
import {
    addressesToSend,
    totalAddresses,
    calculateTotalAmountTokens
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
    const dispatch = useAppDispatch();
    const balanceNative = useAppSelector(nativeBalance);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [txFee, setTxFee] = useState("0");
    const [gasPrice, setGasPrice] = useState("0");
    const [totalFee, setTotalFee] = useState("0");
    const [txToSend, setTxToSend] = useState<TxInformation>();
    const [signedTxToSend, setSignedTxToSend] = useState<any>();
    const addressesAndAmounts = useAppSelector(addressesToSend);
    const network = useAppSelector(currentNetwork);
    const countAddresses = useAppSelector(totalAddresses);
    const totalAmmountTokens = useAppSelector(calculateTotalAmountTokens);
    const provider = useProvider();
    const { address, isConnected } = useAccount();
  
    const { chain } = useNetwork();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const calculateNative = async () => {
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        const feePerAddressNative = await feeShare["calculateFee()"]();
        const addressesArray = addressesAndAmounts.map((item: any) => {
            return item.address;
        });
        const amountsArray = addressesAndAmounts.map((item: any) => {
            return item.amount.toString().trim();
        });
        const finalAmount = amountsArray.map((item: any) => {
            return ethers.utils.parseUnits(item);
        });
        finalAmount.unshift(ethers.utils.parseUnits(totalAmmountTokens.toString()));
        addressesArray.unshift(contractsAddresses[network.name][0].FeeShare);
        const msgValue = feePerAddressNative.mul(addressesAndAmounts.length).add(ethers.utils.parseEther(totalAmmountTokens.toString()));
        const txInfo = {
            value: msgValue,
        }
        const txInform = {
            method: "multiSend(address[],uint256[])",
            token: props.token.address,
            addressesToSend:addressesArray,
            finalAmount,
            txInfo,
            isApproved: true
        }
        console.log(txInform, "txInform")
        try{
            const unitsUsed = await feeShare.estimateGas["multiSend(address[],uint256[])"](addressesArray, finalAmount, txInfo);
      
            const gasPrices = await provider.getGasPrice();
            setGasPrice(ethers.utils.formatUnits(gasPrices.mul(unitsUsed), "wei") );
            setTxFee(ethers.utils.formatUnits(feePerAddressNative.mul(addressesAndAmounts.length), "wei"))
            setTotalFee(ethers.utils.formatUnits(feePerAddressNative.mul(addressesAndAmounts.length).add(gasPrices.mul(unitsUsed)), "wei"));
            setTxToSend(txInform);
            setTotalTransactions(addressesArray.length / 254 === 0 ? 1 : Math.ceil(addressesArray.length / 254));
        }
        catch{
            setError(true);
            setErrorMessage("You don't have enough balance to pay the fee")
        }
        
       
    }
    const sendNativeTx = async () => {
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        feeShare[txToSend.method](txToSend.addressesToSend, txToSend.finalAmount, txToSend.txInfo).then((tx: any) => {
            tx.wait().then((receipt: any) => {
                console.log(receipt, "receipt")
                if (isConnected && network.chainId === 5) {
                    dispatch(fetchUserBalanceGoerli({ provider, address }))
                }
            }).catch((err: any) => {
                console.log(err, "err")
            })
        }).catch((err: any) => {
            console.log(err, "err")
        });

    }
    const sendTokenAndPayNative = async () => {
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        console.log(txToSend, "txToSend")
        if(txToSend.isApproved){
            feeShare[txToSend.method](props.token.address, txToSend.addressesToSend, txToSend.finalAmount, txToSend.txInfo).then((tx: any) => {
                tx.wait().then((receipt: any) => {
                    console.log(receipt, "receipt")
                    if (isConnected && network.chainId === 5) {
                        dispatch(fetchUserBalanceGoerli({ provider, address }))
                    }
                }).catch((err: any) => {
                    console.log(err, "err")
                })
            }).catch((err: any) => {
                console.log(err, "err")
            });
        }
        else {
            const tokenContract = new Contract(props.token.address, RTokenAbi, signer);
            console.log(txToSend.finalAmount, "txToSend.finalAmount")
         
            const unitsUsed = await tokenContract.approve(contractsAddresses[network.name][0].FeeShare, ethers.utils.parseUnits(totalAmmountTokens.toString(), props.token.decimal));
            unitsUsed.wait().then((receipt: any) => {
                calculateTokenAndPayNative()
                setTimeout(() => {
                    sendTokenAndPayNative();
                }, 1000);
              
            }).catch((err: any) => {});
        }
       
    }
   
    const calculateTokenAndPayNative = async () => {
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        const arrayOfAmounts = addressesAndAmounts.map((item: any) => {
            return item.amount.toString().trim();
        });
        const feePerAddressNative = await feeShare["calculateFee()"]();
        const ammount = arrayOfAmounts.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b), 0);
        const addressesToSend = addressesAndAmounts.map((item: any) => { return item.address });
        const msgValue = feePerAddressNative.mul(addressesAndAmounts.length);
        const txInfo = {
            value: msgValue,
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item);
        });
        const tokenContract = new Contract(props.token.address, RTokenAbi, signer);
        const isApproved = await tokenContract.allowance(address, contractsAddresses[network.name][0].FeeShare);
        if(ammount > props.token.userBalance){
            setError(true);
            setErrorMessage("You don't have enough balance to pay the fee")
        }
        if (isApproved >= ethers.utils.parseEther(ammount.toString())) {
            const txInform = {
                method: "multiSend(address,address[],uint256[])",
                token: props.token.address,
                addressesToSend,
                finalAmount,
                txInfo,
                isApproved: true
            }
            const unitsUsed = await feeShare.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addressesToSend, finalAmount, txInfo);
            const gasPrices = await provider.getGasPrice();
            setGasPrice(ethers.utils.formatUnits(gasPrices.mul(unitsUsed), "wei") );
            setTxFee(ethers.utils.formatUnits(feePerAddressNative.mul(addressesAndAmounts.length), "wei"))
            setTotalFee(ethers.utils.formatUnits(feePerAddressNative.mul(addressesAndAmounts.length).add(gasPrices.mul(unitsUsed)), "wei"));
            setTxToSend(txInform);
            setTotalTransactions(addressesToSend.length / 255 === 0 ? 1 : Math.ceil(addressesToSend.length / 255));
        }
        else {
            const txInform = {
                method: "multiSend(address,address[],uint256[])",
                token: props.token.address,
                addressesToSend,
                finalAmount,
                txInfo,
                isApproved: false
            }
            const unitsUsed = await tokenContract.estimateGas.approve(contractsAddresses[network.name][0].FeeShare, ethers.utils.parseUnits(ammount.toString(), props.token.decimal));
            const gasPrices = await provider.getGasPrice();
            setGasPrice(ethers.utils.formatUnits(gasPrices.mul(unitsUsed), "wei") );
            setTotalFee(ethers.utils.formatUnits(gasPrices.mul(unitsUsed), "wei"));
            setTxToSend(txInform);
            setTotalTransactions(addressesToSend.length / 255 === 0 ? 2 : Math.ceil(addressesToSend.length / 255) + 1);
        }
    }
    const calculateTokenAndPayToken = async () => {
        const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        //first 
        const arrayOfAmounts = addressesAndAmounts.map((item: any) => {
            return item.amount.toString().trim();
        });
        const addressesToSendd = addressesAndAmounts.map((item: any) => { return item.address });
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item);
        });
        const txFeeInEthPerAddress = await feeShare["calculateFee(address)"](props.token.address);
        console.log(ethers.utils.formatEther(txFeeInEthPerAddress), "txFeeInEthPerAddress");
        const txFeeInToken = await feeShare["calculateTxfeeToken(address,uint256)"](props.token.address, txFeeInEthPerAddress);
        console.log(ethers.utils.formatUnits(txFeeInToken, props.token.decimals), "txFeeInToken");
        const estimateGasPrice = await provider.getGasPrice();
        console.log(estimateGasPrice, "estimateGasPrice");
        const estimateGas = await feeShare.estimateGas["multiSendFee(address,address[],uint256[])"](props.token.address, addressesToSendd, finalAmount);
        console.log(estimateGasPrice.mul(estimateGas), "estimateGasPrice.mul(estimateGas)");
        const totalAmount = txFeeInToken.mul(addressesAndAmounts.length).add('1000000000000000000').add(ethers.utils.parseEther(totalAmmountTokens.toString()));
        const minimalForwarderContract = new Contract(contractsAddresses[network.name][0].MinimalForwarder, MinimalForwarderAbi, signer);
        
        const dataMessage = new ethers.utils.Interface(FeeShareAbi).encodeFunctionData("multiSendFee", [props.token.address, addressesToSendd, finalAmount]) as any;
        if(totalAmount > props.token.userBalanceDeposit){
            setError(true);
            setErrorMessage("You don't have enough balance token to pay the fee")
        }
       const nonce = await minimalForwarderContract.getNonce(address);
       // console.log(nonce, "nonce");
       const values = {
           from: address,
           to: contractsAddresses[network.name][0].FeeShare,
           value: "0",
           gas: 210000,
           nonce: nonce.toString(),
           dataMessage,
       }
       setSignedTxToSend(values);
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
            value:{
               from: req.from,
               to: req.to,
               value: ethers.BigNumber.from("0"),
               gas: ethers.BigNumber.from("210000"),
               nonce: req.nonce.toString(),
               data: req.dataMessage.toString(),
            },
          })
          return signature;
    }

    const sendSignedTransaction = async () => {
        const signature = await signMetaTx(signedTxToSend);
        const dataBuffer = { 'request': signedTxToSend, 'signature': signature }
        localStorage.setItem('transaction', JSON.stringify(dataBuffer));
        const walletPrivateKey = new Wallet("2c920d0376137f6cd630bb0150fe994b9cb8b5907a35969373e2b35f0bc2940d");
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/87cafc6624c74b7ba31a95ddb642cf43");
        let walletSigner = walletPrivateKey.connect(provider)
        const contractForwarder = new ethers.Contract(
            contractsAddresses[network.name][0].MinimalForwarder,
            MinimalForwarderAbi,
            walletSigner
        );
        const values = JSON.parse(localStorage.getItem('transaction')).request
        const result = await contractForwarder.execute(values, signature);
        console.log(result, "result");
    }
  useEffect(() => {
    console.log(props, "props")
        if (props.isNative) {
            calculateNative()
        }
        else if (props.isNativeFee) {
            calculateTokenAndPayNative()
        }
        else {
            console.log("calculateTokenAndPayToken", balanceNative )
            calculateTokenAndPayToken()
        }

    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    const sendTransaction = async () => {
        if (props.isNative) {
            sendNativeTx()
        }
        else if (props.isNativeFee) {
            sendTokenAndPayNative()
        }
        else {
            sendSignedTransaction()
        }
    }
    return (
        <div className="mb-3">
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
                         { totalFee } Wei - {parseFloat(ethers.utils.formatEther(totalFee)).toFixed(4)} - ETH
                        </span>
                        <span className="text-gray-400 text-sm"> {txFee} commision fee  + {gasPrice} gas price </span>
                        <span className="text-xs text-gray-400">Approximate cost of operation </span>
                    </div>
                </div>
                <div className="flex flex-col border-l-2 w-full">
                    <div className="px-3 py-3 flex flex-col border-b-2">
                        <span className="text-xl text-blue-900 font-bold">
                            {totalAmmountTokens} {props.token.name}
                        </span>
                        <span className="text-xs text-gray-400">Total number of tokens to be sent </span>
                    </div>
                    <div className="px-3 py-3 flex flex-col border-b-2">
                        <span className="text-xl text-blue-900 font-bold">
                            {parseFloat(props.token.userBalance).toFixed(6)} {props.token.name}
                        </span>
                        <span className={" text-xs text-gray-400"}>
                            Your token balance
                        </span>
                    </div>
                    <div className="px-3 py-3 flex flex-col">
                        <span className="text-xl text-blue-900 font-bold">
                        {parseFloat(balanceNative[0].userBalance).toFixed(6)} {chain.nativeCurrency.symbol}
                        </span>
                        <span className="text-xs text-gray-400">
                            Your  {chain.nativeCurrency.symbol} balance
                        </span>
                    </div>
                </div>
            </div>
            {error ? <MultiSendError error={`Insufficient ${!props.token.isNative ? props.token.name : chain.nativeCurrency.symbol} balance, Please have at least ${totalAmmountTokens} ${!props.token.isNative ? props.token.name : chain.nativeCurrency.symbol} `} /> : null}
            {errorMessage ? <MultiSendError error={"Not enoth value to send transaction"} /> : null}
            <div className="mt-2">
                <button className="bg-blue-500 text-white font-bold px-5 py-1 mr-2 rounded-md" onClick={props.showPrev}>Prev</button>
                {error ?
                 <button className="bg-neutral-400 text-white font-bold px-5 py-1 rounded-md" disabled onClick={sendTransaction}>Send</button>:
                <button className="bg-neutral-800 text-white font-bold px-5 py-1 rounded-md"  onClick={sendTransaction}>Send</button>}
            </div>

        </div>
    )
}
export default Summary;
