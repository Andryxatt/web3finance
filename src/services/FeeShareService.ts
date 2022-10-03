import { Contract } from "ethers";

class FeeShareService {
    contract:Contract;
    constructor(provider:any, abi:any, address:string){
        this.contract = new Contract(address, abi, provider)
    }
    showContract (){
        console.log(this.contract, "FeeShareService");
    }
    async calculateFee(tokenAddress:string, amount:number){
        const fee = await this.contract.calculateFee(tokenAddress, amount);
        return fee;
    }
}
export default FeeShareService;