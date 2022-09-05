import { useEffect, useState } from 'react';
import ModalMultiDeposit from './ModalMultiDeposit';
import rightArrow from '../../images/right-arrow.png'
import sortUpIcon from '../../images/sort-up.png';
import sortDownIcon from '../../images/sort-down.png';
import { Contract, ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import AnimatedDots from '../AnimatedDots';

const TableElement = (props: any) => {
    const contractsAddresses = require("../../contracts/AddressesContracts.json")
    const BalanceOfAbi = require("../../contracts/balanceOfAbi.json");
    const OracleAbi = require("../../contracts/oracle/Oracle.json");
    const FeeShareAbi = require("../../contracts/FeeShare.json");
    const RTokenAbi = require("../../contracts/RTokenAbi.json");
    const [isOpen, setIsOpen] = useState(false);
    const [amountDeposit, setAmountDeposit] = useState<number>();
    const [userBalanceToken, setUserBalanceToken] = useState("0");
    const [tokenPrice, setTokenPrice] = useState("0");
    const [userTokenBalance, setUserTokenBalance] = useState("0");
    const [userDepositBalance, setUserDepositBalance] = useState("0");
    const [totalDeposit, setTotalDeposit] = useState("0");
    const { library, active, account } = useWeb3React();

    const changeOpen = (e: any, isOpen: boolean) => {
        setIsOpen(!isOpen);
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

    }
    const handleAmountChange = (event: any) => {
        const value = Math.max(0, Math.min(parseFloat(userBalanceToken), Number(event.target.value)));
        setAmountDeposit(value);
    };
    const getPrice = async () => {
        const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/87cafc6624c74b7ba31a95ddb642cf43");
        const contract = new Contract(contractsAddresses.oracle, OracleAbi, provider);
        await contract.getAssetPrice(props.token.address).then((res: any) => {
            setTokenPrice(ethers.utils.formatUnits(res._hex, 8));
        });
    }
    const getUserDepositBalance = () => {
        const contract = new Contract(contractsAddresses["r" + props.token.name], RTokenAbi, library?.getSigner());
        contract.balanceOf(account).then((res: any) => {
            setUserDepositBalance(ethers.utils.formatUnits(res._hex, props.token.decimal));
        });
    }
    const getUserBalanceRToken = () => {
        if (active && props.network === "Rinkeby Testnet") {
            let tokenName = "r" + props.token.name;
            let contract = new Contract(contractsAddresses[tokenName], RTokenAbi, library?.getSigner());
            contract.balanceOf(account).then((res: any) => {
                setUserTokenBalance(ethers.utils.formatUnits(res._hex, props.token.decimal));
            });
        }
    }
    const getTokenBalance = async () => {
        if (active && props.network === "Rinkeby Testnet") {
            const balanceOf = new Contract(props.token.address, BalanceOfAbi, library.getSigner());
            const price = await balanceOf.balanceOf(account);
            setUserBalanceToken(ethers.utils.formatUnits(price._hex, props.token.decimal));
        }
    }
    const getPriceInUsd = () => {
        if (userBalanceToken && tokenPrice) {
            return (parseFloat(userBalanceToken) * parseFloat(tokenPrice)).toFixed(4)
        }
        return <AnimatedDots />
    }
    const setMaxPrice = () => {
        setAmountDeposit(parseFloat(userBalanceToken));
    }
    const getTotalDeposit = () => {
        const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/87cafc6624c74b7ba31a95ddb642cf43");
        const contract = new Contract(contractsAddresses["r" + props.token.name], RTokenAbi, provider);
        contract.totalSupply().then((res: any) => {
            setTotalDeposit( (parseFloat(ethers.utils.formatUnits(res._hex, props.token.decimal)) * parseFloat(tokenPrice)).toFixed(2).toString());
        });
    }
    const depositAmount = async () => {
        let contract = new Contract(contractsAddresses[props.token.name], RTokenAbi, library?.getSigner());
        let checkAllowance = await contract.allowance(account, contractsAddresses.feeShare);
        let feeShare = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
        if (parseFloat(ethers.utils.formatUnits(checkAllowance._hex, 6)) <= amountDeposit!) {
            await contract?.approve(contractsAddresses.feeShare, ethers.utils.parseUnits(amountDeposit!.toString(), props.token.decimal), { gasLimit: 200000 }).then((res: any) => {
                res.wait().then(async (receipt: any) => {
                    await feeShare.deposit(contractsAddresses[props.token.name], ethers.utils.parseUnits(amountDeposit!.toString(), props.token.decimal), { gasLimit: 200000 }).then((result: any) => {
                        result.wait().then(async (recept: any) => {
                            getUserBalanceRToken();
                            getTokenBalance();
                        })
                    });
                })
            })
        }
        else {
            await feeShare.deposit(contractsAddresses[props.token.name], ethers.utils.parseUnits(amountDeposit!.toString(), props.token.decimal), { gasLimit: 200000 }).then((result: any) => {
                result.wait().then(async (recept: any) => {
                    getUserBalanceRToken();
                    getTokenBalance();
                })
            });
        }
    }
    const witdrawDeposit = async () => {
        let feeShare = new Contract(contractsAddresses.feeShare, FeeShareAbi, library?.getSigner());
        if(amountDeposit! > parseFloat(userDepositBalance) || amountDeposit! === undefined){
            alert("You don't have enough tokens to withdraw");
        }
        else {
            await feeShare.withdraw(contractsAddresses[props.token.name], ethers.utils.parseUnits(amountDeposit!.toString(), props.token.decimal), { gasLimit: 200000 }).then((result: any) => {
                result.wait().then(async (recept: any) => {
                    getUserBalanceRToken();
                    getTokenBalance();
                })
            });
        }
       
    }
    useEffect(() => {
        getPrice();
        getTotalDeposit();
        if (active && props.network === "Rinkeby Testnet") {
            getUserBalanceRToken();
            getUserDepositBalance();
            getPrice();
            getTokenBalance();

        }
    }, [active, account, tokenPrice, userBalanceToken, userTokenBalance]);
    return (
        // TODO Fixe styles tailwind
        <div className={isOpen ? "flex flex-col  bg-blue-100 rounded-lg mb-4 py-2" : "flex flex-col mb-4 py-2 hover:bg-blue-100 hover:rounded-lg cursor-pointer"}>
            <div onClick={(e) => { changeOpen(e, isOpen) }} className='flex font-bold flex-row justify-between px-5 cursor-pointer'>
                <div className='flex relative ml-10 font-bold w-[150px]'>
                    <button className=''><img className='absolute left-[-40px] top-[-3px]' src={isOpen ? sortUpIcon : sortDownIcon} /></button>{props.token.name}
                </div>
                <div className='mr-[-10px] flex font-bold w-[150px] justify-left'>{tokenPrice !== "0" ? tokenPrice.slice(0, 8) : <AnimatedDots />}</div>
                <div className='w-[150px] flex justify-center'>{totalDeposit !== "0" ? totalDeposit  : <AnimatedDots />} $</div>
                <div className='w-[150px] flex justify-center'>{userDepositBalance !== "0" ? userDepositBalance : <AnimatedDots />}</div>
            </div>
            {/* //TODO Move this modal to components folder */}
            <div className={isOpen ? "transition-all ease-in-out duration-300 mr-3 ml-3 mt-2 bg-blue-200 rounded-md px-5 py-5 mb-5" : "hidden"}>
                <div className='flex flex-row justify-between'>
                    <div className='flex flex-col w-[60%] '>
                        <div className='flex justify-between mb-3'>
                            <label>Balance <span className='font-bold'>{props.token.name}</span></label>
                            <span>{userBalanceToken !== "0" ? userBalanceToken : <AnimatedDots />} ($ {getPriceInUsd()})</span>
                        </div>
                        <div className='relative w-[100%] flex flex-row'>
                            <input value={amountDeposit || ""}
                                onChange={handleAmountChange}
                                disabled={userBalanceToken !== "0" ? false : true}
                                step={"0.01"}
                                type="number"
                                className={userBalanceToken !== "0" ? "rounded-lg py-1 text-[20px] disabled:opacity-75 border-2 pr-[60px] border-gray-400 w-[100%]" : "cursor-not-allowed w-[100%] rounded-lg px-3 py-3 text-[20px] disabled:opacity-75 border-2 border-gray-400"}
                            ></input>
                            <button
                                disabled={userBalanceToken !== "0" ? false : true}
                                className={userBalanceToken !== "0" ?
                                    "absolute  right-2 bottom-1 rounded-xl bg-gray-300 px-2 py-1"
                                    : "text-gray-400 font-bold absolute cursor-not-allowed right-2 bottom-1 rounded-xl bg-gray-300 px-2 py-1"}
                                onClick={setMaxPrice}>MAX</button>
                        </div>
                    </div>
                    <div className='flex flex-col w-[40%] ml-4'>
                        <button onClick={() => depositAmount()} disabled={amountDeposit !== undefined ? false : true} className={amountDeposit !== undefined ? "mt-2 hover:bg-gray-600 bg-gray-500 text-white font-bold h-[40px] rounded-md" : "mt-2 cursor-not-allowed bg-gray-400 text-white font-bold h-[40px] rounded-md"}>Deposit</button>
                        <ModalMultiDeposit token={props.token} userBalance={userBalanceToken} />
                    </div>
                </div>
                <div className='mt-5 flex justify-between items-center'>
                    <span>Vault Details</span>
                    <button
                        onClick={witdrawDeposit}
                        disabled={parseInt(userTokenBalance) !== 0 ? false : true}
                        className={parseInt(userTokenBalance) > 0 ? "flex justify-between items-center w-[20%] hover:bg-gray-600 bg-gray-500 text-white font-bold h-[40px] rounded-md px-3" : "flex justify-between items-center cursor-not-allowed w-[20%] bg-gray-400 text-white font-bold h-[40px] rounded-md px-3"} >Withdraw <img className='w-[30px]' src={rightArrow} alt="rightArrow" /></button>
                </div>
            </div>
        </div>
    );
}
export default TableElement;