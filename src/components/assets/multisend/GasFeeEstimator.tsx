import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Web3State } from "../../../Web3DataContext";

const GasFeeEstimator = () => {
    const {fast,average, slow, setSpeedNetwork, speedNetwork} = Web3State();
    useEffect(()=>{
        if(average > 0){
            setSpeedNetwork(average);
        }
        
    }, [average])
    return (
        <div className="w-full">
        <ToastContainer autoClose={2000} />
        <div>Network Speed {speedNetwork} Gwei </div>
        <input className="w-full" type="range" onChange={(e) => { setSpeedNetwork(e.target.value) }} defaultValue={average} min={slow} step={0.1} max={fast}></input>
        <div className="flex justify-between">
            <span className="cursor-pointer">Slow</span>
            <span className="cursor-pointer">Awerege</span>
            <span className="cursor-pointer">Instant</span>
        </div>
    </div>
    )
}
export default GasFeeEstimator;