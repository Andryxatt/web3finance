import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import contractsAddresses from '../../contracts/AddressesContracts.json';
import RTokenAbi from '../../contracts/RTokenAbi.json';
import FeeShareAbi from '../../contracts/FeeShare.json';
import { currentNetwork } from "../../store/network/networkSlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchSigner } from '@wagmi/core'
import { useAccount, useProvider, useContractEvent } from "wagmi";
import {
    fetchTokensPricesArbitrum,
    fetchUserBalanceArbitrum,
    fetchTokensPricesAvalanche,
    fetchTokensPricesBsc,
    fetchTokensPricesBscT,
    fetchTokensPricesEth,
    fetchTokensPricesOptimism,
    fetchTokensPricesPolygon,
    fetchUserBalanceAvalanche,
    fetchUserBalanceBsc,
    fetchUserBalanceBscT,
    fetchUserBalanceEth,
    fetchUserBalanceOptimism,
    fetchUserBalancePolygon
} from "../../store/token/tokenSlice";
const DepositWithdraw = (props: any) => {
    const dispatch = useAppDispatch();
    const provider = useProvider()
    const network = useAppSelector(currentNetwork);
    const [ammount, setAmmount] = useState(0);
    //provider wagmi
    const { address, isConnected } = useAccount();
    const [feeShareAddress, setFeeShareAddress] = useState()
    useEffect(() => {
        if (network) {
            setFeeShareAddress(contractsAddresses[network.name][0].FeeShare)
        }
    }, [network])
    useContractEvent({
        address: feeShareAddress,
        abi: FeeShareAbi,
        eventName: 'Deposit',
        listener(node, label, owner) {
            if (isConnected && network.id === 1) {
                dispatch(fetchTokensPricesEth({})).then(() => {
                    dispatch(fetchUserBalanceEth({ provider, address }))
                })
            }
            // if (isConnected && network.id === 5) {
            //     dispatch(fetchTokensPricesGoerli({})).then(() => {
            //         dispatch(fetchUserBalanceGoerli({ provider, address }))
            //     })
            // }
            if (isConnected && network.id === 10) {
                dispatch(fetchTokensPricesOptimism({})).then(() => {
                    dispatch(fetchUserBalanceOptimism({ provider, address }))
                })
            }
            if (isConnected && network.id === 56) {
                dispatch(fetchTokensPricesBsc({})).then(() => {
                    dispatch(fetchUserBalanceBsc({ provider, address }))
                })
            }
            if (isConnected && network.id === 97) {
                dispatch(fetchTokensPricesBscT({})).then(() => {
                    dispatch(fetchUserBalanceBscT({ provider, address }))
                })
            }
            if (isConnected && network.id === 137) {
                dispatch(fetchTokensPricesPolygon({})).then(() => {
                    dispatch(fetchUserBalancePolygon({ provider, address }))
                })
            }
            // if (isConnected && network.id === 80001) {
            //     dispatch(fetchTokensPricesMumbai({})).then(() => {
            //         dispatch(fetchUserBalanceMumbai({ provider, address }))
            //     })
            // }
            if (isConnected && network.id === 42161) {
                dispatch(fetchTokensPricesArbitrum({})).then(() => {
                    dispatch(fetchUserBalanceArbitrum({ provider, address }))
                })
            }
            if (isConnected && network.id === 43114) {
                dispatch(fetchTokensPricesAvalanche({})).then(() => {
                    dispatch(fetchUserBalanceAvalanche({ provider, address }))
                })
            }
        },
        once: true,
    })
    useContractEvent({
        address: feeShareAddress,
        abi: FeeShareAbi,
        eventName: 'Withdraw',
        listener(node, label, owner) {
            if (isConnected && network.id === 1) {
                dispatch(fetchTokensPricesEth({})).then(() => {
                    dispatch(fetchUserBalanceEth({ provider, address }))
                })
            }
            // if (isConnected && network.id === 5) {
            //     dispatch(fetchTokensPricesGoerli({})).then(() => {
            //         dispatch(fetchUserBalanceGoerli({ provider, address }))
            //     })
            // }
            if (isConnected && network.id === 10) {
                dispatch(fetchTokensPricesOptimism({})).then(() => {
                    dispatch(fetchUserBalanceOptimism({ provider, address }))
                })
            }
            if (isConnected && network.id === 56) {
                dispatch(fetchTokensPricesBsc({})).then(() => {
                    dispatch(fetchUserBalanceBsc({ provider, address }))
                })
            }
            if (isConnected && network.id === 97) {
                dispatch(fetchTokensPricesBscT({})).then(() => {
                    dispatch(fetchUserBalanceBscT({ provider, address }))
                })
            }
            if (isConnected && network.id === 137) {
                dispatch(fetchTokensPricesPolygon({})).then(() => {
                    dispatch(fetchUserBalancePolygon({ provider, address }))
                })
            }
            // if (isConnected && network.id === 80001) {
            //     dispatch(fetchTokensPricesMumbai({})).then(() => {
            //         dispatch(fetchUserBalanceMumbai({ provider, address }))
            //     })
            // }
            if (isConnected && network.id === 42161) {
                dispatch(fetchTokensPricesArbitrum({})).then(() => {
                    dispatch(fetchUserBalanceArbitrum({ provider, address }))
                })
            }
            if (isConnected && network.id === 43114) {
                dispatch(fetchTokensPricesAvalanche({})).then(() => {
                    dispatch(fetchUserBalanceAvalanche({ provider, address }))
                })
            }
        },
        once: true,
    })
    const depositAmount = async (token: any, amount: any) => {
        console.log(token, "token")
        const signer = await fetchSigner()
        console.log(contractsAddresses[network.name][0], "network name")
        let contract = new Contract(token.address, RTokenAbi, signer);
        console.log(contract, "contract")
        let checkAllowance = await contract.allowance(address, contractsAddresses[network.name][0].FeeShare);
        let feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, signer);
        if (parseFloat(ethers.utils.formatUnits(checkAllowance._hex, token.decimal)) < amount!) {
            const idToastApprove = toast.loading("Approving please wait...")
            await contract.approve(contractsAddresses[network.name][0].FeeShare, ethers.utils.parseUnits(amount!.toString(), token.decimal), { gasLimit: 200000 })
                .then((res: any) => {
                    res.wait().then(async (receipt: any) => {
                        toast.update(idToastApprove, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                        const idToastDepositApprove = toast.loading("Depositing please wait...")
                        await feeShare.deposit(token.address, ethers.utils.parseUnits(amount!.toString(), token.decimal), { gasLimit: 200000 }).then((result: any) => {
                            result.wait().then(async (recept: any) => {
                                toast.update(idToastDepositApprove, { render: "Transaction succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
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
            feeShare.deposit(token.address, ethers.utils.parseUnits(amount!.toString(), token.decimal), { gasLimit: 200000 }).then((result: any) => {
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
        const idToastWithdraw = toast.loading("Processing transaction please wait...")
        if (amount! > parseFloat(token.userBalanceDeposit) || amount! === undefined || amount! === 0) {
            toast.update(idToastWithdraw, { render: "Input correct amount", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
        }
        else {
            feeShare.withdraw(token.address, ethers.utils.parseUnits(amount!.toString(), token.decimal), { gasLimit: "210000" }).then((result: any) => {
                result.wait().then(async (recept: any) => {
                    toast.update(idToastWithdraw, { render: "Withdraw succesfuly", autoClose: 2000, type: "success", isLoading: false, position: toast.POSITION.TOP_CENTER });
                }).catch((err: any) => {
                    toast.update(idToastWithdraw, { render: "Transaction rejected", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
                })
            }).catch((err: any) => {
                toast.update(idToastWithdraw, { render: "Transaction faild", autoClose: 2000, type: "error", isLoading: false, position: toast.POSITION.TOP_CENTER });
            });
        }
    }
    return (
        <div>
            <div className={!props.isNativeFee ? "hidden" : "block"}>
                <div className='font-bold text-center sm:text-sm'>To send token and pay fee in token make a deposit!</div>
                <div className="flex flex-row md:flex-col mt-3 mb-4">
                    <button className="p-2 bg-neutral-800 text-white w-full rounded-md mr-3 md:mr-0 md:mb-3 sm:text-sm" onClick={() => { depositAmount(props.token, ammount) }}>Deposit</button>
                    <button className="p-2 bg-neutral-800 text-white w-full rounded-md sm:text-sm" onClick={() => { witdrawDeposit(props.token, ammount) }}>Withdraw</button>
                </div>
                <input onChange={(e) => { setAmmount(parseFloat(e.target.value)) }} type="number" className="w-full rounded-md p-2 sm:p-1" />
            </div>
            <div>
                <span className="sm:text-sm">Token balance: </span> <span className="text-lg sm:text-md font-bold">{parseFloat(props.token.userBalance).toFixed(3)} {props.token.name}</span>
            </div>

        </div>
    )
}
export default DepositWithdraw;