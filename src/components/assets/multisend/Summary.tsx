import { Web3State } from "../../../Web3DataContext";

const Summary = () =>{
    const { addressesFromFile } = Web3State();
    return (
        <div>
                <h3>Summary</h3>
                <div className="bg-white flex flex-row w-full rounded-md">
                    <div className="flex flex-col w-full">
                        <div className="px-3 py-3 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">{addressesFromFile.length}</span>
                            <span className="text-xs text-gray-400">Total number of addresses </span>
                        </div>
                        <div className="px-3 py-3 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">
                                3
                            </span>
                            <span className="text-xs text-gray-400">Total number of transactions needed </span>
                        </div>
                        <div className="px-3 py-3 flex flex-col">
                            <span className="text-xl text-blue-900 font-bold">
                               3

                            </span>
                            <span className="text-xs text-gray-400">Approximate cost of operation </span>
                        </div>
                    </div>
                    <div className="flex flex-col border-l-2 w-full">
                        <div className="px-3 py-3 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">
                               3
                            </span>
                            <span className="text-xs text-gray-400">Total number of tokens to be sent </span>
                        </div>
                        <div className="px-3 py-3 flex flex-col border-b-2">
                            <span className="text-xl text-blue-900 font-bold">
                         3
                            </span>

                            <span className={" text-xs text-gray-400"}>
                            Your token balance
                            </span>
                        </div>
                        <div className="px-3 py-3 flex flex-col">
                            <span className="text-xl text-blue-900 font-bold">
                               3
                            </span>
                            <span className="text-xs text-gray-400"> 
                            Your ETH balance
                            </span>
                        </div>
                    </div>
                </div>
                {/* {parseFloat(userBalanceToken) < 0 ? <div className="border-red-600 rounded-lg bg-white mt-3 text-red-500 px-5 py-5">
                    Insufficient ether balance on your account
                </div> : ""} */}

            </div>
    )
}
export default Summary;
