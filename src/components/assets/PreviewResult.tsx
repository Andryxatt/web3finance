
import GasFeeEstimator from "./multisend/GasFeeEstimator";
import ListOfRecipients from "./multisend/ListOfRecipients";
import Summary from "./multisend/Summary";

const PreviewResult = (props:any) =>{
    return (
        <div className="w-full">
            <GasFeeEstimator/>
            <ListOfRecipients/>
            <Summary isNative={props.isNative} token={props.token}/>
            <button className="bg-blue-500 text-white font-bold px-5 py-1 rounded-md" onClick={props.showPrev}>Prev</button>
            <button className="b">Send</button>
        </div>
    )
}
export default PreviewResult;