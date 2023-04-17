import { useState } from "react";
import EditorFile from "./EditorFile";
import EditorManual from "./EditorManual";
import { Token } from "../../store/token/tokenSlice";
import ToogleFee from "./multisend/ToogleFee";
import DepositWithdraw from "./DepositWithdraw";

const Editors = (props:{token:Token, isNativeFee:boolean, handleNativeFee:any}) => {
    const [isManual, setIsManual] = useState(true);
 
    const showManual = () => {
        setIsManual(!isManual);
    }
    return (
        <div className="flex flex-row md:flex-col md:w-full w-[100%]">
        <div className="md:flex mr-5 md:mr-0 md:flex-col w-[100%]">
            <div className="flex flex-row md:flex-col sm:flex-row justify-between mb-1 sm:mb-0">
                <span className="mr-2 text-sm line leading-0 sm:text-xs">Addresses with Amounts</span>
                <div className="underline cursor-pointer pl-1 text-gray-400 hover:text-gray-900 text-sm" onClick={() => (setIsManual(!isManual))}> {isManual ? "Upload file" : "Insert manually"}</div>
            </div>
            <div>
                {
                    isManual ? <EditorManual /> : <EditorFile showManual={showManual} />
                }
                
            </div>
        </div>
        {props.token.isNative ? <></> :
            <div className="w-[380px] sm:w-auto">
                <div className="flex-row">
                    <div className="flex-col">
                      
                        <ToogleFee tokenName={props.token.name} isNativeFee={props.isNativeFee} setIsNativeFee={props.handleNativeFee} />
                    </div>
                    <DepositWithdraw isNativeFee={props.isNativeFee}  token={props.token} />
                </div>
            </div>

        }
    </div>
    )
}
export default Editors;