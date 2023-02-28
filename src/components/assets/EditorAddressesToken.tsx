import { useState } from "react";
import EditorFile from "./EditorFile";
import 'react-toastify/dist/ReactToastify.css';
import EditorManual from "./EditorManual";
import { addressesToSend } from "../../store/multiDeposit/multiDepositSlice";
import PreviewResultToken from "./PreviewResultToken";
const EditorAddressesToken = (props: any) => {
    const [isManual, setIsManual] = useState(true);
    const [isPreview, setIsPreview] = useState(true);
    const showNext = () => {
        if (addressesToSend.length > 0) {
            setIsPreview(!isPreview);
        }
        else {
            // const idToast = toast( "No addresses and amounts added", {type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER })
        }
    }
    const [tokenAddress, setTokenAddress] = useState("");
    const showManual = () => {
        setIsManual(!isManual);
    }
    const showPrev = () => {
        setIsPreview(!isPreview);
    }
    return (
        <>
            {
                isPreview ?
                    <div className="flex flex-row md:flex-col md:w-full w-[100%]">
                        <div className="md:flex mr-5 md:mr-0 md:flex-col w-[100%]">
                            <div className="flex flex-row md:flex-col justify-between mb-1 ">
                               <div>
                               <span>Chose contract address</span>
                                 <input onChange={(e)=>setTokenAddress(e.target.value)} placeholder="0x..."/> 
                                </div>
                                <span className="mr-2 text-sm">Addresses with Amounts</span>
                                <div className="underline cursor-pointer pl-1 text-gray-400 hover:text-gray-900 text-md" onClick={() => (setIsManual(!isManual))}> {isManual ? "Upload file" : "Insert manually"}</div>
                            </div>
                            <div>
                                {
                                    isManual ? <EditorManual /> : <EditorFile showManual={showManual} />
                                }
                                <button className="bg-blue-500 text-white font-bold px-5 py-1 rounded-md" onClick={(e) => { e.preventDefault(); showNext() }}>Next</button>
                            </div>
                        </div>
                            
                    </div> :
                    <PreviewResultToken tokenAddress={tokenAddress} showPrev={showPrev} />

            }

        </>
    )
}
export default EditorAddressesToken;