import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3";
import { useNetwork } from "wagmi";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
// import {nativeBalance} from "../../../store/token/tokenSlice";
import { getNetworkPriority, networkSpeedsArray, setSelectedPriority, updateSpeedSelected } from "../../../store/multiDeposit/multiDepositSlice";
const GasFeeEstimator = (props: any) => {
  const speeds = useAppSelector(networkSpeedsArray);
  const dispatch = useAppDispatch();
  // const nativeTokenPrice = useAppSelector(nativeBalance);
  const { chain } = useNetwork();
  const [selectedSpeed, setSelectedSpeed] = useState("Average");
  const historicalBlocks = 20;
  const infuraApiKey = process.env.REACT_APP_INFURA_KEY;
  const providerUrls = {
    1: `https://mainnet.infura.io/v3/${infuraApiKey}`,
    // 5: `https://goerli.infura.io/v3/${infuraApiKey}`,
    10: `https://optimism-mainnet.infura.io/${infuraApiKey}`,
    56: "https://bsc-dataseed.binance.org/",
    97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    137: "https://rpc-mainnet.maticvigil.com/",
    // 80001: `https://polygon-mumbai.infura.io/v3/${infuraApiKey}`,
    42161: `https://arbitrum-mainnet.infura.io/v3/${infuraApiKey}`,
    43114: `https://avalanche-mainnet.infura.io/v3/${infuraApiKey}`
  };
  const getProviderUrl = chainId => {
    return providerUrls[chainId] || providerUrls[5];
  };
  async function feeCalculate() {
    const provider = new Web3.providers.HttpProvider(getProviderUrl(chain.id));
    const web3 = new Web3(provider);
    web3.eth.getFeeHistory(historicalBlocks, "pending", [15, 55, 85]).then((feeHistory) => {
      const blocks = formatFeeHistory(feeHistory, false);

      const slow = avg(blocks.map(b => b.priorityFeePerGas[0]));
      const average = avg(blocks.map(b => b.priorityFeePerGas[1]));
      const fast = avg(blocks.map(b => b.priorityFeePerGas[2]));
      web3.eth.getBlock("pending").then((block) => {
        const baseFee = Number(block.baseFeePerGas);
        let speeds = [{
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
        if (setSelectedSpeed === undefined) {
          speeds = speeds.map((speed, index) => {
            if (index === 1) {
              return { ...speed, selected: true }
            } else {
              return { ...speed, selected: false }
            }
          })
        }
        else {
          speeds = speeds.map((speed, index) => {
            if (selectedSpeed === speed.speedName) {
              dispatch(setSelectedPriority(speed))
              return { ...speed, selected: true }
            } else {
              return { ...speed, selected: false }
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
  // const claculatePriceSpeed = (maxFeePerGasFloat) => {
  //   const price = parseFloat(ethers.utils.formatUnits(maxFeePerGasFloat.toString(),'gwei')) * parseFloat(nativeTokenPrice[0].tokenPrice)
  //  return price
  // }
  useEffect(() => {
    const speeds = [
      {
        "speedName": "Low",
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
    const speedsOptimism = [
      {
        "speedName": "Low",
        "maxPriorityFeePerGas": 0.1,
        "baseFeePerGas": 0,
        "baseFeeFloat": "0",
        "maxPriorityFeePerGasFloat": "0.1",
        "maxFeePerGas": 0.1,
        "maxFeePerGasFloat": "0.1",
        "selected": false
      },
      {
        "speedName": "Average",
        "maxPriorityFeePerGas": 0.2,
        "baseFeePerGas": 0,
        "baseFeeFloat": "0",
        "maxPriorityFeePerGasFloat": "0.2",
        "maxFeePerGas": 0.2,
        "maxFeePerGasFloat": "0.2",
        "selected": true
      },
      {
        "speedName": "Fast",
        "maxPriorityFeePerGas": 0.3,
        "baseFeePerGas": 0,
        "baseFeeFloat": "0",
        "maxPriorityFeePerGasFloat": "0.3",
        "maxFeePerGas": 0.3,
        "maxFeePerGasFloat": "0.3",
        "selected": false
      },

    ]
    if (chain.id === 97 || chain.id === 56) {
      dispatch(getNetworkPriority(speeds))
      dispatch(setSelectedPriority(speeds[1]));
    }
    else if (chain.id === 10) {
      dispatch(getNetworkPriority(speedsOptimism))
      dispatch(setSelectedPriority(speedsOptimism[1]));
    }
    else {
      console.log('chain', chain)
      feeCalculate();
      const web3 = new Web3(Web3.givenProvider);
      var subscription = web3.eth.subscribe('newBlockHeaders', function (error, result) {
        if (error) {
   
          console.error(error);
        } else {
          console.log('Successfully subscribed!');
          console.log(result);
          feeCalculate();
        }
      })
      return () => {
         subscription.unsubscribe(function (error, success) {
           if (success)
             console.log('Successfully unsubscribed!');
         });
      }
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
 
  const selectPriority = async (e: any) => {
    setSelectedSpeed(e.speedName);
    dispatch(updateSpeedSelected(e.speedName));
  }
  const Emoji = props => (
    <span
      className="emoji"
      role="img"
      aria-label={props.label ? props.label : ""}
      aria-hidden={props.label ? "false" : "true"}
    >
      {props.symbol}
    </span>
  )
  return (
    <div className="w-full mb-2 mt-2">
      <div className="mb-1">Network Speed  Gwei </div>
      <div>
        <div className="flex justify-between sm:flex-col">
          {
            speeds && speeds.map((speed: any, index: number) => {
              return (
                <div className={`${speed.speedName === selectedSpeed ? "bg-slate-400" : "bg-white"} flex items-center flex-col cursor-pointer border-2 p-2 w-auto px-10 shadow-md`} onClick={() => selectPriority(speed)} key={index}>
                  <span>
                    {speed.speedName === "Low" ? <Emoji symbol="🐢" label="slow" /> : speed.speedName === "Average" ? <Emoji symbol="🐇" label="average" /> : <Emoji symbol="🚀" label="fast" />}
                  </span>
                  <div><span className={`
                  ${speed.speedName === "Low" ? " text-green-500" :
                      speed.speedName === "Average" ? "text-yellow-500" : "text-red-500"
                    } text-lg`}>{
                      (parseFloat(speed.baseFeeFloat) + parseFloat(speed.maxPriorityFeePerGasFloat)).toFixed(1)
                    } </span><span>gwei</span></div>
                  <div className="flex flex-col sm:flex-col items-center">
                    <span>base: {parseFloat(speed.baseFeeFloat).toFixed(1)}</span>
                    <span>Priority:{parseFloat(speed.maxPriorityFeePerGasFloat).toFixed(1)}</span>
                    {/* <span>Price:{claculatePriceSpeed(speed.maxFeePerGasFloat).toFixed(6)} $</span> */}
                  </div>
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