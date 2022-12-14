import { Contract, ethers, Wallet } from "ethers";
import {  useEffect, useState } from "react";
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
        speedNetwork,
        library,
        account,
        chainId
    } = Web3State();
    const [totalTokens, setTotalTokens] = useState(0);
    const [userTokenBalance, setUserTokenBalance] = useState(0);
    const [userNativeBalance, setUserNativeBalance] = useState(0);
    const [approximateCostTx, setApproximateCostTx] = useState("");
    const [feePerTx, setFeeTx] = useState("0");
    const [gasFee, setGasFee] = useState("0");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    // const [txGasUnits, setTxGasUnits] = useState<any>();
    const [countTransactions, setCountTransactions] = useState(0);
    const contractsAddresses = require("./../../../contracts/AddressesContracts.json")
    // const OracleAbi = require("./../../../contracts/oracle/Oracle.json");
    const FeeShareAbi = require("./../../../contracts/FeeShare.json");
    const RTokenAbi = require("./../../../contracts/RTokenAbi.json");
    const MinimalForwarderAbi = require("./../../../contracts/MinimalForwarderAbi.json");
    console.log("props.token", props);
    const calculateApproximateFeeTokenNative = async () => {
        const feeShare = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());
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

        const adde = ethers.utils.parseEther('0.000000000000000001')
        const msgValue = feePerAddressNative.mul(addressesFromFile.length).add(adde);
        const txInfo = {
            value: msgValue,
            maxFeePerGas: ethers.utils.parseUnits(speedNetwork, "gwei"),
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseEther(item);
        });
        const rTokenContract = new Contract(props.token.address, RTokenAbi, library?.getSigner());
        const allowance = await rTokenContract.allowance(account, contractsAddresses[currentNetwork.name][0].FeeShare);
        if (parseFloat(ethers.utils.formatEther(msgValue)) > userNativeBalance) {
            setApproximateCostTx(ethers.utils.formatEther(msgValue))
            setErrorMessage(true);
            return;
        }
        else {
            setErrorMessage(false);
        }
        if (parseFloat(ethers.utils.formatUnits(allowance.toString(), props.token.decimal)) >= ammount) {
            const gasUsed = await feeShare.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo);
            const fee = gasUsed.mul(ethers.utils.parseUnits(speedNetwork, 'gwei'));
            setFeeTx(ethers.utils.formatUnits(msgValue, 'ether'));
            setGasFee(ethers.utils.formatUnits(fee, 'ether'));
            setApproximateCostTx(ethers.utils.formatUnits(fee.add(msgValue), 'ether'));
            if (addressesFromFile.length < 254) {
                setCountTransactions(1)
            }
            else {
                setCountTransactions(Math.ceil(addressesFromFile.length / 254))
            }
        }
        else {
            const units = await rTokenContract.estimateGas.approve(contractsAddresses[currentNetwork.name][0].FeeShare, ethers.utils.parseUnits(ammount.toString(), props.token.decimal));
            if (addressesFromFile.length < 254) {
                setCountTransactions(2)
            }
            else {
                setCountTransactions(Math.ceil(addressesFromFile.length / 254) + 1)
            }
            const fee = units.mul(ethers.utils.parseUnits(speedNetwork, 'gwei'));
            // setFeeTx(ethers.utils.formatUnits(msgValue, 'ether'));
            setGasFee(ethers.utils.formatUnits(fee, 'ether'));
            setApproximateCostTx(ethers.utils.formatUnits(fee.add(msgValue), 'ether'));
            // setTxGasUnits(ethers.utils.formatUnits(fee, 'ether'));
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
            return ethers.utils.parseUnits(item, props.token.decimal);
        });
        console.log(finalAmount, "finalAmount");
        const rTokenContract = new Contract(props.token.address, RTokenAbi, library?.getSigner());
        const allowance = await rTokenContract.allowance(account, contractsAddresses[currentNetwork.name][0].FeeShare);
        console.log(ethers.utils.formatUnits(allowance.toString()), "allowance");
        const idToast1 = toast.loading("Processing transaction please wait...")
        if (parseFloat(ethers.utils.formatUnits(allowance.toString(), props.token.decimal)) >= parseFloat(amount.toString())) {
            feeShareContract["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo)
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
                        // const units = await feeShareContract.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo)
                        // setTxGasUnits(units);
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
    const calculateApproximateFeeNative = async () => {
        const feeShare = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());
        // console.log("calculateTxCostNative");
        const arrayOfAmounts = addressesFromFile.map((item: any) => {
            return item.amount.toString().trim();
        });
        const feePerAddressNative = await feeShare["calculateFee()"]();
        const ammount = addressesFromFile.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b.amount), 0);
        setTotalAmount(ammount);
        arrayOfAmounts.unshift(ammount.toString());
        const addresses = addressesFromFile.map((item: any) => { return item.address });
        addresses.unshift(contractsAddresses[currentNetwork.name][0].FeeShare);
        const msgValue = parseFloat(ethers.utils.formatEther(feePerAddressNative!)) * (addressesFromFile.length) + parseFloat(ammount.toString()) + parseFloat("0.0000000000000001");
        const txInfo = {
            value: ethers.utils.parseEther(msgValue.toString()),
            maxFeePerGas: ethers.utils.parseUnits(speedNetwork, "gwei"),
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseEther(item);
        });
        const units = await feeShare.estimateGas["multiSend(address[],uint256[])"](addresses, finalAmount, txInfo);
        const tx = feePerAddressNative.mul(addressesFromFile.length);
        setFeeTx(ethers.utils.formatUnits(tx,'ether'));
        const feeEx = ethers.utils.parseUnits(speedNetwork, "gwei").mul(units);
        setGasFee(ethers.utils.formatUnits(feeEx,'ether'))
        setApproximateCostTx(ethers.utils.formatUnits(feeEx.add(tx), "ether"));
        if (addressesFromFile.length < 254) {
            setCountTransactions(1)
        }
        else {
            setCountTransactions(Math.ceil(addressesFromFile.length / 254))
        }
    }
    const calculateApproximateFeeInToken = () => {
        // const feeShareContract = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());
        // const minimalForwarderContract = new Contract(contractsAddresses[currentNetwork.name][0].MinimalForwarder, MinimalForwarderAbi, library?.getSigner());
        // const arrayOfAmounts = addressesFromFile.map((item: any) => {
        //     return ethers.utils.parseUnits(item.amount.trim().toString(), props.token.decimal);
        // });
        // const addresses = addressesFromFile.map((item: any) => { return item.address });
        // const dataMessage = new ethers.utils.Interface(FeeShareAbi).encodeFunctionData("multiSendFee", [props.token.address, addresses, arrayOfAmounts]);

    }
    const sendTransactionNative = async () => {
        const idToast = toast.loading("Processing transaction please wait...")
        const feeShareContract = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = addressesFromFile.map((item: any) => {
            return item.amount.toString().trim();
        });
        const feePerAddressNative = await feeShareContract["calculateFee()"]();
        const amount = addressesFromFile.reduce((a: any, b: any) => parseFloat(a) + parseFloat(b.amount), 0);
        arrayOfAmounts.unshift(amount.toString());
        const addresses = addressesFromFile.map((item: any) => { return item.address });
        addresses.unshift(contractsAddresses[currentNetwork.name][0].FeeShare);
        const msgValue = parseFloat(ethers.utils.formatEther(feePerAddressNative!)) * (addressesFromFile.length) + parseFloat(amount.toString()) + parseFloat("0.0000000000000001");
        const txInfo = {
            value: ethers.utils.parseUnits(msgValue.toString(), 'ether'),
            maxFeePerGas: ethers.utils.parseUnits(speedNetwork, "gwei"),
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseEther(item);
        });

        feeShareContract['multiSend(address[],uint256[])'](addresses, finalAmount, txInfo).then((res: any) => {
            res.wait().then((res: any) => {
                toast.update(idToast, { render: "Transaction success", type: "success", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
            }).catch((err: any) => {
                toast.update(idToast, { render: "Transaction error", type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
            })
        }).catch((err: any) => {
            toast.update(idToast, { render: "Transaction rejected", type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
        });

    }
    const signMetaTx = async (req: any) => {
        // console.log(req, "req");
        const msgParams = JSON.stringify({
            domain: {
                chainId: chainId,
                name: 'FeeShare',
                verifyingContract: contractsAddresses[currentNetwork.name][0].MinimalForwarder,
                version: '1.0.0',
            },
            // Defining the message signing data content.
            message: req,
            // Refers to the keys of the *types* object below.
            primaryType: 'ForwardRequest',
            types: {
                // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                ],
                // Refer to PrimaryType
                ForwardRequest: [
                    { name: 'from', type: 'address' },
                    { name: 'to', type: 'address' },
                    { name: 'value', type: 'uint256' },
                    { name: 'gas', type: 'uint256' },
                    { name: 'nonce', type: 'uint256' },
                    { name: 'data', type: 'bytes' },
                ],
            },
        })
        var from = account
        var params = [from, msgParams]
        var method = 'eth_signTypedData_v4'
        const signature = await library.provider.request({
            method,
            params,
            from,
        })

        return signature
    }
    const sendTransactionAndPayFeeInToken = async () => {
        // const feeShareContract = new Contract(contractsAddresses[currentNetwork.name][0].FeeShare, FeeShareAbi, library?.getSigner());
        const minimalForwarderContract = new Contract(contractsAddresses[currentNetwork.name][0].MinimalForwarder, MinimalForwarderAbi, library?.getSigner());
        const arrayOfAmounts = addressesFromFile.map((item: any) => {
            return ethers.utils.parseUnits(item.amount.trim().toString(), props.token.decimal);
        });
        const addresses = addressesFromFile.map((item: any) => { return item.address });
        // feeShareContract.on("feeDetails", function (amm1, amm2, amm3, amm4, amm5, amm6) {
        //     console.log(amm1, amm2, amm3, amm4, amm5, amm6, "feeDetails")
        // });
        // feeShareContract.on("WhosignerRequest", function (address) {
        //     console.log(address, "WhosignerRequest")
        // });
        // const msgValue = parseFloat(rTokenFee!) * (props.addressesAmount.length) + parseFloat("0.0000000000000001");
        // console.log(ethers.utils.parseEther(msgValue.toString()), "msgValue");
        // const txInfo = {
        //     value: ethers.utils.parseEther(msgValue.toString())
        // }
        const dataMessage = new ethers.utils.Interface(FeeShareAbi).encodeFunctionData("multiSendFee", [props.token.address, addresses, arrayOfAmounts]);
        // console.log(dataMessage, "dataMessage");
        // const decoded = new ethers.utils.Interface(FeeShareAbi).decodeFunctionData("multiSendFee", dataMessage);
        // console.log(decoded, "decoded");

        const nonce = await minimalForwarderContract.getNonce(account);
        // console.log(nonce, "nonce");
        const values = {
            from: account,
            to: contractsAddresses[currentNetwork.name][0].FeeShare,
            value: 0,
            gas: '210000',
            nonce: nonce.toString(),
            data: dataMessage,
        }
        const signature = await signMetaTx(values);

        const dataBuffer = { 'request': values, 'signature': signature }
        localStorage.setItem('transaction', JSON.stringify(dataBuffer));
        sendSignedTransaction();

        // const multiSendUnsigned = await feeShareContract['multiSendFee(address,address[],uint256[])'](props.token.address, addresses, arrayOfAmounts, {gasLimit:"210000"});
        //  console.log(multiSendUnsigned, "multiSendUnsigned");
    }

    const sendSignedTransaction = async () => {
        const walletPrivateKey = new Wallet("2c920d0376137f6cd630bb0150fe994b9cb8b5907a35969373e2b35f0bc2940d");
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/87cafc6624c74b7ba31a95ddb642cf43");
        let walletSigner = walletPrivateKey.connect(provider)
        const contractForwarder = new ethers.Contract(
            contractsAddresses[currentNetwork.name][0].MinimalForwarder,
            MinimalForwarderAbi,
            walletSigner
        );
        // console.log(contractForwarder)
        // console.log(localStorage.getItem('transaction'))
        const values = JSON.parse(localStorage.getItem('transaction')).request
        const signature = JSON.parse(localStorage.getItem('transaction')).signature
        // console.log(values)
        // console.log(signature)
        // const networkSpeed = await provider.getGasPrice();

        const result = await contractForwarder.execute(values, signature);
        console.log(result, "result");
        localStorage.clear();
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

    }, [getUserNativeBalance, getUserTokenBalance, props.isNative, props.token.address, props.token.decimal, totalTokensToMultiSend]);
    useEffect(() => {
        if (props.isNative) {
            console.log("native")
            calculateApproximateFeeNative();
        }
        else if (props.isNativeFee) {
            console.log("fee in token")
            calculateApproximateFeeInToken();
        }
        else {
            console.log("fee in native")
            calculateApproximateFeeTokenNative();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [speedNetwork, userNativeBalance, addressesFromFile, props.isNative])
    useEffect(() => {

        if (totalTokens > userTokenBalance) {
            setError(true);
        }
        else {
            setError(false);
        }
    }, [totalTokens, userTokenBalance, error, userNativeBalance])
    const sendTx = async () => {
        console.log(props.isNativeFee, "isNative")
        if (props.isNative) {
            sendTransactionNative();
        }
        else if (props.isNativeFee) {
            sendTransactionAndPayFeeInToken();
        }
        else {
            sendTransactionToken();
        }

    }
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
                            {approximateCostTx} <br />
                           
                        </span>
                        <span className="text-gray-400 text-sm">commision fee ({parseFloat(feePerTx).toFixed(5)}) + gas fee ({parseFloat(gasFee).toFixed(5)})</span>
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
            {errorMessage?<MultiSendError error={"Not enoth value to send transaction"}/>:null}
            <button className="bg-blue-500 text-white font-bold px-5 py-1 rounded-md" onClick={props.showPrev}>Prev</button>
            <button className="b" onClick={sendTx}>Send</button>
        </div>
    )
}
export default Summary;
