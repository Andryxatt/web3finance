
import { useEffect } from "react";
import GasFeeEstimator from "./multisend/GasFeeEstimator";
import ListOfRecipients from "./multisend/ListOfRecipients";
import Summary from "./multisend/Summary";
const PreviewResult = (props:any) =>{
    useEffect(() => {
        return () => {
            props.showPrev();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="w-full">
            <GasFeeEstimator/>
            <ListOfRecipients/>
            <Summary showPrev={props.showPrev} isNative={props.isNative} token={props.token} isNativeFee={props.isNativeFee}/>
        </div>
    )
}
export default PreviewResult;