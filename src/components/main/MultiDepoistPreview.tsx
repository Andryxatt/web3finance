import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
const OracleAbi = require("../../contracts/oracle/Oracle.json");
const FeeShareAbi = require("../../contracts/FeeShare.json");
const RTokenAbi = require("../../contracts/RTokenAbi.json");
const contractsAddresses = require("../../contracts/AddressesContracts.json");
const BalanceOfAbi = require("../../contracts/balanceOfAbi.json");
const MultiDepoistPreview = (props: any) => {
    const { library, active, account, connector } = useWeb3React();
    const [feePerAccount, setFeePerAccount] = useState(0);
    const [userBalance, setUserBalance] = useState("0");
    const [estimateGas, setEstimateGas] = useState("0");
    const summAmunt = () => {
        console.log(props.addressesAmount);
        let res = 0;
        props.addressesAmount.forEach((element: any) => {
            res += parseFloat(element?.amount);
        })
        return res;
    }
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
    const getUserBalance = async () => {
        const balanceOf = new Contract(props.token.address, BalanceOfAbi, library.getSigner());
        const price = await balanceOf.balanceOf(account);
        setUserBalance(ethers.utils.formatUnits(price._hex, props.token.decimal));
    }
    const sendTransaction = () => {
        const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());

    }
    const getEstimateGas = async () => {
        if(active){
            const feeShareContract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
            const addressesToSend = props.addressesAmount.map((element: any) => {
                return element.address;
            })
            const amountToSend = props.addressesAmount.map((element: any) => {
                return ethers.utils.parseUnits(element.amount);
            })
            addressesToSend.unshift(contractsAddresses.feeShare);
            amountToSend.unshift(ethers.utils.parseUnits((summAndFee()).toString()));
            console.log(addressesToSend);
            console.log(amountToSend);
            // const res = await feeShareContract.estimateGas.multiSendFee(props.token.address, addressesToSend, amountToSend);
            // console.log(res);
            return 1;
        }
       return 0;
    }
    useEffect(() => {
        getUserBalance();
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
                            <span className="text-xl text-blue-900 font-bold">{/*TODO veriable for summAmunt */} {props.token.name} </span>
                            <span className="text-xs text-gray-400">Approximate cost of operation </span>
                        </div>
                    </div>
                    <div className="flex flex-col border-l-2 w-full">
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{/*TODO veriable for sumAndFee*/} {props.token.name} </span>
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
                <button className="bg-sky-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send</button>
            </div>
        </div>
    )

}
export default MultiDepoistPreview;