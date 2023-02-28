
import GasFeeEstimator from "./multisend/GasFeeEstimator";
import ListOfRecipients from "./multisend/ListOfRecipients";
import SummaryToken from "./multisend/SummaryToken";
const PreviewResultToken = (props:any) =>{
    return (
        <div className="w-full">
            <GasFeeEstimator/>
            <ListOfRecipients/>
            <SummaryToken showPrev={props.showPrev} tokenAddress={props.tokenAddress}/>
        </div>
    )
}
export default PreviewResultToken;