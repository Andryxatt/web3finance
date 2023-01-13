import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectNetwork, currentNetwork, changeSelectedNetwork } from "../../store/network/networkSlice";

const HeaderNetworks = () => {
    const networks = useAppSelector(selectNetwork);
    const selectedNetwork = useAppSelector(currentNetwork);
    const dispatch = useAppDispatch();
    return (
        <div className="flex justify-between md:flex-col items-center border-b-[1px] border-gray-300">
        {
            networks.map((network: any, index: number) => {
                return (
                    network.isActive ?
                        <div key={index} className="group w-full h-full cursor-not-allowed flex flex-row items-center justify-center border-b-4 py-10 md:py-3 border-orange-400">
                            <img className="w-[30px] mr-5 md:mr-0" src={network.icon} alt={network.name} />
                            <h2 className="group-hover:underline text-lg font-bold">{network.name}</h2>
                        </div> :
                        <div key={index} onClick={() => dispatch(changeSelectedNetwork(network.chainId))} className="group w-full h-full cursor-pointer py-10 md:py-3 flex flex-row items-center justify-center">
                            <img className="w-[30px] mr-5 md:mr-0" src={network.icon} alt={network.name} />
                            <h2 className="group-hover:underline text-lg font-bold">{network.name}</h2>
                        </div>
                )
            })
        }
    </div>
    )
}
export default HeaderNetworks;