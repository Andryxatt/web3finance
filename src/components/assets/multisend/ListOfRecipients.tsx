import { useAppDispatch, useAppSelector } from "../../../store/hooks"
import { removeSingleAddress, addressesToSend } from "../../../store/multiDeposit/multiDepositSlice"
const ListOfRecipients = () => {
    const addresses = useAppSelector(addressesToSend)
    const dispatch = useAppDispatch()
    return (
        <div>
            <h3>List of recipients</h3>
            <div className="flex flex-col bg-whiterounded-md bg-white rounded-md  overflow-auto max-h-[300px]">
                <div className="flex justify-between text-gray-600 p-2 border-b-2">
                    <span>Address</span><span className="pr-[250px]  text-gray-600">Ammount</span>
                    </div>
                {
                    addresses.map((asset: any, index: number) => {
                        return <div key={index} className="flex justify-between p-2 border-b-2 hover:bg-gray-50 rounded-md">
                            <span className="text-md">{asset.address}</span> <span>{asset.amount}</span> <span className="cursor-pointer text-gray-700" onClick={() => { dispatch(removeSingleAddress(asset)) }}>Remove</span>
                        </div>
                    })
                }
            </div>

        </div>
    )
}
export default ListOfRecipients;