import { useState } from "react";
import { Web3State } from "../../Web3DataContext";


const DepositWithdraw = (props:any) =>{
    const {depositAmount, witdrawDeposit} = Web3State();
    const [ammount, setAmmount] = useState(0);
    
    return (
        <div>
        <div className="flex flex-row md:flex-col mt-7 mb-4">
            <button className="p-2 bg-neutral-800 text-white min-w-[100px] rounded-md mr-3 md:mr-0 md:mb-3" onClick={()=>{depositAmount(props.token, ammount)}}>Deposit</button>
            <button className="p-2 bg-neutral-800 text-white min-w-[100px] rounded-md" onClick={()=>{witdrawDeposit(props.token, ammount)}}>Withdraw</button>
        </div>
        <input onChange={(e)=>{setAmmount(parseFloat(e.target.value))}} type="number" className="w-full  rounded-md p-2"/>
        </div>
    )
}
export default DepositWithdraw;