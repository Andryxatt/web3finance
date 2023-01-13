import { useState } from "react";


const HeaderFilters = () => {
    const [filters, setFilters] = useState([
        {
            name: "All",
            isSelected: true
        },
        {
            name: "Token Price",
            isSelected: false
        },
        {
            name: "Some Filter 2",
            isSelected: false
        },
        {
            name: "Some Filter 3",
            isSelected: false
        },
        {
            name: "Some Filter 4",
            isSelected: false
        },
        {
            name: "Some Filter 5",
            isSelected: false
        }
    ]);
    const updateFilter= (button: any) => {
        const newState = filters.map((obj:any) => {
            if (obj.name === button.name) {
                return { ...obj, isSelected: true };
            }
            else {
                return { ...obj, isSelected: false };
            }
        });
        setFilters(newState);
    };
    return (

        <div className="flex justify-between md:justify-center flex-wrap items-center mt-3 mb-3 px-3">
            {
                filters.map((button, index) => {
                    return (
                        button.isSelected ?
                            <button key={index} className="min-w-[50px] px-2 h-[50px] mr-5 border-2 rounded-xl md:mb-2 border-orange-400 bg-yellow-200">{button.name}</button> :
                            <button key={index} onClick={() => updateFilter(button)} className="min-w-[50px] md:mb-2 px-2 h-[50px] mr-5 border-2 rounded-xl border-gray-400 bg-white">{button.name}</button>
                    )
                })
            }
        </div>
    )
}

export default HeaderFilters