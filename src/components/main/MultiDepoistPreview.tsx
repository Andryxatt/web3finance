const MultiDepoistPreview = (props:any) => {
    return (
        <div>
            <div>
                <div>Network Speed (3.0091963 Gwei) </div>
                <input type="range"></input>
            </div>
            <div>
                <h3>Summary</h3>
                <div>
                    <div>
                        <div>
                            <span>3</span>
                            <span>Total number of addresses </span>
                        </div>
                        <div>
                            <span>0</span>
                            <span>Total number of transactions needed </span>
                        </div>
                        <div>
                            <span>0 RETH </span>
                            <span>Approximate cost of operation </span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <span>4.451 RETH </span>
                            <span>Total number of tokens to be sent </span>
                        </div>
                        <div>
                            <span>3.8730 RETH </span>
                            <span>Your token balance </span>
                        </div>
                        <div>
                            <span>3.8730 RETH </span>
                            <span>Your RETH balance </span>
                        </div>
                    </div>
                </div>
                <div>
                    Insufficient ether balance on your account
                </div>
            </div>
            <div>
                <button onClick={ () => props.changeModalContent(false)}>prev</button>
                <button>Send</button>
            </div>
        </div>
    )

}
export default MultiDepoistPreview;