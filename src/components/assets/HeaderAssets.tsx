import { useState } from "react";
import sortAscIcon from "../../images/asc.svg";
import sortIcon from "../../images/sort.svg";
import sortDescIcon from "../../images/desc.svg";
import { Web3State } from "../../Web3DataContext";
const HeaderAssets = () => {
    const [sortName, setSortName] = useState("");
    const [sortPrice, setSortPrice] = useState("");
    const [sortDeposits, setSortDeposits] = useState("");
    const [sortUserDeposit, setSortUserDeposit] = useState("");
    const { tokens, setTokens } = Web3State();
    const sortByName = () => {

        const res = [...tokens].sort((a: any, b: any) => {
            if (sortName === "asc") {
                return a.name > b.name ? 1 : -1;
            }
            else {
                return a.name < b.name ? 1 : -1;
            }
        });
        setSortPrice("");
        setSortDeposits("");
        setSortUserDeposit("");
        setSortName(sortName === "asc" ? "desc" : "asc");
        setTokens(res);
    }
    const sortByPrice = () => {
        const res = tokens.sort((a: any, b: any) => {
            if (sortPrice === "asc") {
                return a.tokenPrice > b.tokenPrice ? 1 : -1;
            }
            else {
                return a.tokenPrice < b.tokenPrice ? 1 : -1;
            }
        });
        setSortName("");
        setSortDeposits("");
        setSortUserDeposit("");
        setSortPrice(sortPrice === "asc" ? "desc" : "asc");
        setTokens(res);
    }
    const sortByDeposits = () => {
        const res = tokens.sort((a: any, b: any) => {
            if (sortDeposits === "asc") {
                return a.deposits > b.deposits ? 1 : -1;
            }
            else {
                return a.deposits < b.deposits ? 1 : -1;
            }
        });
        setSortPrice("");
        setSortName("");
        setSortUserDeposit("");
        setSortDeposits(sortDeposits === "asc" ? "desc" : "asc");
        setTokens(res);
    }
    const sortByUserDeposit = () => {
        const res = tokens.sort((a: any, b: any) => {
            if (sortUserDeposit === "asc") {
                return a.userBalance > b.userBalance ? 1 : -1;
            }
            else {
                return a.userBalance < b.userBalance ? 1 : -1;
            }
        });
        setSortPrice("");
        setSortName("");
        setSortDeposits("");
        setSortUserDeposit(sortUserDeposit === "asc" ? "desc" : "asc");
        setTokens(res);
    }
    return (
        <div className="px-5 py-2 justify-between flex flex-row md:hidden border-gray-300">
            <div onClick={() => sortByName()} className="flex cursor-pointer justify-center w-[150px] font-lg">Asset
                <img className="ml-2 w-[16px]" src={sortName === "" ? sortIcon : sortName === "asc" ? sortAscIcon : sortDescIcon} alt="icon" />
            </div>
            <div onClick={() => sortByPrice()} className="flex cursor-pointer justify-center w-[150px] ">Token price
                <img className="ml-2 w-[16px]" src={sortPrice === "" ? sortIcon : sortPrice === "asc" ? sortAscIcon : sortDescIcon} alt="icon" />
            </div>
            <div onClick={() => sortByDeposits()} className="flex cursor-pointer justify-center w-[150px]">Total deposits ($)
                <img className="ml-2 w-[16px]" src={sortDeposits === "" ? sortIcon : sortDeposits === "asc" ? sortAscIcon : sortDescIcon} alt="icon" />
            </div>
            <div onClick={() => sortByUserDeposit()} className="flex cursor-pointer justify-center w-[150px]">Your balance
                <img className="ml-2 w-[16px]" src={sortUserDeposit === "" ? sortIcon : sortUserDeposit === "asc" ? sortAscIcon : sortDescIcon} alt="icon" />
            </div>
        </div>
    )
}
export default HeaderAssets