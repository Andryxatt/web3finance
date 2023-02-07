// import { ethers } from "ethers";
import { ToastContainer } from "react-toastify";


const GasFeeEstimator = () => {

    return (
        <div className="w-full">
        <ToastContainer autoClose={2000} />
        <div>Network Speed  Gwei </div>
        <input  className="w-full" type="range" defaultValue={0} min={0} step={0.1} max={5}></input>
        <div className="flex justify-between">
            <span className="cursor-pointer">Slow</span>
            <span className="cursor-pointer">Awerege</span>
            <span className="cursor-pointer">Instant</span>
        </div>
    </div>
    )
}
export default GasFeeEstimator;