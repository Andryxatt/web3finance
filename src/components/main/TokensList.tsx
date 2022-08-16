import { useWeb3React } from "@web3-react/core";
import { Contract, ethers } from "ethers";
import { useEffect } from "react";


const TokensList = (props: any) => {
    const contractsAddresses = require("../../contracts/AddressesContracts.json");
    const FeeShareAbi = require("../../contracts/FeeShare.json");
    const RTokenAbi = require("../../contracts/RTokenAbi.json");
    const OracleAbi = require("../../contracts/oracle/Oracle.json");
    const { library, active, account, connector } = useWeb3React();

    useEffect(() => {
        if (active) {
            props.tokens.map(async (token: any) => {
                const contractOracle = new Contract(contractsAddresses.oracle, OracleAbi, library?.getSigner())
                await contractOracle.getAssetPrice(token.address).then((res: any) => {
                    token.tokenPrice = ethers.utils.formatUnits(res._hex, 8)
                });
                let contract = new Contract(contractsAddresses["r" + token.name], RTokenAbi, library?.getSigner());
                await contract.totalSupply().then((res: any) => {
                    token.deposits = ethers.utils.formatUnits(res._hex, token.decimal);
                });
                contract.balanceOf(account).then((res: any) => {
                    token.userBalance = ethers.utils.formatUnits(res._hex, token.decimal);
                });
            })
        }
    }, [active])
    return (
        <>
            Tokens
        </>
    )
}
export default TokensList;