import { useWeb3React } from "@web3-react/core";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
const OracleAbi = require("../../contracts/oracle/Oracle.json");
const FeeShareAbi = require("../../contracts/FeeShare.json");
const RTokenAbi = require("../../contracts/RTokenAbi.json");
const contractsAddresses = require("../../contracts/AddressesContracts.json")
const MultiDepoistPreview = (props:any) => {
    const { library, active, account, connector } = useWeb3React();
    const [addressesAndAmount, setAddressesAndAmount] = useState<object[]>([]);
    const summAmunt = () =>{
        let res = 0;
        addressesAndAmount.forEach((element:any)=>{
            res += parseFloat(element?.amount);
        })
        return res;
    }
    const estimateGas = () =>{
        const contract = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner())
        
        // addressesAndAmount.forEach((element:any, index:number) =>{
        //     contract.calculateFee(element.address).then((res:any) =>{
        //         console.log(res);
        //     })
        // })
        console.log(contract);
    }
    useEffect(()=>{
        estimateGas();
        setAddressesAndAmount(props.addressesAmount)
    }, [addressesAndAmount])
    return (
        <div className="px-5 py-5">
            <div className="w-full">
                <div>Network Speed (3.0091963 Gwei) </div>
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
                            <span className="text-xl text-blue-900 font-bold">{addressesAndAmount.length}</span>
                            <span className="text-xs text-gray-400">Total number of addresses </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">0</span>
                            <span className="text-xs text-gray-400">Total number of transactions needed </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col">
                            <span className="text-xl text-blue-900 font-bold">{summAmunt()} {props.token.name} </span>
                            <span className="text-xs text-gray-400">Approximate cost of operation </span>
                        </div>
                    </div>
                    <div className="flex flex-col border-l-2 w-full">
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">4.451 {props.token.name} </span>
                            <span className="text-xs text-gray-400">Total number of tokens to be sent </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">3.8730 {props.token.name} </span>
                            <span className="text-xs text-gray-400">Your token balance </span>
                        </div>
                        <div className="px-8 py-8 flex flex-col">
                            <span className="text-xl text-blue-900 font-bold">3.8730 {props.token.name} </span>
                            <span className="text-xs text-gray-400">Your {props.token.name} balance </span>
                        </div>
                    </div>
                </div>
                <div>
                    Insufficient ether balance on your account
                </div>
            </div>
            <div>
                <button onClick={ () => props.changeModalContent(false)}>prev</button>
                <button>Send</button>
            </div>
        </div>
    )

}
export default MultiDepoistPreview;