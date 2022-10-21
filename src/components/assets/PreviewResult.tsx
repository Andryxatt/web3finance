
import GasFeeEstimator from "./multisend/GasFeeEstimator";
import ListOfRecipients from "./multisend/ListOfRecipients";
import MultiSendError from "./multisend/MultiSendError";
import Summary from "./multisend/Summary";

const PreviewResult = (props:any) =>{
    return (
        <div className="w-full">
            <GasFeeEstimator/>
            <ListOfRecipients/>
            <Summary/>
            <MultiSendError/>
            <button className="bg-blue-500 text-white font-bold px-5 py-1 rounded-md" onClick={props.showPrev}>Prev</button>
            <button>Send</button>
        </div>
    )
}
export default PreviewResult;