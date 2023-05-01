import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Contract, ethers } from 'ethers';
import { RootState } from '../store';
import contractsAddresses from "../../contracts/AddressesContracts.json";
import OracleAbi from "../../contracts/oracle/Oracle.json";
import RTokenAbi from "../../contracts/RTokenAbi.json";
import {fetchSigner} from '@wagmi/core';
import FeeShareAbi from "../../contracts/FeeShare.json";
export interface Asset {
    address: string;
    amount: string;
}
export interface SpeedNetwork {
  "speedName": string;
  "maxPriorityFeePerGas": number;
  "baseFeePerGas": number;
  "baseFeeFloat": string;
  "maxPriorityFeePerGasFloat": string;
  "maxFeePerGas": number;
  "maxFeePerGasFloat": string;
  "selected": boolean;
}
export interface MultiDepositState {
  addressesToSend: Asset[];
  userTokenBalance: number;
  userNativeBalance: number;
  transactionFee: number;
  totalTransactions: number;
  networkPriority: SpeedNetwork[];
  selectedPriority:SpeedNetwork;
  status: 'idle' | 'loading' | 'failed';
  txInfo: TxInfo | {};
}
export interface TxInfo {
  method: "",
  tokenAddress: "",
  addressesToSend: [],
  finalAmounts: [],
  txInfo:{
    value: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
  },
  totalTxPerRequest: number,
  isApproved: false,
}
const initialState: MultiDepositState = {
  addressesToSend: [],
  userTokenBalance: 0,
  userNativeBalance: 0,
  transactionFee: 0,
  status: 'idle',
  networkPriority:[],
  totalTransactions: 0,
  selectedPriority: undefined,
  txInfo: {}
};

export const multiDepositSlice = createSlice({
  name: 'multiDeposit',
  initialState,
  reducers: {
    updateAddressesToSend: (state, action) => {
      state.addressesToSend = action.payload;
    },
    removeSendedAddress: (state, action) => {
      //delete 10 elements from start of array
     state.addressesToSend.splice(0, action.payload);
    },
    removeSingleAddress: (state, action) => {
      //remove single address from array
      state.addressesToSend = state.addressesToSend.filter((asset: Asset) => asset.address !== action.payload.address);
    },
    cleareAddressesToSend: (state) => {
      state.addressesToSend = [];
    },
    calculateUserTokenBalance: (state, action) => {
      state.userTokenBalance = action.payload;
    },
    calculateUserNativeBalance: (state, action) => {
      state.userNativeBalance = action.payload;
    },
    calculateTransactionFee: (state, action) => {
      state.transactionFee = action.payload;
    },
    getNetworkPriority: (state, action) =>{
      state.networkPriority = action.payload;
    },
    setSelectedPriority: (state, action) =>{
      state.selectedPriority = action.payload;
    },
    updateSpeedSelected: (state, action) =>{
      //update state array with selected speed
      const newState = state.networkPriority.map((speed:SpeedNetwork) => speed.speedName === action.payload ? {...speed, selected: true} : {...speed, selected: false}); 
      // console.log(newState, "newState");
      state.selectedPriority = newState.filter((speed:SpeedNetwork) => speed.selected)[0];
      state.networkPriority = newState;
    },

    calculateNativePolygonFee: (state, action) => {
      // console.log(action.payload, "action.payload");
      // state.txInfo = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(calculateNativePolygon.fulfilled, (state, action) => {
      // console.log(action.payload, "action.payload");
      // state.txInfo = action.payload;
    });
  },
});

export const { 
  updateAddressesToSend,
  calculateTransactionFee,
  removeSendedAddress,
  getNetworkPriority,
  setSelectedPriority,
  updateSpeedSelected,
  removeSingleAddress,
  cleareAddressesToSend,
  calculateNativePolygonFee,

} = multiDepositSlice.actions;
export const totalAddresses = (state: RootState) => state.multiDeposit.addressesToSend.length;
export const currentNetwork = (state: RootState) => state.network.selectedNetwork;
export const calculateTotalAmountTokens = (state: RootState) => state.multiDeposit.addressesToSend.reduce((acc: number, asset: Asset) => acc + parseFloat(asset.amount), 0);
export const networkSpeedsArray = (state: RootState) => state.multiDeposit.networkPriority;
export const selectedSpeed = (state: RootState) => state.multiDeposit.selectedPriority;
export const addressesToSend = (state: RootState) => state.multiDeposit.addressesToSend;
export const arrayOfAmounts = (state: RootState) => state.multiDeposit.addressesToSend.map((asset: Asset) => asset.amount.toString().trim());
export const arrayOfAddresses = (state: RootState) => state.multiDeposit.addressesToSend.map((asset: Asset) => asset.address.trim());
export default multiDepositSlice.reducer;
const returnAddressesAndAmounts = (isNative, addressesAndAmounts) => {
  let addressesArray = [];
  let amountsArray = [];
  if (isNative) {
      if (addressesAndAmounts.length > 254) {
          addressesArray = addressesAndAmounts.slice(0, 254).map((item: any) => {
              return item.address;
          });
          amountsArray = addressesAndAmounts.slice(0, 254).map((item: any) => {
              return item.amount.toString().trim();
          });
      }
      else {
          addressesArray = addressesAndAmounts.map((item: any) => {
              return item.address;
          });
          amountsArray = addressesAndAmounts.map((item: any) => {
              return item.amount.toString().trim();
          });
      }
  }
  else {
      if (addressesAndAmounts.length > 255) {
          addressesArray = addressesAndAmounts.slice(0, 255).map((item: any) => {
              return item.address;
          });
          amountsArray = addressesAndAmounts.slice(0, 255).map((item: any) => {
              return item.amount.toString().trim();
          });
      }
      else {
          addressesArray = addressesAndAmounts.map((item: any) => {
              return item.address;
          });
          amountsArray = addressesAndAmounts.map((item: any) => {
              return item.amount.toString().trim();
          });
      }
  }
  return { addressesArray, amountsArray }
}
export const calculateNativePolygon = createAsyncThunk(
  'multiDeposit/calculateNativePolygonFee',
  async (args:any, { getState }) => {
    const state = getState() as any;
    const signer = await fetchSigner()
        const feeShare = new Contract(contractsAddresses["Polygon"][0].FeeShare, FeeShareAbi, signer);
        const feePerAddressNative = await feeShare["calculateFee()"]();
        const { addressesArray, amountsArray } = returnAddressesAndAmounts(args.isNative, [...state.multiDeposit.addressesToSend]);
        const totalTokensToSend = addressesArray.length;
        //in for loop total amount of tokens to send

        const finalAmount = amountsArray.map((item: any) => {
            return ethers.utils.parseUnits(item, args.token.decimals);
        });
        const total = finalAmount.reduce((acc: any, b: any) => (acc.add(b)), ethers.BigNumber.from(0));
        finalAmount.unshift(total);
        addressesArray.unshift(contractsAddresses["Polygon"][0].FeeShare);
        const msgValue = feePerAddressNative.mul(totalTokensToSend).add(total);

        const maxFeePerGas = ethers.utils.parseUnits(state.multiDeposit.selectedPriority.maxFeePerGas.toFixed(1), 'gwei');
        const maxPriorityFeePerGas = ethers.utils.parseUnits(state.multiDeposit.selectedPriority.maxPriorityFeePerGas.toFixed(1), 'gwei');
        const txInfo = {
            value: msgValue,
            maxPriorityFeePerGas,
            maxFeePerGas
        }

        const txInform = {
            method: "multiSend(address[],uint256[])",
            token: args.token.address,
            addressesToSend: addressesArray,
            finalAmount,
            txInfo,
            isApproved: true
        }
        try {
            const unitsUsed = await feeShare.estimateGas["multiSend(address[],uint256[])"](addressesArray, finalAmount, txInfo);
            // setGasPrice(unitsUsed.mul(maxFeePerGas).toString());
            // setTxFee(ethers.utils.formatUnits(feePerAddressNative.mul(totalTokensToSend)))
            // setTotalFee(ethers.utils.formatUnits(feePerAddressNative.mul(totalTokensToSend).add(maxFeePerGas.mul(unitsUsed))));
            // setTxToSend(txInform);
            // setAmmount(ethers.utils.formatUnits(total, props.token.decimals));
            // setLoading(false);
            // setIsCalculated(true);

        }
        catch {
          console.log("error");
            // setError(true);
            // setErrorMessage(`You don't have enough balance to pay fee. Your token balance is ${!props.isNativeFee ? parseFloat(props.token.userBalance).toFixed(4) + props.token.name : parseFloat(props.token.userBalanceDeposit).toFixed(4) + props.token.name}`)
            // setLoading(false);
            // setIsCalculated(true);
        }
        return Promise.call(txInform);
        // let txInformation = {
        //   totalAddresses: state.multiDeposit.addressesToSend.length,
        //   totalTxPerRequest: state.addressesAndAmounts.length === 0 ? 1 : Math.ceil(state.addressesAndAmounts.length / 254),
        //   addressesToSend : [],
        //   finalAmounts: [],
        // }
      }
)
export const getNetworkSpeeds = createAsyncThunk(
  'multiDeposit/calculateUserTokenBalance',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerBsc = new ethers.providers.JsonRpcProvider('https://practical-cold-owl.bsc-testnet.discover.quiknode.pro/' + process.env.REACT_APP_QUICK_NODE_KEY);
    const contractBsc = new Contract(contractsAddresses["Binance Smart Chain Testnet"][0].PriceOracle, OracleAbi, providerBsc);
    const newBsc = state.token.bscTokens.map(async (token: any) => {
      const tokenContract = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, providerBsc);
      const totalDeposits = await tokenContract.totalSupply();
      const decimals = await tokenContract.decimals();
      const bscPrice = await contractBsc.getAssetPrice(token.address);
      return { ...token, tokenPrice: ethers.utils.formatUnits(bscPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
    })
    return Promise.all(newBsc);
  }
)