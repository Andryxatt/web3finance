import { useWeb3React } from "@web3-react/core";
import { BigNumber, Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { Web3State } from "../../Web3DataContext";
const OracleAbi = require("../../contracts/oracle/Oracle.json");
const FeeShareAbi = require("../../contracts/FeeShare.json");
const RTokenAbi = require("../../contracts/RTokenAbi.json");
const contractsAddresses = require("../../contracts/AddressesContracts.json");
const BalanceOfAbi = require("../../contracts/balanceOfAbi.json");
// 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720, 1
// 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720, 1
const MultiDepoistPreview = (props: any) => {
    const { library, active, account, connector } = useWeb3React();
    const [feePerAccount, setFeePerAccount] = useState(0);
    const [userBalance, setUserBalance] = useState("0");
    const [estimateGas, setEstimateGas] = useState("0");
    const [rTokenFee, setRTokenFee] = useState("0");
    const summAmunt = () => {
        let res = 0;
        props.addressesAmount.forEach((element: any) => {
            res += parseFloat(element?.amount);
        })
        return res;
    }
    const {nativeTokenFeePerAddress} = Web3State();
    const summAndFee = () => {
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
        feeShareContract.calculateFee().then((res: any) => {
            console.log(res);
            setFeePerAccount(parseFloat(ethers.utils.formatUnits(res._hex)))
        });
        const totalPrice = props.addressesAmount.length * feePerAccount;
        console.log(totalPrice, "totalPrice");
        return totalPrice;
    }
    const getRTokenFeePerAddress = async (address: string) => {
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library.getSigner());
        const res = await feeShareContract["calculateFee(address)"](address);
        console.log(ethers.utils.formatUnits(res.toString()))
        setRTokenFee(res.toString());
    }
    const getUserBalance = async () => {
        const balanceOf = new Contract(props.token.address, BalanceOfAbi, library.getSigner());
        const price = await balanceOf.balanceOf(account);
        setUserBalance(ethers.utils.formatUnits(price._hex, props.token.decimal));
    }
    const sendTransactionToken = async () =>{
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        const addresses = props.addressesAmount.map((item: any) => {return item.address});
      console.log(feeShareContract, "feeShareContract");
        const rTokenContract = new Contract(props.token.address, RTokenAbi, library?.getSigner());
        // rTokenContract.approve(contractsAddresses.feeShare, ethers.utils.parseUnits(summAmunt().toString().trim(), props.token.decimal)).then((res: any) => {});
        const isRToken = await feeShareContract.getRTokenAddress(props.token.address);
        console.log(props.addressesAmount.length, "props.addressesAmount.length");
        console.log(rTokenFee, "rTokenFee");
        const msgValue = parseFloat(nativeTokenFeePerAddress!) * (props.addressesAmount.length) + parseFloat("0.0000000000000001");
        console.log(msgValue, "msgValue");
        console.log(ethers.utils.parseEther(msgValue.toString()), "msgValue");
        const txInfo = {
            value:  ethers.utils.parseEther(msgValue.toString())
        }
        console.log(msgValue, "msgValue");
        const finalAmount = arrayOfAmounts.map((item: any) => {
            return ethers.utils.parseUnits(item, props.token.decimal);
        });
        const multiSendUnsigned = await feeShareContract["multiSend(address,address[],uint256[])"](props.token.address, addresses, finalAmount, txInfo);
        multiSendUnsigned.wait().then((res: any) => {
            console.log(res, "res");
        }).catch((err: any) => {
            console.log(err, "err");
        });
    }
    const sendTransactionNative = async () => {
        //calculate fee method and get rToken address
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
        const arrayOfAmounts = props.addressesAmount.map((item: any) => {
            return item.amount.toString().trim();
        });
        arrayOfAmounts.unshift(summAmunt().toString().trim());
        const addresses = props.addressesAmount.map((item: any) => {return item.address});
        addresses.unshift(contractsAddresses.feeShare);
        const msgValue = parseFloat(nativeTokenFeePerAddress!) * (props.addressesAmount.length) +  parseFloat(summAmunt().toString()) + parseFloat("0.0000000000000001");
        console.log(ethers.utils.parseEther(msgValue.toString()), "msgValue");
        const txInfo = {
            value:  ethers.utils.parseEther(msgValue.toString())
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
    const getEstimateGas = async () => {
        if(active){
          
        }
    }
    useEffect(() => {
        getUserBalance();
        getRTokenFeePerAddress(props.token.address);
        // getEstimateGas();
    }, [])
    return (
        <div className="px-5 py-5">
            <div className="w-full">
                <div>Network Speed  Gwei </div>
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
                            <span className="text-xl text-blue-900 font-bold">1</span>
                            <span className="text-xs text-gray-400">Total number of transactions needed </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col">
                            <span className="text-xl text-blue-900 font-bold">{} {props.token.name} </span>
                            <span className="text-xs text-gray-400">Approximate cost of operation </span>
                        </div>
                    </div>
                    <div className="flex flex-col border-l-2 w-full">
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{summAmunt()} {props.token.name} </span>
                            <span className="text-xs text-gray-400">Total number of tokens to be sent </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{userBalance} {props.token.name} </span>
                            <span className="text-xs text-gray-400">Your token balance </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col">
                            <span className="text-xl text-blue-900 font-bold">{userBalance} {props.token.name} </span>
                            <span className="text-xs text-gray-400">Your {props.token.name} balance </span>
                        </div>
                    </div>
                </div>
                /*TODO add check total price with userBalance*/
                {parseFloat(userBalance) < 0 ? <div className="border-red-600 rounded-lg bg-white mt-3 text-red-500 px-5 py-5">
                    Insufficient ether balance on your account
                </div> : ""}

            </div>
            <div className="mt-4">
                <button className="bg-sky-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3" onClick={() => props.changeModalContent(false)}>prev</button>
                <button onClick={()=>{sendTransactionToken()}} className="bg-sky-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</button>
            </div>
        </div>
    )

}
export default MultiDepoistPreview;