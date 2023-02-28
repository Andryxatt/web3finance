import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import { useNetwork } from "wagmi";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getNetworkPriority, networkSpeedsArray, setSelectedPriority,  updateSpeedSelected } from "../../../store/multiDeposit/multiDepositSlice";
const GasFeeEstimator = (props: any) => {
  const speeds = useAppSelector(networkSpeedsArray);
  const dispatch = useAppDispatch();
  const { chain } = useNetwork();
  const historicalBlocks = 20;
  const [selectedSpeed, setSelectedSpeed] = useState("Average");
  const [subscribed, setSubscribed] = useState(false);

  async function feeCalculate() {
    let provider;
    switch (chain.id) {
      case 5:
        provider = new Web3.providers.HttpProvider("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
        break;
      case 80001: {
        provider = new Web3.providers.HttpProvider("https://polygon-mumbai.g.alchemy.com/v2/kUD0CYUsUShpNT0qf8rQVu6vtUXMm0mo");
        break;
      }
      case 97: {
        provider = new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
        break;
      }
    }
    const web3 = new Web3(provider);
    web3.eth.getFeeHistory(historicalBlocks, "pending", [15, 55, 85]).then((feeHistory) => {
      const blocks = formatFeeHistory(feeHistory, false);

      const slow = avg(blocks.map(b => b.priorityFeePerGas[0]));
      const average = avg(blocks.map(b => b.priorityFeePerGas[1]));
      const fast = avg(blocks.map(b => b.priorityFeePerGas[2]));
      web3.eth.getBlock("pending").then((block) => {
        const baseFee = Number(block.baseFeePerGas);
        let speeds = [ {
          "speedName": "Low",
          "maxPriorityFeePerGas": slow,
          "baseFeePerGas": baseFee,
          "baseFeeFloat": parseFloat(ethers.utils.formatUnits(baseFee, 'gwei')).toFixed(2),
          "maxPriorityFeePerGasFloat": parseFloat(ethers.utils.formatUnits(slow, 'gwei')).toFixed(2),
          "maxFeePerGas": slow + baseFee,
          "maxFeePerGasFloat": parseFloat(ethers.utils.formatUnits(slow + baseFee, 'gwei')).toFixed(2),
          "selected": false
        },
        {
          "speedName": "Average",
          "maxPriorityFeePerGas": average,
          "baseFeePerGas": baseFee,
          "baseFeeFloat": parseFloat(ethers.utils.formatUnits(baseFee, 'gwei')).toFixed(2),
          "maxPriorityFeePerGasFloat": parseFloat(ethers.utils.formatUnits(average, 'gwei')).toFixed(2),
          "maxFeePerGas": average + baseFee,
          "maxFeePerGasFloat": parseFloat(ethers.utils.formatUnits(average + baseFee, 'gwei')).toFixed(2),
          "selected": false
        },
        {
          "speedName": "High",
          "maxPriorityFeePerGas": fast,
          "baseFeePerGas": baseFee,
          "baseFeeFloat": parseFloat(ethers.utils.formatUnits(baseFee, 'gwei')).toFixed(2),
          "maxPriorityFeePerGasFloat": parseFloat(ethers.utils.formatUnits(fast, 'gwei')).toFixed(2),
          "maxFeePerGas": fast + baseFee,
          "maxFeePerGasFloat": parseFloat(ethers.utils.formatUnits(baseFee + fast, 'gwei')).toFixed(2),
          "selected": false
        }];
        if(setSelectedSpeed === undefined){
           //update speeds array with selected speed as true and others as false 
          speeds = speeds.map((speed, index) => {
            if(index === 1){
              return {...speed, selected: true}
            }else {
              return {...speed, selected: false}
            }
          })
        }
        else {
          speeds = speeds.map((speed, index) => {
            if(selectedSpeed === speed.speedName){
              dispatch(setSelectedPriority(speed))
              return {...speed, selected: true}
             
            }else {
              return {...speed, selected: false}
            }
          })
        }
        dispatch(getNetworkPriority(speeds))
      });
    });
  }
  function avg(arr) {
    const sum = arr.reduce((a, v) => a + v);
    return Math.round(sum / arr.length);
  }

  function formatFeeHistory(result, includePending) {
    let blockNum = result.oldestBlock;
    let index = 0;
    const blocks = [];
    while (blockNum < result.oldestBlock + historicalBlocks - 1) {
      blocks.push({
        number: blockNum,
        baseFeePerGas: Number(result.baseFeePerGas[index]),
        gasUsedRatio: Number(result.gasUsedRatio[index]),
        priorityFeePerGas: result.reward[index].map((x: number) => Number(x)),
      });
      blockNum += 1;
      index += 1;
    }
    if (includePending) {
      blocks.push({
        number: "pending",
        baseFeePerGas: Number(result.baseFeePerGas[historicalBlocks]),
        gasUsedRatio: NaN,
        priorityFeePerGas: [],
      });
    }
    return blocks;
  }

  useEffect(() => {
    const speeds = [
      {
        "speedName": "Slow",
        "maxPriorityFeePerGas": 5,
        "baseFeePerGas": 0,
        "baseFeeFloat": "0",
        "maxPriorityFeePerGasFloat": "5",
        "maxFeePerGas": 5,
        "maxFeePerGasFloat": "5",
        "selected": false
      },
      {
      "speedName": "Average",
      "maxPriorityFeePerGas": 5,
      "baseFeePerGas": 0,
      "baseFeeFloat": "0",
      "maxPriorityFeePerGasFloat": "5",
      "maxFeePerGas": 5,
      "maxFeePerGasFloat": "5",
      "selected": true
    },
    {
      "speedName": "Fast",
      "maxPriorityFeePerGas": 5,
      "baseFeePerGas": 0,
      "baseFeeFloat": "0",
      "maxPriorityFeePerGasFloat": "5",
      "maxFeePerGas": 5,
      "maxFeePerGasFloat": "5",
      "selected": false
    },
   
  ]
    if (chain.id === 97) {
      dispatch(getNetworkPriority(speeds))
      dispatch(setSelectedPriority(speeds[1]));
    }
    else {
      feeCalculate();
      const web3 = new Web3(Web3.givenProvider);
      var subscription = web3.eth.subscribe('newBlockHeaders', function (error, result) {
        if (!error)
          {
          setSubscribed(true)
          feeCalculate()
        }
      })
      // if(!subscribed){
      //   subscription.unsubscribe(function (error, success) {
      //     if (success)
      //       console.log('Successfully unsubscribed!');
      //   });
      // }
      return () => {
        subscription.unsubscribe(function (error, success) {
          if (success)
            console.log('Successfully unsubscribed!');
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscribed])

const selectPriority =async (e: any) => {
  setSelectedSpeed(e.speedName);
  dispatch(updateSpeedSelected(e.speedName));
}
  return (
    <div className="w-full">
      <div>Network Speed  Gwei </div>

      <div>
        <div className="flex justify-between">

          {
           speeds && speeds.map((speed: any, index: number) => {
              return (
                <div className={`${speed.speedName === selectedSpeed ? "bg-slate-400":"bg-white" } flex items-center flex-col cursor-pointer border-2 p-2  shadow-md`} onClick={() => selectPriority(speed)} key={index}>
                  <span>{speed.speedName}</span>
                  <div><span className={`
                  ${speed.speedName === "Low" ? " text-green-500" :
                  speed.speedName === "Average" ? "text-yellow-500" : "text-red-500"
                   }`}>{
                    (parseFloat(speed.baseFeeFloat) + parseFloat(speed.maxPriorityFeePerGasFloat)).toFixed(1)
                    
                    } </span><span>gwei</span></div>
                  <span>base: {parseFloat(speed.baseFeeFloat).toFixed(1)} | Priority: { parseFloat(speed.maxPriorityFeePerGasFloat).toFixed(1)}</span>
                  <span>price</span>
                 
                </div>
              )
            })
          }
        </div>
      </div>

    </div>
  )
}
export default GasFeeEstimator;