import { useEffect, useState } from "react";
import EditorFile from "./EditorFile";
import 'react-toastify/dist/ReactToastify.css';
import EditorManual from "./EditorManual";
import { addressesToSend } from "../../store/multiDeposit/multiDepositSlice";
import PreviewResultToken from "./PreviewResultToken";
// import { Contract, ethers } from "ethers";
import { toast } from "react-toastify";
import { ethers } from "ethers";
// import { useProvider } from "wagmi";
// import contractsAddresses from "./../../contracts/AddressesContracts.json";
// import FeeShareAbi from "./../../contracts/FeeShare.json";
// import { useAppSelector } from "../../store/hooks";
const EditorAddressesToken = (props: any) => {
    const [isManual, setIsManual] = useState(true);
    const [isPreview, setIsPreview] = useState(true);
    const showNext = () => {
        if (addressesToSend.length > 0 && tokenAddress !== "") {
            setIsPreview(!isPreview);
        }
        else {
           toast("No token address or amounts added", { type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER })
        }
    }
    const [tokenAddress, setTokenAddress] = useState("");
    const [isValidate, setIsValidate] = useState(true);
    const [messageErrorAddress, setMessageErrorAddress] = useState("");
    const showManual = () => {
        setIsManual(!isManual);
    }
    const showPrev = () => {
        setIsPreview(!isPreview);
    }
    // const network = useAppSelector(currentNetwork);
    // const provider = useProvider();
    // const isFeeShareToken = async () => {
    //     const feeShare = new Contract(contractsAddresses[network.name][0].FeeShare, FeeShareAbi, provider);
    //     const checkAddress = await feeShare.getRTokenAddress(tokenAddress);
    //     if (checkAddress === "0x0000000000000000000000000000000000000000") {
    //         return false;
    //     }
    //     else {

    //         return true;
    //     }
    // }
    useEffect(() => {
        if (tokenAddress !== "") {
            console.log(ethers.utils.isAddress(tokenAddress));
            ethers.utils.isAddress(tokenAddress) ? setIsValidate(true) : setIsValidate(false);
            ethers.utils.isAddress(tokenAddress) ? setMessageErrorAddress("") : setMessageErrorAddress("Invalid address");
        }
        else {
            setIsValidate(false);
            setMessageErrorAddress("Invalid address");
        }
    }, [tokenAddress])
    return (
        <>
            {
                isPreview ?
                    <div className="flex flex-row md:flex-col md:w-full w-[100%]">
                        <div className="md:flex mr-5 md:mr-0 md:flex-col w-[100%]">
                            <div className="flex flex-col mb-1 ">
                                <div className="mb-2 flex flex-col">
                                    <span className="mr-2 text-sm mb-2">Enter contract address</span>
                                    <input className={
                                        isValidate === true ?
                                            "block w-full p-1 text-gray-900 border border-gray-300 rounded-md bg-gray-50 sm:text-xs dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                            : "bg-red-50 text-red-900 placeholder-red-700 rounded-md block w-full p-1 focus:outline-none focus:ring focus:ring-red-300"
                                    }
                                        onChange={(e) => setTokenAddress(e.target.value)} placeholder="0x..." />
                                    <span className="rounded text-red-400">{messageErrorAddress}</span>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <span className="mr-2 text-sm">Addresses with Amounts</span>
                                    <div className="underline cursor-pointer pl-1 text-gray-400 hover:text-gray-900 text-md" onClick={() => (setIsManual(!isManual))}> {isManual ? "Upload file" : "Insert manually"}</div>
                                </div>
                            </div>
                            <div>
                                {
                                    isManual ? <EditorManual /> : <EditorFile showManual={showManual} />
                                }
                                <button className={`${!isValidate && tokenAddress !== "" ? "bg-blue-300" : "bg-blue-500"} text-white font-bold px-5 py-1 rounded-md`} disabled={!isValidate && tokenAddress !== ""} onClick={(e) => { e.preventDefault(); showNext() }}>Next</button>
                            </div>
                        </div>
                    </div> :
                    <PreviewResultToken tokenAddress={tokenAddress} showPrev={showPrev} />
            }
        </>
    )
}
export default EditorAddressesToken;