import { useAccount } from "wagmi";
import HeaderAssets from "../assets/HeaderAssets";
import HeaderFilters from "../assets/HeaderFilters";
import HeaderNetworks from "../assets/HeaderNetworks";
const TableHeader = () => {
    const {isConnected} = useAccount()
    return (
        <>
           {
            !isConnected && <HeaderNetworks />
           } 
            <HeaderFilters />
            <HeaderAssets />
        </>)
}
export default TableHeader;