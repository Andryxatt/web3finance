import { useEffect, useState } from 'react';
import ModalMultiDeposit from './ModalMultiDeposit';
import rightArrow from '../../images/right-arrow.png'
import sortUpIcon from '../../images/sort-up.png';
import sortDownIcon from '../../images/sort-down.png';
import { Contract, ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import AnimatedDots from '../AnimatedDots';
const contractsAddresses = require("../../contracts/AddressesContracts.json")
const BalanceOfAbi = require("../../contracts/balanceOfAbi.json");
const TableElement = (props: any) => {
    const OracleAbi = require("../../contracts/oracle/Oracle.json");
    const FeeShareAbi = require("../../contracts/FeeShare.json");
    const RTokenAbi = require("../../contracts/RTokenAbi.json");
    const [isOpen, setIsOpen] = useState(false);
    const changeOpen = (e: any, isOpen: boolean) => {
        setIsOpen(!isOpen);
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
    const [amountDeposit, setAmountDeposit] = useState<number>();
    const [userBalance, setUserBalance] = useState("0");
    const [tokenPrice, setTokenPrice] = useState("0");
    const [totalSuplay, setTotalSuplay] = useState("0");
    const { library, active, account, connector } = useWeb3React();

    const handleAmountChange = (event: any) => {
        const value = Math.max(0, Math.min(parseFloat(userBalance), Number(event.target.value)));
        setAmountDeposit(value);
    };
    const getPrice = async (decimal: any) => {
        console.log(active, "active");
        if (active && props.network === "Rinkeby Testnet") {
            const contract = new Contract(contractsAddresses.oracle, OracleAbi.abi, library?.getSigner())
            contract.on("AssetSourceUpdated", (asset, source) => {
                console.log(asset, source);
            })
            const res = await contract.getAssetPrice(props.token.address);
            setTokenPrice(ethers.utils.formatUnits(res._hex, decimal));
        }
    }
    const getUserBalanceRToken = () =>{

    }
    const tokenBalance = async (address: any, decimal: any, tokenName: any) => {
        if (active && props.network === "Rinkeby Testnet") {
            const balanceOf = new Contract(address, BalanceOfAbi, library.getSigner());
            const price = await balanceOf.balanceOf(account);
            switch (tokenName) {
                case "USDC":
                    setUserBalance(ethers.utils.formatUnits(price._hex, 6));
                    break;
                case "LINK":
                    setUserBalance(ethers.utils.formatUnits(price._hex, 18));
                    break;
                default:
                    break;
            }
        }
    }
    const getPriceInUsd = () => {
        if (userBalance && tokenPrice) {
            return (parseFloat(userBalance) * parseFloat(tokenPrice)).toFixed(4)
        }
        return <AnimatedDots />
    }
    const setMaxPrice = () => {
        setAmountDeposit(parseFloat(userBalance));
    }
    const depositAmount = (name: string) => {
        let contract = null;
        let feeShare = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner())
        switch (name) {
            case "USDC":
                contract = new Contract(contractsAddresses.USDC, RTokenAbi, library?.getSigner());
                  contract?.approve(contractsAddresses.feeShare, (amountDeposit! * 100000000), { gasLimit: 200000 }).then((response: any) => {
                    console.log(response);
                });
                contract.allowance(account, contractsAddresses.feeShare).then((res: any) => {
                    console.log(ethers.utils.formatUnits(res._hex, 8))
                });
                feeShare.deposit(contractsAddresses.USDC, (amountDeposit! * 100000000), { gasLimit: 200000 })
                break;
            case "LINK":
                contract = new Contract(contractsAddresses.rLINK, RTokenAbi, library?.getSigner())
                contract?.approve(contractsAddresses.feeShare, (amountDeposit! * 100000000), { gasLimit: 200000 }).then((response: any) => {
                    console.log(response);
                });
                contract.allowance(account, contractsAddresses.feeShare).then((res: any) => {
                    console.log(ethers.utils.formatUnits(res._hex, 8))
                });
                feeShare.deposit(contractsAddresses.LINK, (amountDeposit! * 100000000), { gasLimit: 200000 })
                break;
            default:
                break;
        }

        // contract?.transferFrom(account, contractsAddresses.feeShare, amountDeposit, { gasLimit: 200000 });
        //  contract?.transferFrom(account, contractsAddresses.feeShare, amountDeposit, { gasLimit: 200000 });

    }
    useEffect(() => {
        getPrice(props.token.decimal);
        tokenBalance(props.token.address, props.token.decimal, props.token.name);
    }, [userBalance, active]);
    return (
        <div className="flex justify-between flex-col">
            <div className={isOpen ? "flex flex-col px-5 py-3 bg-blue-100 rounded-lg mr-3 ml-3 mb-5 " : "flex flex-col px-5 py-3 mb-5 hover:bg-blue-100 hover:rounded-lg mr-3 ml-3 cursor-pointer"}>
                <div onClick={(e) => { changeOpen(e, isOpen) }} className='flex justify-between cursor-pointer'>
                    <div className='flex relative ml-10 font-bold'><button className=''><img className='absolute left-[-40px] top-[-3px]' src={isOpen ? sortUpIcon : sortDownIcon} /></button>{props.token.name}</div>
                    <div className='font-bold'>{tokenPrice !== "0" ? tokenPrice.slice(0, 8) : <AnimatedDots />}</div>
                    <div>{totalSuplay}</div>
                    <div>{ }</div>
                </div>
                <div className={isOpen ? "transition-all ease-in-out duration-300 mr-3 ml-3 mt-2 bg-blue-200 rounded-md px-5 py-5 mb-5" : "hidden"}>
                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-col w-[60%] '>
                            <div className='flex justify-between mb-3'>
                                <label>Balance <span className='font-bold'>{props.token.name}</span></label>
                                <span>{userBalance !== "0" ? userBalance : <AnimatedDots />} ($ {getPriceInUsd()})</span>
                            </div>
                            <div className='relative w-[100%] flex flex-row'>
                                <input value={amountDeposit || ""}
                                    onChange={handleAmountChange}
                                    disabled={userBalance !== "0" ? false : true}
                                    step={"0.01"}
                                    type="number"
                                    className={userBalance !== "0" ? "rounded-lg py-1 text-[20px] disabled:opacity-75 border-2 pr-[60px] border-gray-400 w-[100%]" : "cursor-not-allowed w-[100%] rounded-lg px-1 py-1 text-[20px] disabled:opacity-75 border-2 border-gray-400"}
                                ></input>
                                <button
                                    disabled={userBalance !== "0" ? false : true}
                                    className={userBalance !== "0" ?
                                        "absolute  right-2 bottom-1 rounded-xl bg-gray-300 px-2 py-1"
                                        : "text-gray-400 font-bold absolute cursor-not-allowed right-2 bottom-1 rounded-xl bg-gray-300 px-2 py-1"}
                                    onClick={setMaxPrice}>MAX</button>
                            </div>


                        </div>
                        <div className='flex flex-col w-[40%] ml-4'>
                            <button onClick={() => depositAmount(props.token.name)} disabled={userBalance !== "0" ? false : true} className={userBalance !== "0" ? "mt-2 hover:bg-gray-600 bg-gray-500 text-white font-bold h-[40px] rounded-md" : "mt-2 cursor-not-allowed bg-gray-400 text-white font-bold h-[40px] rounded-md"}>Deposit</button>
                            <ModalMultiDeposit userBalance={userBalance} />
                        </div>
                    </div>
                    <div className='mt-5 flex justify-between items-center'>
                        <span>Vault Details</span>
                        <button className='flex justify-between items-center cursor-not-allowed w-[20%] bg-gray-400 text-white font-bold h-[40px] rounded-md px-3'>Withdraw <img className='w-[30px]' src={rightArrow} alt="rightArrow" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TableElement;