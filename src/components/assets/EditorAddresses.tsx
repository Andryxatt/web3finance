import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Web3State } from "../../Web3DataContext";
import EditorFile from "./EditorFile";
import 'react-toastify/dist/ReactToastify.css';
import EditorManual from "./EditorManual";
import PreviewResult from "./PreviewResult";
import DepositWithdraw from "./DepositWithdraw";
const EditorAddresses = (props:any) => {
    const {addressesFromFile, setAddressesFromFile} = Web3State();
    const [isManual, setIsManual] = useState(true);
    const [isPreview, setIsPreview] = useState(true);
    const showNext = () =>{
        console.log("addressesFromFile", addressesFromFile);
        if(addressesFromFile.length > 0){
            setIsPreview(!isPreview);
        }
       else {
            const idToast = toast( "No addresses and amounts added", {type: "error", autoClose: 2000, isLoading: false, position: toast.POSITION.TOP_CENTER })
       }
    }

    const showPrev = () =>{
        setIsPreview(!isPreview);
    }
    return (
        <>
         <ToastContainer/>
        {
            isPreview ? <><div className="w-full mr-5 ">
            <div className="flex flex-row justify-between mb-1">
                <span>Addresses with Amounts</span>
                <div className="cursor-pointer text-gray-500 underline" onClick={() => (setIsManual(!isManual))}> {isManual ? "Upload file" : "Insert manually"}</div>
            </div>
            {
                isManual ? <EditorManual /> : <EditorFile />
            }
            <button className="bg-blue-500 text-white font-bold px-5 py-1 rounded-md" onClick={(e) => {e.preventDefault();showNext()}}>Next</button>
           
        </div><DepositWithdraw/></> :
        <PreviewResult token={props.token} isNative={props.isNative} showPrev={showPrev}/>
    
        }
      
        </>
    )
}
export default EditorAddresses;