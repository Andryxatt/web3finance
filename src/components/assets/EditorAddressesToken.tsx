import { useEffect, useState } from "react";
import EditorFile from "./EditorFile";
import 'react-toastify/dist/ReactToastify.css';
import EditorManual from "./EditorManual";
import { addressesToSend } from "../../store/multiDeposit/multiDepositSlice";
import PreviewResultToken from "./PreviewResultToken";
import { ethers } from "ethers";
const EditorAddressesToken = (props: any) => {
    const [isManual, setIsManual] = useState(true);
    const [isPreview, setIsPreview] = useState(true);
    const showNext = () => {
        if (addressesToSend.length > 0 && tokenAddress !== "") {
            setIsPreview(!isPreview);
        }
        else {
            // const idToast = toast( "No addresses and amounts added", {type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER })
        }
    }
    const [tokenAddress, setTokenAddress] = useState("");
    const [isValidate, setIsValidate] = useState(true);
    const showManual = () => {
        setIsManual(!isManual);
    }
    const showPrev = () => {
        setIsPreview(!isPreview);
    }
    useEffect(() => {
        if(tokenAddress !== ""){
            console.log(tokenAddress);
            ethers.utils.isAddress(tokenAddress) ? setIsValidate(true) : setIsValidate(false);
        }
    }, [tokenAddress])
    return (
        <>
            {
                isPreview ?
                    <div className="flex flex-row md:flex-col md:w-full w-[100%]">
                        <div className="md:flex mr-5 md:mr-0 md:flex-col w-[100%]">
                            <div className="flex flex-col mb-1 ">
                                <div className="mb-2 flex flex-row">
                                    <span className="mr-2 text-sm">Enter contract address</span>
                                    <input className={
                                        isValidate === true ?
                                            "block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            : "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-red-100 dark:border-red-400"
                                    }
                                        onChange={(e) => setTokenAddress(e.target.value)} placeholder="0x..." />
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
                                <button className={`${!isValidate ? "bg-blue-300" : "bg-blue-500"} text-white font-bold px-5 py-1 rounded-md`} disabled={!isValidate} onClick={(e) => { e.preventDefault(); showNext() }}>Next</button>
                            </div>
                        </div>
                    </div> :
                    <PreviewResultToken tokenAddress={tokenAddress} showPrev={showPrev} />
            }
        </>
    )
}
export default EditorAddressesToken;