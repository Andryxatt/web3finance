import { useAppDispatch } from "../../store/hooks";
import { changeSelectedNetwork } from "../../store/network/networkSlice";

function WalletNetwork({ name, icon, isActive }: any) {
  const dispatch = useAppDispatch();
  return (
    <div className={`${isActive ? "bg-gradient-to-r from-cyan-500 to-blue-500" : ""} w-[50%] md:w-[100%] md:p-5 cursor-pointer flex items-center flex-col relative mb-3`} onClick={() => dispatch(changeSelectedNetwork(name))}>
      <img className="sm:max-w-[50px] max-w-[100px]" src={icon} alt={name}/>
      <span className="font-bold">{name}</span>
    </div>
  )
}
export default WalletNetwork;