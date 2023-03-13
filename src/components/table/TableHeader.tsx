import HeaderAssets from "../assets/HeaderAssets";
import HeaderFilters from "../assets/HeaderFilters";
import HeaderNetworks from "../assets/HeaderNetworks";
const TableHeader = () => {
    return (
        <div>
            <HeaderNetworks />
            <HeaderFilters />
            <HeaderAssets />
        </div>)
}
export default TableHeader;