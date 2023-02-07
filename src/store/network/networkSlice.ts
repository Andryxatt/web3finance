import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface NetworkState {
  value: [] | any;
  selectedNetwork: any;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: NetworkState = {
  value:[
    {
        name: "Ethereum",
        icon: require("../../images/ethereum.png"),
        id: 1,
        isActive: false,
        rpcUrl: '',
        Currency: "ETH"
    },
    {
        name: "Polygon Mumbai",
        icon: require("../../images/polygon.png"),
        id: 80001,
        isActive: false,
        Currency: 'MATIC',
        rpcUrl: 'https://rpc-mumbai.matic.today'
    },
    {
        name: "Goerli",
        icon: require("../../images/ethereum.png"),
        id: 5,
        isActive: true,
        Currency: 'WETH',
        rpcUrl: ''
    },
    {
        icon: require("../../images/binance.png"),
        name: "Binance Smart Chain Testnet",
        id: 97,
        isActive: false,
        Currency: 'tBNB',
        rpcUrl: 'https://data-seed-prebsc-1-s3.binance.org:8545'
    }
],
  status: 'idle',
  selectedNetwork: {
    name: "Goerli",
    icon: require("../../images/ethereum.png"),
    id: 5,
    isActive: true,
    Currency: 'WETH',
    rpcUrl: ''
},
};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    changeSelectedNetwork: (state, action: PayloadAction<any>) => {
      const  chainId  = action.payload.id;
      state.value = state.value.map((network: any) => {
        if (network.id === chainId) {
          state.selectedNetwork = network;
          return {
            ...network,
            isActive: true,
          };
        } else {
          return {
            ...network,
            isActive: false,
          };
        }
      });
    },
  },
});

export const { changeSelectedNetwork } = networkSlice.actions;
export const currentNetwork = (state: RootState) => state.network.value.filter((network: any) => network.isActive)[0];
export const selectNetwork = (state: RootState) => state.network.value;

export default networkSlice.reducer;
