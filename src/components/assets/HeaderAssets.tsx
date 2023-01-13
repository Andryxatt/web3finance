import sortAscIcon from "../../images/asc.svg";
import sortIcon from "../../images/sort.svg";
import sortDescIcon from "../../images/desc.svg";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {currentNetwork} from "../../store/network/networkSlice";
import { sortTokensByPrice, sortTokenByTokenName, sortTokensByDeposit,  sortTokensByUserBalanceDeposit, sortBy, sortType } from "../../store/token/tokenSlice";
const HeaderAssets = () => {
    const dispatch = useAppDispatch();
    const network = useAppSelector(currentNetwork);
    const sort = useAppSelector(sortBy);
    const sortTypes = useAppSelector(sortType);
    return (
        <div className="px-5 py-2 justify-between flex flex-row md:hidden border-gray-300">
            <div onClick={() => dispatch(sortTokenByTokenName(network))} className="flex cursor-pointer justify-center w-[150px] font-lg">Asset
                <img className="ml-2 w-[16px]" src={sort !== "name" ? sortIcon : sortTypes === "asc" ? sortAscIcon : sortDescIcon} alt="icon" />
            </div>
            <div onClick={() => dispatch(sortTokensByPrice(network))} className="flex cursor-pointer justify-center w-[150px] ">Token price
                <img className="ml-2 w-[16px]" src={sort !== "price" ? sortIcon : sortTypes === "asc" ? sortAscIcon : sortDescIcon} alt="icon" />
            </div>
            <div onClick={() => dispatch(sortTokensByDeposit(network))} className="flex cursor-pointer justify-center w-[150px]">Total deposits ($)
                <img className="ml-2 w-[16px]" src={sort !== "deposit" ? sortIcon : sortTypes === "asc" ? sortAscIcon : sortDescIcon} alt="icon" />
            </div>
            <div onClick={() => dispatch(sortTokensByUserBalanceDeposit(network))} className="flex cursor-pointer justify-center w-[150px]">Your balance
                <img className="ml-2 w-[16px]" src={sort !== "userBalanceDeposit" ? sortIcon : sortTypes === "asc" ? sortAscIcon : sortDescIcon} alt="icon" />
            </div>
        </div>
    )
}
export default HeaderAssets