import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ExampleFiles = (props: any) => {
    const [showExampleManual, setShowExampleManual] = useState<boolean>(false);
    console.log(props)
    useEffect(() => {
        if (props.showExampleManual) {
            setShowExampleManual(true);
        }
    }, [props.showExampleManual]);
    return(
    <div className="relative p-[15px] text-[#00174b] rounded-md bg-[#dbeeff]">
    <button onClick={props.close} type="button" className="absolute right-[15px] bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
    <h2 className="font-bold">Examples</h2>
    <div className="p-[15px] bg-[#fff] mt-5">
        <span className="bg-[#dbeeff]  py-1 mb-8">for ERC20 or GoETH(address, ammount)</span>
        <div className="flex flex-row mt-3">
            <Link to="/files/bulksender_example_erc20.xlsx" target="_blank" className="cursor-pointer mr-10 pr-10 hover:underline border-r-2 border-indigo-500">EXEL</Link>
            <Link to="/files/bulksender_example_erc20.csv" target="_blank" className="cursor-pointer mr-10 pr-10 hover:underline border-r-2 border-indigo-500">CSV</Link>
            <Link to="/files/bulksender_example_erc20.txt" target="_blank" className="cursor-pointer hover:underline">TXT</Link>
        </div>
    </div>
    <span>Separated by commas </span>
</div>) 
}
export default ExampleFiles;

