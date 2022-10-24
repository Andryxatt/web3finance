import sortUpIcon from '../../images/sort-up.png';
import sortDownIcon from '../../images/sort-down.png';
import EditorAddresses from '../assets/EditorAddresses';
import AnimatedDots from '../AnimatedDots';
const Row = (props: any) => {

    return (
        <div className={
            (props.element.isOpen ?
                " bg-blue-100 rounded-lg" :
                " hover:bg-blue-100 hover:rounded-lg cursor-pointer")
            + " mx-2 my-1 py-1"
        }>
            <div className="cursor-pointer items-center  mx-2 my-1 py-3 rounded-xl justify-between flex flex-row hover:bg-blue-100" onClick={(e) => { props.openElement(props.element.name); e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); }}>
                <div className='flex justify-center items-center font-lg w-[150px]'>
                    <button className=''>
                        <img alt="img"
                            className={`${props.element.isOpen ? "bg-orange-600" : ""} w-[17px] h-[17px] mr-2 hover:bg-orange-600 rounded`}
                            src={props.element.isOpen ? sortUpIcon : sortDownIcon} />
                    </button>
                    {props.element.icon}
                    {props.element.name}
                </div>
                <div className='flex justify-center font-lg w-[150px]'>
                    {props.element.tokenPrice === "0" ? <AnimatedDots/> : props.element.tokenPrice}
                </div>
                <div className='flex justify-center font-lg w-[150px]'>
                   {props.element.deposits === "0" ? <AnimatedDots/> : props.element.deposits}
                </div>
                <div className='flex justify-center font-lg w-[150px]'>
                    {props.element.userBalance === "0" ? <AnimatedDots/> : props.element.userBalance}
                </div>
            </div>
            <div className={props.element.isOpen ? "isopen mr-3 ml-3 mt-2 bg-blue-200 rounded-md px-5 py-5 mb-5 flex" : "hidden isopen"}>
              <EditorAddresses token={props.element} isNative={props.element.isNative}/> 
            </div>

        </div>
    )
}
export default Row;