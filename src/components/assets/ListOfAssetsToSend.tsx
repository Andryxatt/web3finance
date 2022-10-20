import { Web3State } from "../../Web3DataContext";

const ListOfAssetsToSend = () => {
    const {  addressesFromFile } = Web3State();
    return (
        <div>
            {
                addressesFromFile.map((asset: any) => {
                    return <div>
                        <div>{asset.address}</div>
                        <div>{asset.amount}</div>
                    </div>
                })
            }
        </div> 
    )
}
export default ListOfAssetsToSend;