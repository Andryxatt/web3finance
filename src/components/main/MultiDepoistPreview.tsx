import { useWeb3React } from "@web3-react/core";
import {  Contract, ethers, Wallet } from "ethers";
import {  useState } from "react";
import { Web3State } from "../../Web3DataContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MinimalForwarderAbi = require("../../contracts/MinimalForwarderAbi.json");
const FeeShareAbi = require("../../contracts/FeeShare.json");
const RTokenAbi = require("../../contracts/RTokenAbi.json");
const contractsAddresses = require("../../contracts/AddressesContracts.json");
const BalanceOfAbi = require("../../contracts/balanceOfAbi.json");
const MultiDepoistPreview = (props: any) => {
    const { library,  account } = useWeb3React();
    const [userBalanceToken, setUserBalanceToken] = useState("0");
    const [userBalanceNative, setUserBalanceNative] = useState("0");
    const [feePerAddressNative, setFeePerAddressNative] = useState("0");
    const [rTokenBalance, setRTokenBalance] = useState("0")


    // const [errorEstimate, setErrorEstimate] = useState(true)
    const [networkSpeed, setNetworkSpeed] = useState("3");
    const [txCount, setTxCount] = useState("0");
    const [approximateCost, setApproximateCost] = useState("0");
    const { isFeeInToken,
        chainId
    } = Web3State();
    const summAmunt = () => {
        let res = 0;
        props.addressesAmount.forEach((element: any) => {
            res += parseFloat(element?.amount);
        })
        return res;
    }
    // const getRTokenFeePerAddress = async (address: string) => {
    //     const feeShareContract = new Contract(contractsAddresses[props.network.name].FeeShare, FeeShareAbi, library.getSigner());
    //     const res = await feeShareContract["calculateFee(address)"](address);
    //     setRTokenFee(res.toString());
    // }
    const getUserBalanceNative = () => {
        library?.getBalance(account).then((res: any) => {
            setUserBalanceNative(ethers.utils.formatUnits(res._hex));
        })
    }
    const getUserBalanceToken = async () => {
        if (props.token.isNative) {
            library?.getBalance(account).then((res: any) => {
                // console.log(res)
                setUserBalanceToken(ethers.utils.formatUnits(res._hex));
            })
        }
        else {
            const balanceOf = new Contract(props.token.address, BalanceOfAbi, library.getSigner());
            const price = await balanceOf.balanceOf(account);
            setUserBalanceToken(ethers.utils.formatUnits(price._hex, props.token.decimal));
        }

    }
    getUserBalanceNative();
    getUserBalanceToken();
    const calculateTxCostTokenFeeNative = async () => {
        
        const feeShareContract = new Contract(contractsAddresses[props.network.name][0].FeeShare, FeeShareAbi, library?.getSigner());
        const feePerAddressNative = await feeShareContract["calculateFee()"]();
        setFeePerAddressNative(ethers.utils.formatEther(feePerAddressNative));
        const isRToken = await feeShareContract.getRTokenAddress(props.token.address);
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        const addresses = props.addressesAmount.map((item: any) => { return item.address });
        const msgValue = isRToken === null || undefined ?
            parseFloat('0.2') * (props.addressesAmount.length) + parseFloat("0.0000000000000001") :
            parseFloat(ethers.utils.formatEther(feePerAddressNative)!) * (props.addressesAmount.length) + parseFloat("0.0000000000000001");
            const feeData = await library.getFeeData();
            const txInfo = {
                value: ethers.utils.parseUnits(parseFloat(msgValue.toString()).toFixed(18), "ether"),
                maxFeePerGas: ethers.utils.parseUnits(networkSpeed, "gwei").add(feeData.lastBaseFeePerGas),
            }
            const maxFeePerGas = ethers.utils.parseUnits(networkSpeed, "gwei").add(feeData.lastBaseFeePerGas);
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item, props.token.decimal);
        });
        if (isFeeInToken) {
            console.log("isFeeInToken")
            const estimatedGas = await feeShareContract.estimateGas.multiSendFee(props.token.address, addresses, finalAmount, { gasLimit: "210000" }).catch((err) => {
                const { code } = err;
                if (code === "UNPREDICTABLE_GAS_LIMIT") {
                    // setErrorEstimate(false);
                }
            });
            const gasUsed = await feeShareContract.calculateTxfeeToken(props.token.address, feeData.gasPrice.mul(estimatedGas));
            console.log(gasUsed.toString(), "gasUsed");
            const sumTxCost = parseFloat(ethers.utils.formatUnits(gasUsed, props.token.decimal)) + summAmunt() + addresses.length * 10 + 0.5;
            setApproximateCost(sumTxCost.toString());
            const count = props.addressesAmount.length / 255;
            setTxCount(parseFloat((1 + count).toString()).toFixed());
        }
        else {
            const rTokenContract = new Contract(props.token.address, RTokenAbi, library?.getSigner());
            const allowance = await rTokenContract.allowance(account, contractsAddresses[props.network.name][0].FeeShare);
            // const feeData = await library.getFeeData();
            const count = props.addressesAmount.length / 255;
            if (parseFloat(ethers.utils.formatUnits(allowance.toString(), props.token.decimal)) >= summAmunt()) {
                const gasUsed = await feeShareContract.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo);
                const txFee = gasUsed.mul(maxFeePerGas);
                console.log(txFee, "txFee")
                setApproximateCost(ethers.utils.formatUnits(txFee, 'ether'));
                setTxCount(parseFloat((1 + count).toString()).toFixed());
            }
            else {
                const units = await rTokenContract.estimateGas.approve(contractsAddresses[props.network.name][0].FeeShare, ethers.utils.parseUnits(summAmunt().toString(), props.token.decimal));
                const txFee = units.mul(maxFeePerGas);
                console.log(txFee, "txFee")
                setApproximateCost(ethers.utils.formatUnits(txFee, 'ether'));
                // setEstimateGas(ethers.utils.formatEther(txFee));
                setTxCount(parseFloat((2 + count).toString()).toFixed());
            }
        }
    }


    const getRTokenBalance = async () => {
        const rTokenContract = new Contract(contractsAddresses[props.network.name][0]["r" + props.token.name], RTokenAbi, library?.getSigner());
        const balanceOf = await rTokenContract.balanceOf(account);
        // console.log(balanceOf, "balanceOf")
        setRTokenBalance(ethers.utils.formatUnits(balanceOf, props.token.decimal));
    }
    getRTokenBalance();
    const calculateTxCostNative = async () => {
        // console.log("calculateTxCostNative");
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        arrayOfAmounts.unshift(summAmunt().toString().trim());
        const addresses = props.addressesAmount.map((item: any) => { return item.address });
        addresses.unshift(contractsAddresses.feeShare);

        const msgValue = parseFloat(feePerAddressNative!) * (props.addressesAmount.length) + parseFloat(summAmunt().toString()) + parseFloat("0.0000000000000001");
      
        const txInfo = {
            value: ethers.utils.parseEther(parseFloat(msgValue.toString()).toFixed(18))
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item);
        });
        // console.log(feeData, "feeData");
        const count = props.addressesAmount.length / 255;
        const units = await feeShareContract.estimateGas["multiSend(address[],uint256[])"](addresses, finalAmount, txInfo);
        console.log(units, "units");
        // const txFee = BigNumber.from(slow).mul(units);
        // setApproximateCost(ethers.utils.formatEther(txFee));
        setTxCount(parseFloat((1 + count).toString()).toFixed());
    }
    if(!props.token.isNative){
        calculateTxCostTokenFeeNative();
     }
        
  else {
         calculateTxCostNative();
     }
    const sendTransactionToken = async () => {
        // console.log(isFeeInToken, "isFeeInToken");
        const feeShareContract = new Contract(contractsAddresses[props.network.name][0].FeeShare, FeeShareAbi, library?.getSigner());

        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        const feeData = await library.getFeeData();
        const addresses = props.addressesAmount.map((item: any) => { return item.address });
        const isRToken = await feeShareContract.getRTokenAddress(props.token.address);
        const msgValue = isRToken === null || undefined ?
            parseFloat('0.2') * (props.addressesAmount.length) + parseFloat("0.0000000000000001") :
            parseFloat(feePerAddressNative!) * (props.addressesAmount.length) + parseFloat("0.0000000000000001");
        const maxFeePerGas = feeData.lastBaseFeePerGas.add(ethers.utils.parseUnits(networkSpeed, "gwei"));
        const txInfo = {
            value: ethers.utils.parseUnits(parseFloat(msgValue.toString()).toFixed(18)),
            maxPriorityFeePerGas: ethers.utils.parseUnits(networkSpeed, "gwei"),
            maxFeePerGas: maxFeePerGas,
            type:2,
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item, props.token.decimal);
        });

        const rTokenContract = new Contract(props.token.address, RTokenAbi, library?.getSigner());
        const allowance = await rTokenContract.allowance(account, contractsAddresses[props.network.name][0].FeeShare);
        // const feeData = await library.getFeeData();
        if (parseFloat(ethers.utils.formatUnits(allowance.toString(), props.token.decimal)) >= parseFloat(summAmunt().toString())) {
            const idToast = toast.loading("Please wait...")
            feeShareContract["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo)
                .then((res: any) => {
                    res.wait().then((res: any) => {

                    })
                }).catch((err: any) => {
                    // console.log(err);
                    toast.update(idToast, { render: "Rejected", type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                })
        }
        else {
            const idToast = toast.loading("Please wait...")
            rTokenContract.approve(contractsAddresses[props.network.name][0].FeeShare, ethers.utils.parseUnits(summAmunt().toFixed(6).toString(), props.token.decimal))
                .then((res: any) => {
                    res.wait().then(async (res: any) => {
                        const units = await feeShareContract.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo)
                        console.log(units, "units");
                        // const txFee = BigNumber.from(average).mul(units);
                        // setApproximateCost(ethers.utils.formatEther(txFee) + parseFloat(msgValue.toString()).toFixed(18));
                        toast.update(idToast, { render: "All is good", type: "success", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                        toast.update(idToast, { render: "Please wait...", isLoading: true });
                        feeShareContract["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo).then((res: any) => {
                            res.wait().then((res: any) => {
                                toast.update(idToast, { render: "All is good", type: "success", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                                console.log(res)
                            })
                        })
                    }).catch((err: any) => {
                        toast.update(idToast, { render: "Rejected", type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER });
                    })
                }).catch((err: any) => {
                    toast.update(idToast, { render: "Rejected", type: "error", autoClose: 2000, isLoading: false });
                });
        }
    }
    const sendTransactionNative = async () => {
        //calculate fee method and get rToken address
        const feeShareContract = new Contract(contractsAddresses[props.network.name][0].FeeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        arrayOfAmounts.unshift(summAmunt().toString().trim());
        const addresses = props.addressesAmount.map((item: any) => { return item.address });
        addresses.unshift(contractsAddresses[props.network.name][0].FeeShare);
        const msgValue = parseFloat(feePerAddressNative!) * (props.addressesAmount.length) + parseFloat(summAmunt().toString()) + parseFloat("0.0000000000000001");
        // console.log(ethers.utils.parseEther(msgValue.toString()), "msgValue");
        const txInfo = {
            value: ethers.utils.parseEther(msgValue.toString())
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item);
        });
        const multiSendUnsigned = await feeShareContract['multiSend(address[],uint256[])'](addresses, finalAmount, txInfo);
        multiSendUnsigned.wait().then((res: any) => {
            // console.log(res, "res");
        }).catch((err: any) => {
            console.log(err, "err");
        });

    }
    const signMetaTx = async (req: any) => {
        // console.log(req, "req");
        const msgParams = JSON.stringify({
            domain: {
                chainId: chainId,
                name: 'FeeShare',
                verifyingContract: contractsAddresses[props.network.name][0].MinimalForwarder,
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
        const feeShareContract = new Contract(contractsAddresses[props.network.name][0].FeeShare, FeeShareAbi, library?.getSigner());

        const minimalForwarderContract = new Contract(contractsAddresses[props.network.name][0].MinimalForwarder, MinimalForwarderAbi, library?.getSigner());
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return ethers.utils.parseUnits(item.amount.trim().toString(), props.token.decimal);
        });
        const addresses = props.addressesAmount.map((item: any) => { return item.address });
        // const isRToken = await feeShareContract.getRTokenAddress(props.token.address);
        feeShareContract.on("feeDetails", function (amm1, amm2, amm3, amm4, amm5, amm6) {
            console.log(amm1, amm2, amm3, amm4, amm5, amm6, "feeDetails")
        });
        feeShareContract.on("WhosignerRequest", function (address) {
            console.log(address, "WhosignerRequest")
        });
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
            to: contractsAddresses[props.network.name][0].FeeShare,
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
    
    const sendSignedTransaction = async () => {
        const walletPrivateKey = new Wallet("2c920d0376137f6cd630bb0150fe994b9cb8b5907a35969373e2b35f0bc2940d");
        const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/87cafc6624c74b7ba31a95ddb642cf43");
        let walletSigner = walletPrivateKey.connect(provider)
        const contractForwarder = new ethers.Contract(
            contractsAddresses[props.network.name][0].MinimalForwarder,
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
    // function formatOutput(data: any) {
    //     let avgGasFee = 0;
    //     let avgFill = 0;
    //     let blocks = [];
    //     for (let i = 0; i < 20; i++) {
    //         avgGasFee = avgGasFee + Number(data.reward[i][1]) + Number(data.baseFeePerGas[i])
    //         avgFill = avgFill + Math.round(data.gasUsedRatio[i] * 100);

    //         blocks.push({
    //             blockNumber: Number(data.oldestBlock) + i,
    //             reward: data.reward[i].map((r) => (Number(r) / 10 ** 9).toFixed(2)),
    //             baseFeePerGas: (Number(data.baseFeePerGas[i]) / 10 ** 9).toFixed(2),
    //             gasUsedRatio: Math.round(data.gasUsedRatio[i] * 100),
    //         });
    //     }

    //     avgGasFee = avgGasFee / 20;
    //     avgGasFee = (avgGasFee / 10 ** 9);


    //     avgFill = avgFill / 20;
    //     console.log(avgGasFee, "avgGasFee");
    //     console.log(blocks, 'blocks');
    //     return [blocks, avgGasFee, avgFill];
    // }
    // const historicalBlocks = 20;
    // function formatFeeHistory(result:any, includePending:any) {
    //     let blockNum = result.oldestBlock;
    //     // console.log(result.oldestBlock, "oldestBlock");
    //     let index = 0;
    //     const blocks = [];
    //     while (blockNum < result.oldestBlock + historicalBlocks) {
    //         if(result.reward[index] === undefined){
    //             break;
    //         }
    //         blocks.push({
    //             number: blockNum,
    //             baseFeePerGas: Number(result.baseFeePerGas[index]),
    //             gasUsedRatio: Number(result.gasUsedRatio[index]),
    //             priorityFeePerGas: result.reward[index].map((x:any) => Number(x)),
    //         });
    //         blockNum++;
    //         index++;
    //     }
    //     if (includePending) {
    //         blocks.push({
    //             number: "pending",
    //             baseFeePerGas: Number(result.baseFeePerGas[historicalBlocks]),
    //             gasUsedRatio: NaN,
    //             priorityFeePerGas: [],
    //         });
    //     }
    //     return blocks;
    // }
    // function avg(arr) {
    //     const sum = arr.reduce((a, v) => a + v);
    //     return Math.round(sum/arr.length);
    //   }
      
//     const calculateGasLimit = async () => {
//         const web3 = new Web3('https://eth-goerli.g.alchemy.com/v2/' + process.env.REACT_APP_ALCHEMY_GOERLY_KEY);
//         web3.eth.getFeeHistory(historicalBlocks, "pending", [25, 50, 75]).then((feeHistory) => {
//             const blocks = formatFeeHistory(feeHistory, false);
//             const slow    = avg(blocks.map(b => b.priorityFeePerGas[0]));
//             const average = avg(blocks.map(b => b.priorityFeePerGas[1]));
//             const fast    = avg(blocks.map(b => b.priorityFeePerGas[2]));
          
//             web3.eth.getBlock("pending").then((block) => {
//               const baseFeePerGas = Number(block.baseFeePerGas);
//               setSlow((slow + baseFeePerGas).toString());
//               setAverage((average + baseFeePerGas).toString());
//               setFast((fast + baseFeePerGas).toString());
//             //   console.log("Manual estimate:", {
//             //     slow: slow + baseFeePerGas,
//             //     average: average + baseFeePerGas,
//             //     fast: fast + baseFeePerGas,
//             //   });
//             });
//     });
// }
    // const calculateGasLimit = async () => {
    //     const BLOCKS = 20;
    //     let blockHistory:any[] = [];
    //     let avgGas:any;
    //     let avgBlockVolume:any;
    //     console.log(ethers, "ethers");
    //     const web3 = new Web3('https://eth-rinkeby.alchemyapi.io/v2/n8SCturNweEoqNxxT73pEvrBpWBTSS1E');
    //     setInterval(() => {
    //         web3.eth
    //           .getFeeHistory(BLOCKS, "latest", [25, 50, 75])
    //           .then((feeHistory) => {
    //             const [blocks, avgGasFee, avgFill] = formatOutput(feeHistory);
    //             blockHistory.push(blocks);
    //             avgGas = avgGasFee;
    //             avgBlockVolume = avgFill;
    //           });
    //       }, 10000);
    //     // console.log(history, "history");
    //     console.log(avgGas, "avgGas");
    //     console.log(avgBlockVolume, "avgBlockVolume");
    //     console.log(blockHistory, "blockHistory");
    // }
    // getUserBalanceToken();
    // getRTokenFeePerAddress(props.token.address);
    // getUserBalanceNative();
//    calculateGasLimit();
//    calculateTxCostTokenFeeNative();
//    getRTokenBalance();

    // useEffect(() => {
        
    //     if (!props.token.isNative) {
            
    //     }
    //     else {
    //         calculateTxCostNative();
    //     }
    //     if (active) {
    //         console.log(fast);
          
    //         const filter = {
    //             address: contractsAddresses.feeShare,
    //             topics: [
    //                 ethers.utils.id("multiSendFee(address,address[],uint256[])")
    //             ]
    //         }
    //         library?.getLogs(filter).then((logs: any) => {
    //             console.log(logs, "logs");
    //         });
    //     }
    //     // getEstimateGas();
    // })
    const updateGasFee = (value:any) =>{
        setNetworkSpeed(value);
    }
  
    return (
        <div className="px-5 py-5">
            <div className="w-full">
                <ToastContainer autoClose={2000} />
                <div>Network Speed {networkSpeed} Gwei </div>
                <input className="w-full" type="range" onChange={(e) => { updateGasFee(e.target.value) }} defaultValue={3.0} min="1.0" step={0.1} max="5.0"></input>
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
                                isFeeInToken ? parseFloat(approximateCost).toFixed(6) + " " + props.token.name :
                                parseFloat(approximateCost).toFixed(6) + " RETH"
                            }  </span>
                            <span className="text-xs text-gray-400">Approximate cost of operation </span>
                        </div>
                    </div>
                    <div className="flex flex-col border-l-2 w-full">
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{summAmunt().toFixed(10)} {props.token.name} </span>
                            <span className="text-xs text-gray-400">Total number of tokens to be sent </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{
                                isFeeInToken ?
                                    parseFloat(rTokenBalance).toFixed(2) : parseFloat(userBalanceToken).toFixed(2)} {props.token.name}
                            </span>

                            <span className={" text-xs text-gray-400"}>
                                {
                                   "Your r" + props.token.name + " balance"
                                }
                            </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col">
                            <span className="text-xl text-blue-900 font-bold">{
                                isFeeInToken ? parseFloat(userBalanceNative).toFixed(2) + " " + props.token.name :
                                    parseFloat(userBalanceNative).toFixed(2) + " RETH"

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