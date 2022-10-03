import { useWeb3React } from "@web3-react/core";
import { BigNumber, Contract, ethers, Wallet } from "ethers";
import { useEffect, useState } from "react";
import { Web3State } from "../../Web3DataContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MinimalForwarderAbi = require("../../contracts/MinimalForwarderAbi.json");
const FeeShareAbi = require("../../contracts/FeeShare.json");
const RTokenAbi = require("../../contracts/RTokenAbi.json");
const contractsAddresses = require("../../contracts/AddressesContracts.json");
const BalanceOfAbi = require("../../contracts/balanceOfAbi.json");
// 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720, 1
// 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720, 1
const MultiDepoistPreview = (props: any) => {
    const { library, active, account, connector } = useWeb3React();
    const [userBalanceToken, setUserBalanceToken] = useState("0");
    const [userBalanceRETH, setUserBalanceRETH] = useState("0");
    const [estimateGas, setEstimateGas] = useState("0");

    const [rTokenBalance, setRTokenBalance] = useState("0")

    const [errorEstimate, setErrorEstimate] = useState(true)
    const [networkSpeed, setNetworkSpeed] = useState("0");
    const [txCount, setTxCount] = useState("0");
    const [rTokenFee, setRTokenFee] = useState("0");
    const [approximateCost, setApproximateCost] = useState("0");
    const { isFeeInToken,
        setIsFeeInToken,
        chainId
    } = Web3State();
    const summAmunt = () => {
        let res = 0;
        props.addressesAmount.forEach((element: any) => {
            res += parseFloat(element?.amount);
        })
        return res;
    }
    const { nativeTokenFeePerAddress } = Web3State();
    // const summAndFee = () => {
    //     const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
    //     feeShareContract.calculateFee().then((res: any) => {
    //         console.log(res);
    //         setFeePerAccount(parseFloat(ethers.utils.formatUnits(res._hex)))
    //     });
    //     const totalPrice = props.addressesAmount.length * feePerAccount;
    //     console.log(totalPrice, "totalPrice");
    //     return totalPrice;
    // }
    const getRTokenFeePerAddress = async (address: string) => {
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library.getSigner());
        const res = await feeShareContract["calculateFee(address)"](address);
        setRTokenFee(res.toString());
    }
    const getUserBalanceETH = () => {
        library?.getBalance(account).then((res: any) => {
            console.log(res)
            setUserBalanceRETH(ethers.utils.formatUnits(res._hex));
        })
    }
    const getUserBalanceToken = async () => {
        if (props.token.isNative) {
            library?.getBalance(account).then((res: any) => {
                console.log(res)
                setUserBalanceToken(ethers.utils.formatUnits(res._hex));
            })
        }
        else {
            const balanceOf = new Contract(props.token.address, BalanceOfAbi, library.getSigner());
            const price = await balanceOf.balanceOf(account);
            setUserBalanceToken(ethers.utils.formatUnits(price._hex, props.token.decimal));
        }

    }
    const calculateTxCostTokenFeeToken = async () =>{

    }
    const calculateTxCostTokenFeeNative = async () => {
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
        console.log(feeShareContract, "feeShareContract")
        const isRToken = await feeShareContract.getRTokenAddress(props.token.address);
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        const addresses = props.addressesAmount.map((item: any) => { return item.address });

        const msgValue = isRToken === null || undefined ?
            parseFloat('0.2') * (props.addressesAmount.length) + parseFloat("0.0000000000000001") :
            parseFloat(nativeTokenFeePerAddress!) * (props.addressesAmount.length) + parseFloat("0.0000000000000001");
        const txInfo = {
            value: ethers.utils.parseEther(msgValue.toString()),
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item, props.token.decimal);
        });
        if (isFeeInToken) {
            const feeData = await library.getFeeData();
            const estimatedGas = await feeShareContract.estimateGas.multiSendFee(props.token.address, addresses, finalAmount, { gasLimit: "210000" }).catch((err) => {
                console.log(err, "estimateError");
                const {code} = err;
              
                if (code === "UNPREDICTABLE_GAS_LIMIT") {
                    console.log(err.code)
                    setErrorEstimate(false);
                }
            });
            console.log(ethers.utils.formatUnits(feeData.gasPrice.mul(estimatedGas), 'ether'), "gasPrice")
            const txCostFeeToken = await feeShareContract.calculateTxfeeToken(props.token.address, feeData.gasPrice.mul(estimatedGas));
            console.log(ethers.utils.formatUnits(txCostFeeToken, props.token.decimal), "txCostFeeToken")
            // console.log(ethers.utils.formatUnits(feeData.gasPrice * txCostFeeToken, 'ether'), "feeData.gasPrice * txCostFeeToken");
            // console.log(ethers.utils.formatUnits(feeData.gasPrice, "wei"))
            // console.log(parseFloat(ethers.utils.formatUnits(txCostFeeToken, "ether")) * parseFloat(ethers.utils.formatUnits(feeData.gasPrice, "ether")), "feeData.gasPrice * txCostFeeToken");
            const sumTxCost = parseFloat(ethers.utils.formatUnits(txCostFeeToken, props.token.decimal)) + summAmunt() + addresses.length * 10 + 0.5;
            setApproximateCost(sumTxCost.toString());
            const count = props.addressesAmount.length / 255;
            setTxCount(parseFloat((1 + count).toString()).toFixed());
        }
        else {
            setApproximateCost(msgValue.toString());
            const rTokenContract = new Contract(props.token.address, RTokenAbi, library?.getSigner());
            const allowance = await rTokenContract.allowance(account, contractsAddresses.feeShare);
            const feeData = await library.getFeeData();
            setNetworkSpeed(ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei"));
            const gasPrice = await library.getGasPrice();
            const count = props.addressesAmount.length / 255;
            if (parseFloat(ethers.utils.formatUnits(allowance.toString(), props.token.decimal)) >= summAmunt()) {
                console.log("TryEstimate")
                const multiSend = await feeShareContract.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo);
                const txFee = feeData.gasPrice.mul(multiSend);
                setEstimateGas(txFee);
                setTxCount(parseFloat((1 + count).toString()).toFixed());
            }
            else {
                const units = await rTokenContract.estimateGas.approve(contractsAddresses.feeShare, ethers.utils.parseUnits(summAmunt().toFixed(6).toString(), props.token.decimal));
                const txFee = gasPrice.mul(units);
                console.log(ethers.utils.formatUnits(txFee, 'gwei'), "txFee");
                setEstimateGas(ethers.utils.formatEther(txFee));
                setTxCount(parseFloat((2 + count).toString()).toFixed());
            }
        }
        // setApproximateCost(msgValue);
    }
    const getRTokenBalance = async () => {
        const rTokenContract = new Contract(contractsAddresses["r" + props.token.name], RTokenAbi, library?.getSigner());
        const balanceOf = await rTokenContract.balanceOf(account);
        console.log(balanceOf, "balanceOf")
        setRTokenBalance(ethers.utils.formatUnits(balanceOf, props.token.decimal));
    }
    const calculateTxCostNative = async () => {
        console.log("calculateTxCostNative");
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        arrayOfAmounts.unshift(summAmunt().toString().trim());
        const addresses = props.addressesAmount.map((item: any) => { return item.address });
        addresses.unshift(contractsAddresses.feeShare);

        console.log(nativeTokenFeePerAddress, "nativeTokenFeePerAddress");
        console.log(parseFloat(summAmunt().toString()));
        const msgValue = parseFloat(nativeTokenFeePerAddress!) * (props.addressesAmount.length) + parseFloat(summAmunt().toString()) + parseFloat("0.0000000000000001");
        console.log(ethers.utils.parseEther(msgValue.toString()), "msgValue");
        setApproximateCost(msgValue.toString());
        const txInfo = {
            value: ethers.utils.parseEther(msgValue.toString())
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item);
        });
        const feeData = await library.getFeeData();
        setNetworkSpeed(ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, "gwei"));
        const gasPrice = await library.getGasPrice();
        const count = props.addressesAmount.length / 255;
        const units = await feeShareContract.estimateGas["multiSend(address[],uint256[])"](addresses, finalAmount, txInfo);
        const txFee = gasPrice.mul(units);
        console.log(ethers.utils.formatUnits(txFee, 'gwei'), "txFee");
        setEstimateGas(ethers.utils.formatEther(txFee));
        setTxCount(parseFloat((1 + count).toString()).toFixed());
    }
    const sendTransactionToken = async () => {
        console.log(isFeeInToken, "isFeeInToken");
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());

        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        const addresses = props.addressesAmount.map((item: any) => { return item.address });
        const isRToken = await feeShareContract.getRTokenAddress(props.token.address);
        const msgValue = isRToken === null || undefined ?
            parseFloat('0.2') * (props.addressesAmount.length) + parseFloat("0.0000000000000001") :
            parseFloat(nativeTokenFeePerAddress!) * (props.addressesAmount.length) + parseFloat("0.0000000000000001");
        console.log(msgValue, "msgValue");
        console.log(ethers.utils.parseUnits(msgValue.toString()), "msgValue");
        const txInfo = {
            value: ethers.utils.parseUnits(msgValue.toString())
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item, props.token.decimal);
        });

        const rTokenContract = new Contract(props.token.address, RTokenAbi, library?.getSigner());
        const allowance = await rTokenContract.allowance(account, contractsAddresses.feeShare);
        const feeData = await library.getFeeData();
        console.log(feeData, "feeData");
        // const units = await feeShareContract.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo)
        // console.log(feeData.gasPrice * parseFloat(ethers.utils.formatUnits(units)))
        // setEstimateGas(feeData.gasPrice * parseFloat(ethers.utils.formatUnits(units)));
        console.log(ethers.utils.formatUnits(allowance.toString(), props.token.decimal), "allowance");
        console.log(parseFloat(summAmunt().toString()), "summAmunt");

        if (parseFloat(ethers.utils.formatUnits(allowance.toString(), props.token.decimal)) >= parseFloat(summAmunt().toString())) {

            const idToast = toast.loading("Please wait...")
            feeShareContract["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo)

                .then((res: any) => {
                    res.wait().then((res: any) => {
                        console.log(res)

                    })
                }).catch((err: any) => {
                    console.log(err);
                    toast.update(idToast, { render: "Rejected", type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                })
        }
        else {
            const idToast = toast.loading("Please wait...")
            rTokenContract.approve(contractsAddresses.feeShare, ethers.utils.parseUnits(summAmunt().toFixed(6).toString(), props.token.decimal))
                .then((res: any) => {
                    res.wait().then(async (res: any) => {
                        toast.update(idToast, { render: "All is good", type: "success", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                        // const multiSend = await feeShareContract.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo);
                        // const txFee = feeData.maxFeePerGas * parseFloat(multiSend.toString());
                        // setEstimateGas(ethers.utils.formatUnits(txFee.toString(), 18));
                        toast.update(idToast, { render: "Please wait...", isLoading: true });
                        feeShareContract["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo).then((res: any) => {
                            res.wait().then((res: any) => {
                                toast.update(idToast, { render: "All is good", type: "success", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                                console.log(res)
                            })
                        })
                    })
                }).catch((err: any) => {
                    toast.update(idToast, { render: "Rejected", type: "error", autoClose: 2000, isLoading: false });
                });
        }
    }
    const sendTransactionNative = async () => {
        //calculate fee method and get rToken address
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        arrayOfAmounts.unshift(summAmunt().toString().trim());
        const addresses = props.addressesAmount.map((item: any) => { return item.address });
        addresses.unshift(contractsAddresses.feeShare);
        const msgValue = parseFloat(nativeTokenFeePerAddress!) * (props.addressesAmount.length) + parseFloat(summAmunt().toString()) + parseFloat("0.0000000000000001");
        console.log(ethers.utils.parseEther(msgValue.toString()), "msgValue");
        const txInfo = {
            value: ethers.utils.parseEther(msgValue.toString())
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item);
        });
        const multiSendUnsigned = await feeShareContract['multiSend(address[],uint256[])'](addresses, finalAmount, txInfo);
        multiSendUnsigned.wait().then((res: any) => {
            console.log(res, "res");
        }).catch((err: any) => {
            console.log(err, "err");
        });

    }
    const signMetaTx = async (req: any) => {
        console.log(req, "req");
        const msgParams = JSON.stringify({
            domain: {
                chainId: chainId,
                name: 'FeeShare',
                verifyingContract: contractsAddresses.minimalForwarder,
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
        // sendSignedTransaction();
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());

        const minimalForwarderContract = new Contract(contractsAddresses.minimalForwarder, MinimalForwarderAbi, library?.getSigner());
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return ethers.utils.parseUnits(item.amount.trim().toString(), props.token.decimal);
        });
        const addresses = props.addressesAmount.map((item: any) => { return item.address });
        const isRToken = await feeShareContract.getRTokenAddress(props.token.address);
        feeShareContract.on("feeDetails", function (amm1, amm2, amm3, amm4, amm5, amm6) {
            console.log(amm1, amm2, amm3, amm4, amm5, amm6, "feeDetails")
        });
        feeShareContract.on("WhosignerRequest", function (address) {
            console.log(address, "WhosignerRequest")
        });
        const msgValue = parseFloat(rTokenFee!) * (props.addressesAmount.length) + parseFloat("0.0000000000000001");
        // console.log(ethers.utils.parseEther(msgValue.toString()), "msgValue");
        // const txInfo = {
        //     value: ethers.utils.parseEther(msgValue.toString())
        // }
        const dataMessage = new ethers.utils.Interface(FeeShareAbi).encodeFunctionData("multiSendFee", [props.token.address, addresses, arrayOfAmounts]);
        // console.log(dataMessage, "dataMessage");
        // const decoded = new ethers.utils.Interface(FeeShareAbi).decodeFunctionData("multiSendFee", dataMessage);
        // console.log(decoded, "decoded");

        const nonce = await minimalForwarderContract.getNonce(account);
        console.log(nonce, "nonce");
        const values = {
            from: account,
            to: contractsAddresses.feeShare,
            value: 0,
            gas: '21000000',
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
    const multiSendFee = async () => {
        // sendSignedTransaction();
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());

        const minimalForwarderContract = new Contract(contractsAddresses.minimalForwarder, MinimalForwarderAbi, library?.getSigner());
        console.log(minimalForwarderContract, "minimalForwarder");
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return ethers.utils.parseUnits(item.amount.trim().toString(), props.token.decimal);
        });
        const addresses = props.addressesAmount.map((item: any) => { return item.address });
        const isRToken = await feeShareContract.getRTokenAddress(props.token.address);
        feeShareContract.on("feeDetails", function (from, to, amount, event) {
            console.log(from, to, amount, event, "event")
        });
        const msgValue = parseFloat(rTokenFee!) * (props.addressesAmount.length) + parseFloat("0.0000000000000001");
        // console.log(ethers.utils.parseEther(msgValue.toString()), "msgValue");
        // const txInfo = {
        //     value: ethers.utils.parseEther(msgValue.toString())
        // }

        const dataMessage = feeShareContract.multiSendFee(props.token.address, addresses, arrayOfAmounts);
        //  console.log(dataMessage, "dataMessage");
        //  const decoded = new ethers.utils.Interface(FeeShareAbi).decodeFunctionData("multiSendFee", dataMessage);
        //  console.log(decoded, "decoded");
        //  const nonce = await minimalForwarderContract.getNonce(account);
        //  console.log(nonce, "nonce");
        //  const values = {
        //      from: account,
        //      to: contractsAddresses.feeShare,
        //      value: 0,
        //      gas: "21000",
        //      nonce: nonce.toString(),
        //      data: dataMessage,
        //  }
        //  const signature = await signMetaTx(values)
        //  const dataBuffer = {  'request': values, 'signature': signature }
        //  localStorage.setItem('transaction', JSON.stringify(dataBuffer));
        //  sendSignedTransaction();
    }
    const sendSignedTransaction = async () => {
        const walletPrivateKey = new Wallet("2c920d0376137f6cd630bb0150fe994b9cb8b5907a35969373e2b35f0bc2940d");
        const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/87cafc6624c74b7ba31a95ddb642cf43");
        let walletSigner = walletPrivateKey.connect(provider)
        const contractForwarder = new ethers.Contract(
            contractsAddresses.minimalForwarder,
            MinimalForwarderAbi,
            walletSigner
        );
        // console.log(contractForwarder)
        // console.log(localStorage.getItem('transaction'))
        const values = JSON.parse(localStorage.getItem('transaction')).request
        const signature = JSON.parse(localStorage.getItem('transaction')).signature
        // console.log(values)
        // console.log(signature)
        const networkSpeed = await provider.getGasPrice();

        const result = await contractForwarder.execute(values, signature);
        console.log(result, "result");
        localStorage.clear();
    }
    useEffect(() => {
        getUserBalanceToken();
        getRTokenFeePerAddress(props.token.address);
        getUserBalanceETH();

        if (!props.token.isNative) {
            calculateTxCostTokenFeeNative();
        }
        else {
            calculateTxCostNative();
        }
        if (active) {
            const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
            getRTokenBalance();
            const filter = {
                address: contractsAddresses.feeShare,
                topics: [
                    // the name of the event, parnetheses containing the data type of each event, no spaces
                    ethers.utils.id("multiSendFee(address,address[],uint256[])")
                ]
            }
            library?.getLogs(filter).then((logs: any) => {
                console.log(logs, "logs");
            });
        }
        // getEstimateGas();
    }, [active, account])
    return (

        <div className="px-5 py-5">
            <div className="w-full">
                <ToastContainer autoClose={2000} />
                <div>Network Speed {networkSpeed} Gwei </div>
                <input className="w-full" type="range" onChange={(e) => { setNetworkSpeed(e.target.value) }} defaultValue={3.0} min="1.0" step={0.1} max="5.0"></input>
                <div className="flex justify-between">
                    <span className="cursor-pointer">Slow</span>
                    <span className="cursor-pointer">Fast</span>
                    <span className="cursor-pointer">Instant</span>
                </div>
            </div>
            <div>
                <h3>Summary</h3>
                <div className="bg-white flex flex-row w-full rounded-md">
                    <div className="flex flex-col w-full">
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{props.addressesAmount.length}</span>
                            <span className="text-xs text-gray-400">Total number of addresses </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{txCount}</span>
                            <span className="text-xs text-gray-400">Total number of transactions needed </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col">
                            <span className="text-xl text-blue-900 font-bold">{
                                isFeeInToken ? approximateCost + " " + props.token.name :
                                    parseFloat(approximateCost).toFixed(5) + " RETH"
                            }  </span>
                            <span className="text-xs text-gray-400">Approximate cost of operation </span>
                        </div>
                    </div>
                    <div className="flex flex-col border-l-2 w-full">
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{summAmunt()} {props.token.name} </span>
                            <span className="text-xs text-gray-400">Total number of tokens to be sent </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{
                                isFeeInToken ?
                                parseFloat(rTokenBalance).toFixed(2) : parseFloat(userBalanceToken).toFixed(2)} {props.token.name}
                            </span>

                            <span className={!errorEstimate ? "text-xs text-red-500" : " text-xs text-gray-400"}>
                                {
                                    !errorEstimate ? "Your don't have enoth amount to make this transaction" : "Your " + "r" + props.token.name + " balance"
                                }

                            </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col">
                            <span className="text-xl text-blue-900 font-bold">{
                                isFeeInToken ? parseFloat(userBalanceToken).toFixed(2) + " " + props.token.name :
                                    parseFloat(userBalanceRETH).toFixed(2) + " RETH"

                            }  </span>
                            <span className="text-xs text-gray-400">{
                                isFeeInToken ? "Your " + props.token.name + " balance" : "Your RETH balance"
                            }</span>
                        </div>
                    </div>
                </div>
                {parseFloat(userBalanceToken) < 0 ? <div className="border-red-600 rounded-lg bg-white mt-3 text-red-500 px-5 py-5">
                    Insufficient ether balance on your account
                </div> : ""}

            </div>
            <div className="mt-4">
                <button className="bg-sky-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3" onClick={() => props.changeModalContent(false)}>prev</button>
                <button
                    onClick={() => {
                        props.token.isNative ?
                        sendTransactionNative() :
                        isFeeInToken ? sendTransactionAndPayFeeInToken() :
                            sendTransactionToken()
                    }}
                    className="bg-sky-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</button>
            </div>
        </div>
    )

}
export default MultiDepoistPreview;