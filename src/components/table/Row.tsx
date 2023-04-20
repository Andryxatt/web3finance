import AnimatedDots from '../AnimatedDots';
import { openElement } from '../../store/token/tokenSlice';
import { currentNetwork } from "../../store/network/networkSlice";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useAccount,  useNetwork } from 'wagmi';
import Editors from '../assets/Editors';
import PreviewResult from '../assets/PreviewResult';
import { useEffect, useState } from 'react';

const Row = (props: any) => {
    const dispatch = useAppDispatch();
    const network = useAppSelector(currentNetwork)
    const { isConnected } = useAccount()
    const {chain} = useNetwork()
    const [isNativeFee, setIsNativeFee] = useState(false);
    const [isPreview, setIsPreview] = useState(true);
    const toogleNativeFee = () => {
        setIsNativeFee(!isNativeFee);
    }
    const showPreview = () => {
        setIsPreview(!isPreview);
    }
    useEffect(() => {
        if (props.token.isOpen && props.tokenRowIsOpen) {
            props.handleOpen()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.token.isOpen])
    return (
        <div className={
            (props.token.isOpen ?
                " bg-blue-100 rounded-lg" :
                " hover:bg-blue-100 hover:rounded-xl cursor-pointer")
            + " mx-2 my-1 py-1 mb-3"
        }>
            <div
                className="cursor-pointer items-center  mx-2 my-1 py-3 rounded-xl justify-between flex flex-row hover:bg-blue-100"
                onClick={(e) => {
                    if (isConnected && chain.id === network.id)
                        dispatch(openElement({ chainId: network.id, name: props.token.name }))
                }}
            >
                <div className='flex justify-left items-center pl-[25px] sm:mr-1 sm:pl-0 font-lg w-[25%] sm:w-auto'>
                    <button className={`${ props.token.isOpen === true ? "bg-arrowUp" : "bg-arrowDown"} w-[15px] h-[15px] mr-2 bg-[length:15px_15px] rounded `}>
                     
                    </button>
                    <img className='w-[35px] h-[35px]' src={require(`../../images/icons/${props.token.name}.png`)} alt={props.token.name} />
                   <span className='pl-2'>{props.token.name}</span> 
                </div>
                <div className='flex justify-center font-lg sm:mr-3 w-[25%] sm:w-auto'>
                    {props.token.tokenPrice === "0" ? <AnimatedDots /> : parseFloat(props.token.tokenPrice).toFixed(2)}
                </div>
                <div className='flex justify-center font-lg sm:mr-3 w-[25%] sm:w-auto'>
                    {props.token.isNative ? "" : props.token.deposits === "0" ? <AnimatedDots /> : parseFloat(props.token.deposits).toFixed(2)}
                </div>
                <div className='flex justify-end pr-[35px] sm:pr-0 font-lg sm:mr-3 w-[25%] sm:w-auto'>
                    {props.token.isNative ? "" : props.token.userBalanceDeposit === "0" ? <AnimatedDots /> : parseFloat(props.token.userBalanceDeposit).toFixed(2)}
                </div>
            </div>
            <div className={props.token.isOpen ? "isopen mr-3 ml-3 mt-2 bg-blue-200 rounded-md px-5 py-5 mb-5 flex flex-col" : "hidden isopen"}>
                {/* <EditorAddresses token={props.token} isNative={props.token.isNative} /> */}
               
                
                {
                   isPreview ?
                            <>
                            <Editors token={props.token} isNativeFee={isNativeFee} handleNativeFee={toogleNativeFee}/>
                            <button className="bg-blue-500 max-w-[200px] text-white font-bold px-3 py-1 sm:mt-2 sm:mb-2 rounded-md" onClick={showPreview}>Next</button>
                            </>
                            
                       
                 :
                        <PreviewResult isNativeFee={isNativeFee} token={props.token} isNative={props.token.isNative} showPrev={showPreview} />
                }
              
            </div>
            
        </div>
    )
}
export default Row;