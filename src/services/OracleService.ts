
import {Contract , ethers } from "ethers"
class OrderService {
    contract;
    constructor(provider:any, abi:any, address:string){
        this.contract = new Contract(address, abi, provider)
    }
    showContract (){
        console.log(this.contract);
    }
}
export default OrderService;