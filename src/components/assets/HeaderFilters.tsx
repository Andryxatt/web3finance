import {  useState } from "react";
import searchIcon from "../../images/search.png";
import { useAppDispatch } from "../../store/hooks";
import {filterByName,
    filterTokens} from "../../store/token/tokenSlice";
const HeaderFilters = () => {
    const [filters, setFilters] = useState([
        {
            name: "All",
            isSelected: true
        },
        {
            name: "Stablecoins",
            isSelected: false
        },
        {
            name: "Deposited",
            isSelected: false
        },
        {
            name: "Inactive",
            isSelected: false
        }
    ]);
    const dispatch = useAppDispatch();
    const updateFilter= (button: any) => {
        const newState = filters.map((obj:any) => {
            if (obj.name === button.name) {
                dispatch(filterTokens({filter:button.name}));
                return { ...obj, isSelected: true };
            }
            else {
                return { ...obj, isSelected: false };
            }
        });
        setFilters(newState);
       
    };
    const searchToken = (e: any) => {
        dispatch(filterByName({searchField:e.target.value}));
    }
    
    
    return (

        <div className="flex justify-start md:justify-center flex-wrap items-center mt-3 mb-3 px-5">

           
            {
                filters.map((button, index) => {
                    return (
                        button.isSelected ?
                            <button key={index} className="min-w-[50px] h-[50px] border-2 rounded-xl px-2 md:mb-2 mr-5 border-orange-400 bg-yellow-200">{button.name}</button> :
                            <button key={index} onClick={() => updateFilter(button)} className="min-w-[50px] md:mb-2 px-2 h-[50px] mr-5 border-2 rounded-xl border-gray-400 bg-white">{button.name}</button>
                    )
                })
            }
              <div className="flex flex-col md:mr-3 relative ml-auto">
                    <img src={searchIcon} className="absolute left-2 top-1 w-[35px]" alt="icon" />
                    <input className="rounded-full pl-[50px] text-lg py-[6px] border-2 border-gray-400 focus:outline-none" onChange={searchToken} placeholder="Search" />
                    {/* <label onChange={()=>setIsDeposited(!isDeposited)} htmlFor="default-toggle" className="inline-flex relative items-center cursor-pointer mt-3">
                        <input type="checkbox" value="" id="default-toggle" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-bold text-gray-900 dark:text-gray-300">Deposited only</span>
                    </label> */}
                </div>
        </div>
    )
}

export default HeaderFilters