
const ExampleManual = (props: any) => {
    return (
    <div className="relative bg-white p-[15px] text-[#00174b] rounded-md bg-[#dbeeff]">
    <button onClick={props.close} type="button" className="absolute right-[15px] bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
    <h2 className="font-bold">Examples</h2>
    <div className="p-[15px] bg-[#fff] mt-5">
        <span className="bg-[#dbeeff] mb-3 py-1 mb-2">for ERC20 or GoETH(address, ammount)</span>
        <p>0xa0Ee7A142d267C1f36714E4a8F75612F20a79720,0.001</p>
        <p>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,0.01</p>
        <p>0x5E8aC7D1BC6214e4CF2bE9dA175b9b9Ec1B94102,0.2</p>
    </div>
    <span>Separated by commas </span>
</div>)
}
export default ExampleManual;

