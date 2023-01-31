import { Contract, ethers } from "ethers";
import {  useState } from "react";
import { toast } from "react-toastify";
import contractsAddresses from '../../contracts/AddressesContracts.json';
import RTokenAbi from '../../contracts/RTokenAbi.json';
import FeeShareAbi from '../../contracts/FeeShare.json';
import { currentNetwork } from "../../store/network/networkSlice";
import { useAppSelector } from "../../store/hooks";
import { fetchSigner } from '@wagmi/core'
import { useAccount } from "wagmi";
const DepositWithdraw = (props: any) => {
    const  network  = useAppSelector(currentNetwork)
    const [ammount, setAmmount] = useState(0);
    //provider wagmi
    const {address: account} = useAccount();

  
    const depositAmount = async (token: any, amount: any) => {
        const signer = await fetchSigner()
                let contract = new Contract(contractsAddresses[network.name][0][token.name], RTokenAbi, signer);
                let checkAllowance = await contract.allowance(account, contractsAddresses[network.name][0].FeeShare);
                let feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
                if (parseFloat(ethers.utils.formatUnits(checkAllowance._hex, token.decimal)) < amount!) {
                    const idToast = toast.loading("Approving please wait...")
                    await contract?.approve(contractsAddresses[network.name][0].FeeShare, ethers.utils.parseUnits(amount!.toString(), token.decimal), { gasLimit: 200000 })
                        .then((res: any) => {
                            res.wait().then(async (receipt: any) => {
                                toast.update(idToast, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                                const idToast2 = toast.loading("Depositing please wait...")
                                await feeShare.deposit(contractsAddresses[network.name][0][token.name], ethers.utils.parseUnits(amount!.toString(), token.decimal), { gasLimit: 200000 }).then((result: any) => {
                                    result.wait().then(async (recept: any) => {
                                        toast.update(idToast2, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                                    })
                                }).catch((err: any) => {
                                    toast.update(idToast2, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                                })
                            })
                        }).catch((err: any) => {
                            toast.update(idToast, { render: "Transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                        })
                }
                else {
                    const idToast2 = toast.loading("Depositing please wait...")
                    feeShare.deposit(contractsAddresses[network.name][0][token.name], ethers.utils.parseUnits(amount!.toString(), token.decimal), { gasLimit: 200000 }).then((result: any) => {
                        result.wait().then(async (recept: any) => {
                            toast.update(idToast2, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                        })
                    }).catch((err: any) => {
                        toast.update(idToast2, { render: "Your transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                    }).catch((err: any) => {
                        toast.update(idToast2, { render: "Your transaction rejected!", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                    })
                }
            }
            const witdrawDeposit = async (token: any, amount: any) => {
                const signer = await fetchSigner()
                let feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
                const idToast = toast.loading("Processing transaction please wait...")
                console.log(amount, token.userBalanceDeposit)
                if (amount! > parseFloat(token.userBalanceDeposit) || amount! === undefined || amount! === 0) {
                    toast.update(idToast, { render: "Input correct amount", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                }
                else {
                    feeShare.withdraw(contractsAddresses[network.name][0][token.name], ethers.utils.parseUnits(amount!.toString(), token.decimal), { gasLimit: "210000" }).then((result: any) => {
                        result.wait().then(async (recept: any) => {
                            toast.update(idToast, { render: "Withdraw succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                        }).catch((err: any) => {
                            toast.update(idToast, { render: "Transaction rejected", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                        })
                    }).catch((err: any) => {
                        toast.update(idToast, { render: "Transaction faild", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                    });
                }
            }
    return (
        <div>
            <div className="flex flex-row md:flex-col mt-3 mb-4">
            <button className="p-2 bg-neutral-800 text-white min-w-[100px] rounded-md mr-3 md:mr-0 md:mb-3" onClick={()=>{depositAmount(props.token, ammount)}}>Deposit</button>
            <button className="p-2 bg-neutral-800 text-white min-w-[100px] rounded-md" onClick={()=>{witdrawDeposit(props.token, ammount)}}>Withdraw</button>
        </div>
        <input onChange={(e)=>{setAmmount(parseFloat(e.target.value))}} type="number" className="w-full  rounded-md p-2"/>
        <div>
            <span>Your token balance: </span>
            <span className="text-lg">{parseFloat(props.token.userBalance).toFixed(5)} - {props.token.name}</span>
        </div>
       
        </div>
    )
}
export default DepositWithdraw;