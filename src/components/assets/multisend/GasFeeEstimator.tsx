// import { ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
// import { useProvider } from "wagmi";
// import { useAppSelector } from "../../../store/hooks"
// import { currentNetwork } from "../../../store/network/networkSlice"
// import axios from "axios";
// import Web3 from 'web3';

const GasFeeEstimator = () => {
    // const network = useAppSelector(currentNetwork);
    const [speedNetwork, setSpeedNetwork] = useState(0);
    // const [average, setAverage] = useState(0);
    // const historicalBlocks = 10;
    // const  provider  = useProvider();
    // function avg(arr) {
    //     const sum = arr.reduce((a, v) => a + v);
    //     return Math.round(sum/arr.length);
    //   }
    //   function formatFeeHistory(result, includePending) {
    //     let blockNum = result.oldestBlock;
    //     let index = 0;
    //     const blocks = [];
    //     while (blockNum < result.oldestBlock + historicalBlocks) {
    //         console.log(result, "result");
    //       blocks.push({
    //         number: blockNum,
    //         baseFeePerGas: Number(result.baseFeePerGas[index]),
    //         gasUsedRatio: Number(result.gasUsedRatio[index]),
    //         priorityFeePerGas: result.reward[index].map(x => Number(x)),
    //       });
    //       blockNum += 1;
    //       index += 1;
    //     }
    //     if (includePending) {
    //       blocks.push({
    //         number: "pending",
    //         baseFeePerGas: Number(result.baseFeePerGas[historicalBlocks]),
    //         gasUsedRatio: NaN,
    //         priorityFeePerGas: [],
    //       });
    //     }
    //     return blocks;
    //   }
    // const getFeePriority = async () => {
    //     switch (network.id) {
    //         case 5:{
    //             const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY));
    //               web3.eth.getFeeHistory(historicalBlocks, "pending", [1, 50, 99]).then((feeHistory) => {
    //                 const blocks = formatFeeHistory(feeHistory, false);
                  
    //                 const slow    = avg(blocks.map(b => b.priorityFeePerGas[0]));
    //                 const average = avg(blocks.map(b => b.priorityFeePerGas[1]));
    //                 const fast    = avg(blocks.map(b => b.priorityFeePerGas[2]));
                  
    //                 web3.eth.getBlock("pending").then((block) => {
    //                   const baseFeePerGas = Number(block.baseFeePerGas);
    //                   console.log("Manual estimate:", {
    //                     slow: slow,
    //                     average: average,
    //                     fast:fast,
    //                   });
    //                 });
    //               });
    //             break;
    //         }
    //         case 97:{
               
    //             // const provider = new Js();
    //             const web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-2-s3.binance.org:8545'));
    //             web3.eth.getFeeHistory(historicalBlocks, "pending", [25, 50, 75]).then(console.log);
    //             break;
    //         }
    //         case 80001: {
    //             // const provider = new ethers.providers.JsonRpcProvider();
    //             const web3 = new Web3(new Web3.providers.HttpProvider('https://polygon-mumbai.g.alchemy.com/v2/' + process.env.REACT_APP_MUMBAI_KEY));
    //             web3.eth.getFeeHistory(historicalBlocks, "pending", [25, 50, 75]).then(console.log);
    //             break;
    //         }
    //     }
       
        
      
    // }
    const inputRef = useRef(null);
    useEffect(() => {
        // axios.get(`https://api.owlracle.info/v3/goerli/gas?apikey=3647189fda5b45d59d261b98cd8f4ca0`)
        // .then(res => {
        //   console.log(res.data, "res");
        // })
    }, []);
    // useEffect(() => {
    //         // setSpeedNetwork(average);
    //         // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[average])
    return (
        <div className="w-full">
        <ToastContainer autoClose={2000} />
        <div>Network Speed {speedNetwork} Gwei </div>
        <input ref={inputRef} className="w-full" type="range" onChange={(e) => { setSpeedNetwork(inputRef.current.value) }} defaultValue={0} min={0} step={0.1} max={5}></input>
        <div className="flex justify-between">
            <span className="cursor-pointer">Slow</span>
            <span className="cursor-pointer">Awerege</span>
            <span className="cursor-pointer">Instant</span>
        </div>
    </div>
    )
}
export default GasFeeEstimator;