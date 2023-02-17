
import GasFeeEstimator from "./multisend/GasFeeEstimator";
import ListOfRecipients from "./multisend/ListOfRecipients";
import NetworkSpeed from "./multisend/NetworkSpeed";
import Summary from "./multisend/Summary";
const PreviewResult = (props:any) =>{
    return (
        <div className="w-full">
           <NetworkSpeed/>
            <ListOfRecipients/>
            <Summary showPrev={props.showPrev} isNative={props.isNative} token={props.token} isNativeFee={props.isNativeFee}/>
        </div>
    )
}
export default PreviewResult;