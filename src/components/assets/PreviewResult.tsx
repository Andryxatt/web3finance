
import { Web3State } from "../../Web3DataContext";
import GasFeeEstimator from "./multisend/GasFeeEstimator";
import ListOfRecipients from "./multisend/ListOfRecipients";
import Summary from "./multisend/Summary";

const PreviewResult = (props:any) =>{
    const {sendTransactionToken, sendTransactionNative, sendTransactionAndPayFeeInToken} = Web3State();
    const sendTx = async () => {
        if (props.token.isNative) {
           sendTransactionNative();
        }
        else if (props.isNativeFee) {
            sendTransactionAndPayFeeInToken(props.token.address, props.token.decimal);
        }
        else {
            sendTransactionToken(props.token.address, props.token.decimal);
        }

    }
    return (
        <div className="w-full">
            <GasFeeEstimator/>
            <ListOfRecipients/>
            <Summary isNative={props.isNative} token={props.token} isNativeFee={props.isNativeFee}/>
            <button className="bg-blue-500 text-white font-bold px-5 py-1 rounded-md" onClick={props.showPrev}>Prev</button>
            <button className="b" onClick={sendTx}>Send</button>
        </div>
    )
}
export default PreviewResult;