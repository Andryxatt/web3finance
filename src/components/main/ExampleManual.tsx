import { useEffect, useState } from "react";

const ExampleManual = (props: any) => {
    const [showExampleManual, setShowExampleManual] = useState<boolean>(false);
    console.log(props)
    useEffect(() => {
        if (props.showExampleManual) {
            setShowExampleManual(true);
        }
    }, [props.showExampleManual]);
    return (<div className={props.hidden === true ? "absolute bg-white right-20" : "hidden"}>
    <h2>Examples</h2>
    <div>
        <span>for ERC20 or GoETH(address, ammount)</span>
        <p>0xa0Ee7A142d267C1f36714E4a8F75612F20a79720,0.001</p>
        <p>0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266,0.01</p>
        <p>0x5E8aC7D1BC6214e4CF2bE9dA175b9b9Ec1B94102,0.2</p>
    </div>
    <span>Separated by commas </span>
</div>)
}
export default ExampleManual;

