import { Web3State } from "../../../Web3DataContext";

const ListOfRecipients = () => {
    const { addressesFromFile, setAddressesFromFile } = Web3State();
    const removeAsset = (asset: any) => {
        setAddressesFromFile(addressesFromFile.filter((element: any) => element.address !== asset.address))
    }
    return (
        <div>
            <h3>List of recipients</h3>
            <div className="flex flex-col bg-whiterounded-md bg-white rounded-md">
            <div className="flex justify-between text-gray-600 p-2 border-b-2"><span>Address</span><span className="pr-[250px]  text-gray-600">Ammount</span></div>
            {
                addressesFromFile.map((asset: any) => {
                    return <div className="flex justify-between p-2 border-b-2 hover:bg-gray-50 rounded-md">
                        <span className="text-md">{asset.address}</span> <span>{asset.amount}</span> <span className="cursor-pointer text-gray-700" onClick={() =>{removeAsset(asset)}}>Remove</span>
                        </div>
                })
            }
            </div>
           
        </div> 
    )
}
export default ListOfRecipients;