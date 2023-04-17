// import { currentNetwork } from "../../store/network/networkSlice";
// import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import EditorAddressesToken from '../assets/EditorAddressesToken';

const RowToken = (props: any) => {
    // const dispatch = useAppDispatch();
    // const network = useAppSelector(currentNetwork)
    const { isConnected } = useAccount()
    useEffect(() => {
        return () => {
            props.handleOpen(!props.isOpen)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <div className={
            (props.isOpen ?
                " bg-blue-100 rounded-lg" :
                " hover:bg-blue-100 hover:rounded-xl cursor-pointer")
            + " mx-2 my-1 py-1 mb-3"
        }>
            <div
                className="cursor-pointer items-center  mx-2 my-1 py-3 rounded-xl justify-between flex flex-row hover:bg-blue-100"
                onClick={(e) => {
                    if (isConnected)
                        props.handleOpen(!props.isOpen)
                }}
            >
                <div className='flex justify-left items-center pl-[25px] sm:mr-1 sm:pl-0 font-lg w-[25%] sm:w-auto'>
                    <button className={`${ props.isOpen === true ? "bg-arrowUp" : "bg-arrowDown"} w-[15px] h-[15px] mr-2 bg-[length:15px_15px] rounded `}>
                    </button>
                    {/* <img className='w-[35px] h-[35px]' src={require(`../../images/icons/${props.token.name}.png`)} alt={props.token.name} /> */}
                   <span className='pl-2'>Your token</span> 
                </div>
           
            </div>
            <div className={props.isOpen ? "isopen mr-3 ml-3 mt-2 bg-blue-200 rounded-md px-5 py-5 mb-5 flex" : "hidden isopen"}>
                <EditorAddressesToken isOpen={props.isOpen} />
            </div>
        </div>
    )
}
export default RowToken;