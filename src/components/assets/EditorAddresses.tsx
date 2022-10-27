import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Web3State } from "../../Web3DataContext";
import EditorFile from "./EditorFile";
import 'react-toastify/dist/ReactToastify.css';
import EditorManual from "./EditorManual";
import PreviewResult from "./PreviewResult";
import DepositWithdraw from "./DepositWithdraw";
const EditorAddresses = (props: any) => {
    const { addressesFromFile, calculateGasLimit } = Web3State();
    const [isManual, setIsManual] = useState(true);
    const [isPreview, setIsPreview] = useState(true);
    const [isNativeFee, setIsNativeFee] = useState(false);
    const showNext = () => {
        calculateGasLimit();
        console.log("addressesFromFile", addressesFromFile);
        if (addressesFromFile.length > 0) {
            setIsPreview(!isPreview);
        }
        else {
            // const idToast = toast( "No addresses and amounts added", {type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER })
        }
    }

    const showPrev = () => {
        setIsPreview(!isPreview);
    }
    return (
        <>
            <ToastContainer />
            {
                isPreview ? <><div className="w-full mr-5 ">
                    <div className="flex flex-row justify-between mb-1">
                        <span>Addresses with Amounts</span>
                        {
                            !props.token.isNative ?  <label htmlFor="default-toggle" className="inline-flex relative items-center cursor-pointer">
                            <input type="checkbox" value="" id="default-toggle" onChange={()=>{setIsNativeFee(!isNativeFee)}} className="sr-only peer"/>
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Switch to pay fee in token</span>
                        </label> : <></>
                        }
                       
                        <div className="cursor-pointer text-gray-500 underline" onClick={() => (setIsManual(!isManual))}> {isManual ? "Upload file" : "Insert manually"}</div>
                    </div>
                    {
                        isManual ? <EditorManual /> : <EditorFile />
                    }
                    <button className="bg-blue-500 text-white font-bold px-5 py-1 rounded-md" onClick={(e) => { e.preventDefault(); showNext() }}>Next</button>

                </div><DepositWithdraw token={props.token} /></> :
                    <PreviewResult isNativeFee={isNativeFee} token={props.token} isNative={props.isNative} showPrev={showPrev} />

            }

        </>
    )
}
export default EditorAddresses;