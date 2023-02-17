import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { ethers } from "ethers";
import Web3 from "web3";
import { useNetwork } from "wagmi";
import {useAppDispatch} from "../../../store/hooks";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
const GasFeeEstimator = (props:any) => {
  const dispatch = useAppDispatch();
  const { chain } = useNetwork();
  const [marks, setMarks] = useState([
   
  ]);
  const [fastSpeed, setGasFeeFast] = useState("0");
  const [averageSpeed, setGasFeeAverage] = useState("0");
  const [slowSpeed, setGasFeeSlow] = useState("0");
  const historicalBlocks = 15;
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
    }
    const web3 = new Web3(provider);
    web3.eth.getFeeHistory(historicalBlocks, "pending", [15, 55, 85]).then((feeHistory) => {
      const blocks = formatFeeHistory(feeHistory, false);

      const slow = avg(blocks.map(b => b.priorityFeePerGas[0]));
      const average = avg(blocks.map(b => b.priorityFeePerGas[1]));
      const fast = avg(blocks.map(b => b.priorityFeePerGas[2]));
      web3.eth.getBlock("pending").then((block) => {
        const baseFee = Number(block.baseFeePerGas);
        console.log(baseFee);
        // dispatch(updateBaseFee(baseFee));
        setGasFeeSlow(parseFloat(ethers.utils.formatUnits(slow, 'gwei')).toFixed(2));
        setGasFeeAverage(parseFloat(ethers.utils.formatUnits(average, 'gwei')).toFixed(2));
        setGasFeeFast(parseFloat(ethers.utils.formatUnits(fast, 'gwei')).toFixed(2));
        setSpeed(parseFloat(ethers.utils.formatUnits(average, 'gwei')))
        setMarks([
          {
            value: parseFloat(ethers.utils.formatUnits(slow, 'gwei')),
            label: 'slow',
          },
          {
            value: parseFloat(ethers.utils.formatUnits(average, 'gwei')),
            label: 'average',
          },
          {
            value: parseFloat(ethers.utils.formatUnits(fast, 'gwei')),
            label: 'fast',
          }
        ])
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
    if(chain.id === 97) {
      setMarks([
        {
          value: 0,
          label: 'slow',

        },
        {
          value: 5,
          label: 'average',
        },
        {
          value: 10,
          label: 'fast',
        },
      ]);
      setGasFeeSlow("0");
      setGasFeeAverage("5");
      setGasFeeFast("10");
    }
    else {
      feeCalculate();
      const web3 = new Web3(Web3.givenProvider);
      var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
        if (!error)
            feeCalculate();
      })
      return () => {
        subscription.unsubscribe(function(error, success){
          if (success)
              console.log('Successfully unsubscribed!');
      });
      }
    }
  }, [])
 
  const setSpeed = (e: any) => {
    if(e.target === undefined) {
      // dispatch(updateGasFeePriority(parseFloat(e)));
    }
    else {
      // dispatch(updateGasFeePriority(parseFloat(e.target.value)));
    }
  }
  function valuetext(value: number) {
    return `${value} Gwei`;
  }
  return (
    <div className="w-full">
      <ToastContainer autoClose={2000} />
      <div>Network Speed  Gwei </div>
      
      <Slider
        aria-label="Always visible"
        getAriaValueText={valuetext}
        onChange={setSpeed}
        step={0.01}
        marks={marks}
        defaultValue={0}
        max={parseFloat(fastSpeed) + 0.01}
        min={parseFloat(slowSpeed) - 0.01}
        valueLabelDisplay="on"
      />
     
    </div>
  )
}
export default GasFeeEstimator;