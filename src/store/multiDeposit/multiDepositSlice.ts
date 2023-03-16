import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Contract, ethers } from 'ethers';
import { RootState } from '../store';
import contractsAddresses from "../../contracts/AddressesContracts.json";
import OracleAbi from "../../contracts/oracle/Oracle.json";
import RTokenAbi from "../../contracts/RTokenAbi.json";
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
}

const initialState: MultiDepositState = {
  addressesToSend: [],
  userTokenBalance: 0,
  userNativeBalance: 0,
  transactionFee: 0,
  status: 'idle',
  networkPriority:[],
  totalTransactions: 0,
  selectedPriority: undefined
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
      console.log(action.payload)
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
      state.selectedPriority = newState.filter((speed:SpeedNetwork) => speed.selected)[0];
      state.networkPriority = newState;
    }
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
  cleareAddressesToSend

} = multiDepositSlice.actions;
export const currentNetwork = (state: RootState) => state.network.value.filter((network: any) => network.isActive)[0];
export const totalAddresses = (state: RootState) => state.multiDeposit.addressesToSend.length;
export const calculateTotalAmountTokens = (state: RootState) => state.multiDeposit.addressesToSend.reduce((acc: number, asset: Asset) => acc + parseFloat(asset.amount), 0);
export const networkSpeedsArray = (state: RootState) => state.multiDeposit.networkPriority;
export const selectedSpeed = (state: RootState) => state.multiDeposit.selectedPriority;
export const addressesToSend = (state: RootState) => state.multiDeposit.addressesToSend;
export const arrayOfAmounts = (state: RootState) => state.multiDeposit.addressesToSend.map((asset: Asset) => asset.amount.toString().trim());
export const arrayOfAddresses = (state: RootState) => state.multiDeposit.addressesToSend.map((asset: Asset) => asset.address.trim());
export default multiDepositSlice.reducer;
export const getUserTokenBalamce = createAsyncThunk(
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