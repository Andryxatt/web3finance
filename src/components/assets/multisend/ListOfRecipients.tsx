// import { useAppDispatch, useAppSelector } from "../../../store/hooks"
// import { removeSingleAddress, addressesToSend } from "../../../store/multiDeposit/multiDepositSlice"
// import { useMediaQuery } from 'react-responsive'
// const ListOfRecipients = () => {
//     const isTabletOrMobile = useMediaQuery({ query: '(max-width: 650px)' })
//     const displayAddress = (address:string) =>{
//         if(isTabletOrMobile){
//             return address.slice(0, 6) + "..." + address.slice(address.length - 4, address.length);
//         }
//         else {
//             return address;
//         }
//     }
//     const addresses = useAppSelector(addressesToSend)
//     const dispatch = useAppDispatch()
//     return (
//         <div className="mb-2">
//             <h3 className="mb-1">List of recipients</h3>
//             <div className="flex flex-col bg-whiterounded-md bg-white rounded-md  overflow-auto max-h-[300px] w-auto">
//                 <div className="flex justify-between p-2 border-b-2 hover:bg-gray-50 rounded-md">
//                 <span>Address</span>
//                     <span className="sm:p-0 text-gray-600 text-md">Ammount</span>
//                     <span className="sm:p-0 text-gray-600 text-md">Action</span>
//                 </div>
                   
//                 {
//                     addresses.map((asset: any, index: number) => {
//                         return <div key={index} className="flex justify-between p-2 border-b-2 hover:bg-gray-50 rounded-md">
//                             <span className="text-md">{displayAddress(asset.address)}</span> <span>{asset.amount}</span> <span className="cursor-pointer text-gray-700" onClick={() => { dispatch(removeSingleAddress(asset)) }}>Remove</span>
//                         </div>
//                     })
//                 }
//             </div>

//         </div>
//     )
// }
// export default ListOfRecipients;
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { removeSingleAddress, addressesToSend } from "../../../store/multiDeposit/multiDepositSlice";
import { useMediaQuery } from 'react-responsive';

const ListOfRecipients = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 650px)' });

  const displayAddress = (address: string) =>
    isTabletOrMobile ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;

  const addresses = useAppSelector(addressesToSend);
  const dispatch = useAppDispatch();

  return (
    <div className="mb-2">
      <h3 className="mb-1">List of recipients</h3>

      <div className="flex flex-col bg-whiterounded-md bg-white rounded-md overflow-auto max-h-[300px] w-auto">
        <div className="flex justify-between p-2 border-b-2 hover:bg-gray-50 rounded-md">
          <span>Address</span>
          <span className="sm:p-0 text-gray-600 text-md">Amount</span>
          <span className="sm:p-0 text-gray-600 text-md">Action</span>
        </div>

        {addresses.map((asset: any, index: number) => (
          <div key={index} className="flex justify-between p-2 border-b-2 hover:bg-gray-50 rounded-md">
            <span className="text-md">{displayAddress(asset.address)}</span>
            <span>{asset.amount}</span>
            <span className="cursor-pointer text-gray-700" onClick={() => dispatch(removeSingleAddress(asset))}>Remove</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListOfRecipients;