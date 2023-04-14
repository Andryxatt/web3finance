import { Contract, ethers } from "ethers";
import { useState } from "react";
import { toast } from "react-toastify";
import contractsAddresses from '../../contracts/AddressesContracts.json';
import RTokenAbi from '../../contracts/RTokenAbi.json';
import FeeShareAbi from '../../contracts/FeeShare.json';
import { currentNetwork } from "../../store/network/networkSlice";
import { useAppSelector } from "../../store/hooks";
import { useAppDispatch } from "../../store/hooks";
import { fetchSigner } from '@wagmi/core'
import { useAccount, useProvider } from "wagmi";
import { fetchUserBalanceSingleToken } from "../../store/token/tokenSlice";
const DepositWithdraw = (props: any) => {
    const network = useAppSelector(currentNetwork);
    const [ammount, setAmmount] = useState(0);
    const dispatch = useAppDispatch();
    const provider = useProvider()
    //provider wagmi
    const { address } = useAccount();
    // const updateToken = () => {
    //     if(isConnected && provider && network){
    //         dispatch(fetchUserBalanceSingleToken({address,token,networkName, provider}))
    //             // dispatch(fetchTokensPricesSingleToken({token, networkName}))
               
    //     }
    // }
    // useEffect(()=>{
    //     updateToken()
    // },[updated])

    // useContractEvent({
    //     address: feeShareAddress,
    //     abi: FeeShareAbi,
    //     eventName: 'Deposit',
    //     listener(node, label, owner) {
           
    //     }
               
    //         },
    //     once: true,
    // })
    // useContractEvent({
    //     address: feeShareAddress,
    //     abi: FeeShareAbi,
    //     eventName: 'Withdraw',
    //     listener(node, label, owner) {
    //         if(isConnected){
    //             dispatch(fetchUserBalanceSingleToken({address,token,networkName, provider})).then(()=>{
    //                 dispatch(fetchTokensPricesSingleToken({token, networkName, provider}))
    //                })
    //         }
    //     },
    //     once: true,
    // })
    const depositAmount = async (token: any, amount: any) => {
        if(ammount <=0){
            toast.error("Amount must be greater than 0")
            return
        }
        
        const signer = await fetchSigner()
        let contract = new Contract(token.address, RTokenAbi, signer);
        let checkAllowance = await contract.allowance(address, contractsAddresses[network.name][0].FeeShare);
        let feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        if (ethers.utils.formatUnits(checkAllowance._hex.toString(), token.decimals) < amount!.toString()) {
            const idToastApprove = toast.loading("Approving please wait...", {autoClose:5000})
            await contract.approve(contractsAddresses[network.name][0].FeeShare, ethers.utils.parseUnits(amount!.toString(), token.decimals))
                .then((res: any) => {
                    res.wait().then(async (receipt: any) => {
                        toast.update(idToastApprove, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                        const idToastDepositApprove = toast.loading("Depositing please wait...")
                        await feeShare.deposit(token.address, ethers.utils.parseUnits(amount!.toString(), token.decimals)).then((result: any) => {
                            result.wait().then(async (recept: any) => {
                                toast.update(idToastDepositApprove, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                               dispatch(fetchUserBalanceSingleToken({address,token,networkName:network.name, provider}))
                            })
                        }).catch((err: any) => {
                            toast.update(idToastDepositApprove, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                        })
                    })
                }).catch((err: any) => {
                    toast.update(idToastApprove, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                })
        }
        else {
            const idToast2 = toast.loading("Depositing please wait...")
            feeShare.deposit(token.address, ethers.utils.parseUnits(amount!.toString(), token.decimals)).then((result: any) => {
                result.wait().then(async (recept: any) => {
                    toast.update(idToast2, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                  await dispatch(fetchUserBalanceSingleToken({address,token,networkName:network.name, provider}))
                })
            }).catch((err: any) => {
                toast.update(idToast2, { render: "Your transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
            }).catch((err: any) => {
                toast.update(idToast2, { render: "Your transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
            })
        }
    }
    const witdrawDeposit = async (token: any, amount: any) => {
        if(ammount <=0){
            toast.error("Amount must be greater than 0")
            return
        }
        const signer = await fetchSigner()
        let feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        const idToastWithdraw = toast.loading("Processing transaction please wait...")
        if (amount! > parseFloat(token.userBalanceDeposit) || amount! === undefined || amount! === 0) {
            toast.update(idToastWithdraw, { render: "Input correct amount", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
        }
        else {
            feeShare.withdraw(token.address, ethers.utils.parseUnits(amount!.toString(), token.decimals)).then((result: any) => {
                result.wait().then(async (recept: any) => {
                    toast.update(idToastWithdraw, { render: "Withdraw succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                  await dispatch(fetchUserBalanceSingleToken({address,token,networkName:network.name, provider}))
                }).catch((err: any) => {
                    toast.update(idToastWithdraw, { render: "Transaction rejected", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                })
            }).catch((err: any) => {
                toast.update(idToastWithdraw, { render: "Transaction faild", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
            });
        }
    }
    const setMaxDeposit = () => {
        if (props.token.userBalance) {
            setAmmount(parseFloat(props.token.userBalance))
        }
    }
    const setMaxWithdraw = () => {
        if (props.token.userBalanceDeposit) {
            setAmmount(parseFloat(props.token.userBalanceDeposit))
        }
    }
    return (
        <div>
            <div className={!props.isNativeFee ? "hidden" : "block"}>
                <div className='font-bold text-center sm:text-sm'>To send token and pay fee in token make a deposit!</div>
                <div className="flex flex-row md:flex-col mt-3 mb-4">
                    <button className="p-2 bg-neutral-800 text-white w-full rounded-l-md md:mr-0 md:mb-3 sm:text-sm" onClick={() => { depositAmount(props.token, ammount) }}>Deposit</button><button onClick={()=>setMaxDeposit()} className="bg-transparent px-1 hover:bg-neutral-400 text-neutral-800 font-semibold hover:text-white border border-neutral-500 hover:border-transparent rounded-r-md">max</button>
                    <button className="p-2 bg-neutral-800 text-white w-full rounded-l-md sm:text-sm ml-2" onClick={() => { witdrawDeposit(props.token, ammount) }}>Withdraw</button><button onClick={()=>setMaxWithdraw()} className="bg-transparent px-1 hover:bg-neutral-400 text-neutral-800 font-semibold hover:text-white border border-neutral-500 hover:border-transparent rounded-r-md">max</button>
                </div>
                <input value={ammount} onChange={(e) => { setAmmount(parseFloat(e.target.value)) }} type="number" className="w-full rounded-md p-2 sm:p-1" />
            </div>
            <div>
                <span className="sm:text-sm">Token balance: </span> <span className="text-lg sm:text-md font-bold">{parseFloat(props.token.userBalance).toFixed(3)} {props.token.name}</span>
            </div>

        </div>
    )
}
export default DepositWithdraw;