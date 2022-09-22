
const ExampleManual = (props: any) => {

    return (<div className={props.hidden === true ? "flex" : "hidden"}>
    <h2>Examples</h2>
    <div>
        <span>for ERC20 or GoETH(address, ammount)</span>
        <p>0x3df332e44a0bbff025838c187873d77f92caf5e9,0.001</p>
        <p>0x76d31966abf3edeb29e599eac4adcb72fba85e6a,1</p>
        <p>0xC8c30Fa803833dD1Fd6DBCDd91Ed0b301EFf87cF,3.45</p>
    </div>
    <span>Separated by commas </span>
</div>)
}
export default ExampleManual;

