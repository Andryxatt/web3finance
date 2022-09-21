import { useWeb3React } from "@web3-react/core";
import { BigNumber, Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { Web3State } from "../../Web3DataContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const OracleAbi = require("../../contracts/oracle/Oracle.json");
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
    const [txCount, setTxCount] = useState("0");
    const [rTokenFee, setRTokenFee] = useState("0");
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
    const calculateTxCostToken = async () => {
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        const addresses = props.addressesAmount.map((item: any) => { return item.address });
        const isRToken = await feeShareContract.getRTokenAddress(props.token.address);
        const msgValue = isRToken === null || undefined ?
            parseFloat('0.2') * (props.addressesAmount.length) + parseFloat("0.0000000000000001") :
            parseFloat(nativeTokenFeePerAddress!) * (props.addressesAmount.length) + parseFloat("0.0000000000000001");
        const txInfo = {
            value: ethers.utils.parseEther(msgValue.toString())
        }
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item, props.token.decimal);
        });
        const rTokenContract = new Contract(props.token.address, RTokenAbi, library?.getSigner());
        const allowance = await rTokenContract.allowance(account, contractsAddresses.feeShare);
        const feeData = await library.getFeeData();
        const gasPrice = await library.getGasPrice();
        console.log(gasPrice, "gasPrice");
        console.log(ethers.utils.formatUnits(gasPrice), "gasPrice");
        const count = props.addressesAmount.length / 255;
        console.log( "allowance");
        if (parseFloat(ethers.utils.formatUnits(allowance.toString(), props.token.decimal)) >= summAmunt()) {
            const multiSend = await feeShareContract.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo);
            const txFee = feeData.gasPrice.mul(multiSend);
            setEstimateGas(txFee);
            setTxCount(parseFloat((1 + count).toString()).toFixed());
        }
        else {
            const units = await rTokenContract.estimateGas.approve(contractsAddresses.feeShare, ethers.utils.parseUnits(summAmunt().toString().trim(), props.token.decimal));
            const txFee = gasPrice.mul(units);
            console.log(ethers.utils.formatUnits(txFee, 'wei'), "txFee");
            setEstimateGas(ethers.utils.formatEther(txFee));
            setTxCount(parseFloat((2 + count).toString()).toFixed());
        }
    }
    const calculateTxCostNative = () => {

    }
    const sendTransactionToken = async () => {

        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());

        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        const addresses = props.addressesAmount.map((item: any) => { return item.address });

        const isRToken = await feeShareContract.getRTokenAddress(props.token.address);

        const msgValue = isRToken === null || undefined ?
            parseFloat('0.2') * (props.addressesAmount.length) + parseFloat("0.0000000000000001") :
            parseFloat(nativeTokenFeePerAddress!) * (props.addressesAmount.length) + parseFloat("0.0000000000000001");

        const txInfo = {
            value: ethers.utils.parseEther(msgValue.toString())
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
        console.log(ethers.utils.parseUnits(allowance.toString(), props.token.decimal), "allowance");
        console.log(summAmunt(), "summAmunt");

        if (parseFloat(ethers.utils.formatUnits(allowance.toString(), props.token.decimal)) >= summAmunt()) {

            const idToast = toast.loading("Please wait...")
            feeShareContract["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo)
          
                .then((res: any) => {
                    res.wait().then((res: any) => {
                        console.log(res)
                        toast.update(idToast, { render: "All is good", autoClose:2000, type: "success", isLoading: false, position:toast.POSITION.TOP_CENTER });
                    })
                }).catch((err: any) => {
                    console.log(err);
                    toast.update(idToast, { render: "Rejected", type: "error",autoClose:2000, isLoading: false, position:toast.POSITION.TOP_CENTER });
                })
        }
        else {
            const idToast = toast.loading("Please wait...")
            rTokenContract.approve(contractsAddresses.feeShare, ethers.utils.parseUnits(summAmunt().toString().trim(), props.token.decimal))
                .then((res: any) => {
                    res.wait().then(async(res: any) => {
                        toast.update(idToast, { render: "All is good", type: "success",autoClose:2000, isLoading: false, position:toast.POSITION.TOP_CENTER });
                        const multiSend = await feeShareContract.estimateGas["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo);
                        const txFee = feeData.maxFeePerGas * parseFloat(multiSend.toString());
                        setEstimateGas(ethers.utils.formatUnits(txFee.toString(), 18));
                        toast.update(idToast, { render: "Please wait...", isLoading: true });
                        feeShareContract["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo).then((res: any) => {
                            res.wait().then((res: any) => {
                                toast.update(idToast, { render: "All is good", type: "success",autoClose:2000, isLoading: false, position:toast.POSITION.TOP_CENTER });
                                console.log(res)
                            })
                        })
                    })
                }).catch((err: any) => {
                    toast.update(idToast, { render: "Rejected", type: "error",autoClose:2000, isLoading: false });
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
        const multiSendUnsigned = await feeShareContract.multiSend(addresses, finalAmount, txInfo);
        multiSendUnsigned.wait().then((res: any) => {
            console.log(res, "res");
        }).catch((err: any) => {
            console.log(err, "err");
        });

    }

    useEffect(() => {
        getUserBalanceToken();
        getRTokenFeePerAddress(props.token.address);
        getUserBalanceETH();

        if (!props.token.isNative) {

            calculateTxCostToken();
        }
        // getEstimateGas();
    }, [active, account])
    return (

        <div className="px-5 py-5">
            <div className="w-full">
            <ToastContainer autoClose={2000} />
                <div>Network Speed {ethers.utils.formatUnits(ethers.utils.parseUnits(estimateGas.toString()), "wei")} Gwei </div>
                <input className="w-full" type="range"></input>
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
                            <span className="text-xl text-blue-900 font-bold">{ } RETH </span>
                            <span className="text-xs text-gray-400">Approximate cost of operation </span>
                        </div>
                    </div>
                    <div className="flex flex-col border-l-2 w-full">
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{summAmunt()} {props.token.name} </span>
                            <span className="text-xs text-gray-400">Total number of tokens to be sent </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{parseFloat(userBalanceToken).toFixed(2)} {props.token.name} </span>
                            <span className="text-xs text-gray-400">Your {props.token.name} balance </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col">
                            <span className="text-xl text-blue-900 font-bold">{parseFloat(userBalanceRETH).toFixed(2)} RETH </span>
                            <span className="text-xs text-gray-400">Your RETH balance </span>
                        </div>
                    </div>
                </div>
                {parseFloat(userBalanceToken) < 0 ? <div className="border-red-600 rounded-lg bg-white mt-3 text-red-500 px-5 py-5">
                    Insufficient ether balance on your account
                </div> : ""}

            </div>
            <div className="mt-4">
                <button className="bg-sky-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3" onClick={() => props.changeModalContent(false)}>prev</button>
                <button onClick={() => { props.token.isNative ? sendTransactionNative() : sendTransactionToken() }} className="bg-sky-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</button>
            </div>
        </div>
    )

}
export default MultiDepoistPreview;