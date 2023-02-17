import axios from "axios";
import { useEffect } from "react";
import { useNetwork, useProvider } from "wagmi";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getNetworkPriority, networkSpeedsArray, setSelectedPriority, selectedSpeed } from "../../../store/multiDeposit/multiDepositSlice";
const NetworkSpeed = (props: any) => {
    const provider = useProvider()
    const speeds = useAppSelector(networkSpeedsArray);
    const dispatch = useAppDispatch()
    const { chain } = useNetwork();
    const apiOwracle = process.env.REACT_APP_OWRACLE_API_KEY;
    const getTxFeePriority = () => {
        axios.get(`https://api.owlracle.info/v3/${chain.id}/gas?apikey=${apiOwracle}`).then((response) => {
            dispatch(getNetworkPriority(response.data.speeds));
        });
    }
    const changeSelectedTip = (item:any) => {
        dispatch(setSelectedPriority(item))
    }
    const speedActive = useAppSelector(selectedSpeed);
    useEffect(() => {
        provider.on('block', (res)=>{
            console.log("subscibed")
            getTxFeePriority()
        })
        return () => {
            console.log("unsubscibed")
            provider.removeAllListeners();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="flex flex-row justify-between">
            {
                speeds.map((item:any, index:number) => {
                    return <div onClick={() => changeSelectedTip(item)} className={` ${speedActive === item ? "bg-slate-600" : ""} border-2 p-2 cursor-pointer`} key={index}>
                                <div>
                                 {index === 0 ? "Slow" : <></>}
                                 {index === 1 ? "Standard" : <></>}
                                 {index === 2 ? "Fast" : <></>}
                                 {index === 3 ? "Instant" : <></>}
                                </div>
                                <div className="flex flex-col">
                                    <span>{item.maxFeePerGas.toFixed(2)}</span>
                                    <span></span>
                                    <span>Base: {item.baseFee.toFixed(2)}</span>
                                    <span>Tip: {item.maxPriorityFeePerGas.toFixed(2)}</span>
                                </div>
                            </div>
                })
            }

        </div>
    )
}
export default NetworkSpeed;