import { useState } from "react";
import { ToastContainer } from "react-toastify";
import EditorFile from "./EditorFile";
import 'react-toastify/dist/ReactToastify.css';
import EditorManual from "./EditorManual";
import PreviewResult from "./PreviewResult";
import DepositWithdraw from "./DepositWithdraw";
import ToogleFee from "./multisend/ToogleFee";
import { addressesToSend } from "../../store/multiDeposit/multiDepositSlice";
const EditorAddresses = (props: any) => {
    const [isManual, setIsManual] = useState(true);
    const [isPreview, setIsPreview] = useState(true);
    const [isNativeFee, setIsNativeFee] = useState(true);
    const showNext = () => {
        if (addressesToSend.length > 0) {
            setIsPreview(!isPreview);
        }
        else {
            // const idToast = toast( "No addresses and amounts added", {type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER })
        }
    }
    const toogleNativeFee = () => {
        setIsNativeFee(!isNativeFee);
    }

    const showPrev = () => {
        setIsPreview(!isPreview);
    }
    return (
        <>
            <ToastContainer />
            {
                isPreview ?
                    <div className="flex flex-row md:flex-col md:w-full">
                        <div className="md:flex mr-5 md:mr-0 md:flex-col">
                            <div className="flex flex-row md:flex-col justify-between mb-1">
                                <span className="mr-2">Addresses with Amounts</span>
                            
                                <div className="cursor-pointer text-gray-500 underline" onClick={() => (setIsManual(!isManual))}> {isManual ? "Upload file" : "Insert manually"}</div>
                            </div>
                            <div>
                                {
                                    isManual ? <EditorManual /> : <EditorFile />
                                }
                                <button className="bg-blue-500 text-white font-bold px-5 py-1 rounded-md" onClick={(e) => { e.preventDefault(); showNext() }}>Next</button>
                            </div>
                        </div>
                            {props.token.isNative ? <></> :
                            <div className="flex-col">
                                <div className="flex-col">
                                     <div className='font-bold'>To send token and pay fee in token make a deposit!</div>
                                    <ToogleFee tokenName={props.token.name} isNativeFee={isNativeFee} setIsNativeFee={toogleNativeFee} />
                                </div>
                           
                            <DepositWithdraw token={props.token} />
                            </div>
                        }
                    </div> :
                    <PreviewResult isNativeFee={isNativeFee} token={props.token} isNative={props.isNative} showPrev={showPrev} />

            }

        </>
    )
}
export default EditorAddresses;