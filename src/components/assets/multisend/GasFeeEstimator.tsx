import { useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";

const GasFeeEstimator = () => {
    // const inputRef = useRef(null);
    // useEffect(() => {
    //         setSpeedNetwork(average);
    //         // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[average])
    return (
        <div className="w-full">
        {/* <ToastContainer autoClose={2000} />
        <div>Network Speed {speedNetwork} Gwei </div>
        <input ref={inputRef} className="w-full" type="range" onChange={(e) => { setSpeedNetwork(inputRef.current.value) }} defaultValue={average} min={slow} step={0.1} max={fast}></input>
        <div className="flex justify-between">
            <span className="cursor-pointer">Slow</span>
            <span className="cursor-pointer">Awerege</span>
            <span className="cursor-pointer">Instant</span>
        </div> */}
    </div>
    )
}
export default GasFeeEstimator;