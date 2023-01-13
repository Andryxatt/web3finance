import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import ethereumTokens from "../../tokens/ethereum.json";
import bscTokens from "../../tokens/bsc.json";
import polygonTokens from "../../tokens/polygon.json";
import goerliTokens from "../../tokens/goerli.json";
import { Contract, ethers } from 'ethers';
import contractsAddresses from "../../contracts/AddressesContracts.json";
import OracleAbi from "../../contracts/oracle/Oracle.json";
import RTokenAbi from "../../contracts/RTokenAbi.json";
export interface TokenState {
  goerliTokens: Token[];
  // ethTokens: Token[];
  bscTokens: Token[];
  polygonTokens: Token[];
  status: 'idle' | 'loading' | 'failed';
  sortBy: string;
  sortType: string;
}
export interface Token {
  name: string;
  address: string;
  decimal: number;
  tokenPrice: string;
  deposits: string;
  userBalance: string;
  userBalanceDeposit: string;
  isOpen: boolean;
}

const initialState: TokenState = {
  goerliTokens: goerliTokens.Tokenization,
  // ethTokens: ethereumTokens.Tokenization,
  bscTokens: bscTokens.Tokenization,
  polygonTokens: polygonTokens.Tokenization,
  status: 'idle',
  sortBy: '',
  sortType: 'asc',
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    changeTokenByNetwork: (state, action: PayloadAction<any>) => {
      const { chainId } = action.payload;
      switch (chainId) {
        // case 1: {
        //   state.ethTokens = ethereumTokens.Tokenization;
        //   break;
        // }
        case 97: {
          state.bscTokens = bscTokens.Tokenization;
          break;
        }
        case 80001: {
          state.polygonTokens = polygonTokens.Tokenization;
          break;
        }
        case 5: {
          state.goerliTokens = goerliTokens.Tokenization;
          break;
        }
        default: {
          state.goerliTokens = goerliTokens.Tokenization;
          break;
        }
      }

    },
    getTokensPricesGoerli: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.goerliTokens = newTokens;
    },
    getTokensPricesBsc: (state, action: PayloadAction<any>) => {
      state.bscTokens = action.payload;
    },
    getTokensPricesPolygon: (state, action: PayloadAction<any>) => {
      state.polygonTokens = action.payload;
    },
    getUserBalanceGoerli: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.goerliTokens = newTokens;
    },
    getUserBalanceBsc: (state, action: PayloadAction<any>) => {
      state.goerliTokens = action.payload;
    },
    getUserBalancePolygon: (state, action: PayloadAction<any>) => {
      state.goerliTokens = action.payload;
    },
    sortTokensByPrice: (state, action: PayloadAction<any>) => {
      state.sortBy = "price";
      switch (action.payload.chainId) {
        // case 1: {
        //   //sort tokens by price asc and desc
        //   if (state.sortType === "asc") {
        //     state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
        //       return parseFloat(a.tokenPrice) - parseFloat(b.tokenPrice);
        //     });
        //     state.sortType = "desc";
        //   }
        //   else {
        //     state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
        //       return parseFloat(b.tokenPrice) - parseFloat(a.tokenPrice);
        //     });
        //     state.sortType = "asc";
        //   }
        //   break;
        // }
        case 97: {
          if (state.sortType === "asc") {
            state.bscTokens = state.bscTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.tokenPrice) - parseFloat(b.tokenPrice);
            });
            state.sortType = "desc";
          }
          else {
            state.bscTokens = state.bscTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.tokenPrice) - parseFloat(a.tokenPrice);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 80001: {
          if (state.sortType === "asc") {
            state.polygonTokens = state.polygonTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.tokenPrice) - parseFloat(b.tokenPrice);
            });
            state.sortType = "desc";
          }
          else {
            state.polygonTokens = state.polygonTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.tokenPrice) - parseFloat(a.tokenPrice);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 5: {
          if (state.sortType === "asc") {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.tokenPrice) - parseFloat(b.tokenPrice);
            });
            state.sortType = "desc";
          }
          else {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.tokenPrice) - parseFloat(a.tokenPrice);
            });
            state.sortType = "asc";
          }
          break;
        }
        default: {
          if (state.sortType === "asc") {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.tokenPrice) - parseFloat(b.tokenPrice);
            });
            state.sortType = "desc";
          }
          else {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.tokenPrice) - parseFloat(a.tokenPrice);
            });
            state.sortType = "asc";
          }
          break;
        }
      }
    },
    sortTokensByDeposit: (state, action: PayloadAction<any>) => {
      state.sortBy = "deposit";
      switch (action.payload.chainId) {
        // case 1: {
        //   //sort tokens by deposit asc and desc
        //   if (state.sortType === "asc") {
        //     state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
        //       return parseFloat(a.deposits) - parseFloat(b.deposits);
        //     });
        //     state.sortType = "desc";
        //   }
        //   else {
        //     state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
        //       return parseFloat(b.deposits) - parseFloat(a.deposits);
        //     });
        //     state.sortType = "asc";
        //   }
        //   break;
        // }
        case 97: {
          if (state.sortType === "asc") {
            state.bscTokens = state.bscTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.deposits) - parseFloat(b.deposits);
            });
            state.sortType = "desc";
          }
          else {
            state.bscTokens = state.bscTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.deposits) - parseFloat(a.deposits);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 80001: {
          if (state.sortType === "asc") {
            state.polygonTokens = state.polygonTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.deposits) - parseFloat(b.deposits);
            });
            state.sortType = "desc";
          }
          else {
            state.polygonTokens = state.polygonTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.deposits) - parseFloat(a.deposits);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 5: {
          if (state.sortType === "asc") {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.deposits) - parseFloat(b.deposits);
            });
            state.sortType = "desc";
          }
          else {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.deposits) - parseFloat(a.deposits);
            });
            state.sortType = "asc";
          }
          break;
        }
        default: {
          if (state.sortType === "asc") {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.deposits) - parseFloat(b.deposits);
            });
            state.sortType = "desc";
          }
          else {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.deposits) - parseFloat(a.deposits);
            });
            state.sortType = "asc";
          }
          break;
        }
      }
    },
    sortTokensByUserBalanceDeposit: (state, action: PayloadAction<any>) => {
      state.sortBy = "userBalanceDeposit";
      switch (action.payload.chainId) {
        // case 1: {
        //   //sort tokens by userBalanceDeposit asc and desc
        //   if (state.sortType === "asc") {
        //     state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
        //       return parseFloat(a.userBalanceDeposit) - parseFloat(b.userBalanceDeposit);
        //     });
        //     state.sortType = "desc";
        //   }
        //   else {
        //     state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
        //       return parseFloat(b.userBalanceDeposit) - parseFloat(a.userBalanceDeposit);
        //     });
        //     state.sortType = "asc";
        //   }
        //   break;
        // }
        case 97: {
          if (state.sortType === "asc") {
            state.bscTokens = state.bscTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.userBalanceDeposit) - parseFloat(b.userBalanceDeposit);
            });
            state.sortType = "desc";
          }
          else {
            state.bscTokens = state.bscTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.userBalanceDeposit) - parseFloat(a.userBalanceDeposit);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 80001: {
          if (state.sortType === "asc") {
            state.polygonTokens = state.polygonTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.userBalanceDeposit) - parseFloat(b.userBalanceDeposit);
            });
            state.sortType = "desc";
          }
          else {
            state.polygonTokens = state.polygonTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.userBalanceDeposit) - parseFloat(a.userBalanceDeposit);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 5: {
          if (state.sortType === "asc") {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.userBalanceDeposit) - parseFloat(b.userBalanceDeposit);
            });
            state.sortType = "desc";
          }
          else {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.userBalanceDeposit) - parseFloat(a.userBalanceDeposit);
            });
            state.sortType = "asc";
          }
          break;
        }
        default: {
          if (state.sortType === "asc") {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.userBalanceDeposit) - parseFloat(b.userBalanceDeposit);
            });
            state.sortType = "desc";
          }
          else {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.userBalanceDeposit) - parseFloat(a.userBalanceDeposit);
            });
            state.sortType = "asc";
          }
          break;
        }
      }
    },
    sortTokenByTokenName: (state, action: PayloadAction<any>) => {
      state.sortBy = "name";
      switch (action.payload.chainId) {
        // case 1: {
        //   if (state.sortType === "asc") {
        //     state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
        //       return a.name.localeCompare(b.name);
        //     });
        //     state.sortType = "desc";
        //   }
        //   else {
        //     state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
        //       return b.name.localeCompare(a.name);
        //     });
        //     state.sortType = "asc";
        //   }
        //   break;
        // }
        case 97: {
          if (state.sortType === "asc") {
            state.bscTokens = state.bscTokens.sort((a: Token, b: Token) => {
              return a.name.localeCompare(b.name);
            });
            state.sortType = "desc";
          }
          else {
            state.bscTokens = state.bscTokens.sort((a: Token, b: Token) => {
              return b.name.localeCompare(a.name);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 80001: {
          if (state.sortType === "asc") {
            state.polygonTokens = state.polygonTokens.sort((a: Token, b: Token) => {
              return a.name.localeCompare(b.name);
            });
            state.sortType = "desc";
          }
          else {
            state.polygonTokens = state.polygonTokens.sort((a: Token, b: Token) => {
              return b.name.localeCompare(a.name);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 5: {
          //sort by name asc and desc 
          if (state.sortType === "asc") {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return a.name.localeCompare(b.name);
            });
            state.sortType = "desc";
          }
          else {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return b.name.localeCompare(a.name);
            });
            state.sortType = "asc";
          }
          break;
        }
        default: {
          if (state.sortType === "asc") {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return a.name.localeCompare(b.name);
            });
            state.sortType = "desc";
          }
          else {
            state.goerliTokens = state.goerliTokens.sort((a: Token, b: Token) => {
              return b.name.localeCompare(a.name);
            });
            state.sortType = "asc";
          }
          break;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTokensPricesGoerli.fulfilled, (state, action) => {
      state.goerliTokens = action.payload;
    });
    builder.addCase(fetchTokensPricesBsc.fulfilled, (state, action) => {
      state.bscTokens = action.payload;
    });
    builder.addCase(fetchTokensPricesPolygon.fulfilled, (state, action) => {
      state.polygonTokens = action.payload;
    });
    builder.addCase(fetchUserBalanceGoerli.fulfilled, (state, action) => {
      state.goerliTokens = action.payload;
    });
    builder.addCase(fetchUserBalanceBsc.fulfilled, (state, action) => {
      state.bscTokens = action.payload;
    });
    builder.addCase(fetchUserBalancePolygon.fulfilled, (state, action) => {
      state.polygonTokens = action.payload;
    });
  }
});
export const {
  
  changeTokenByNetwork,

  getUserBalanceBsc,
  getUserBalancePolygon,
  getUserBalanceGoerli,

  getTokensPricesBsc,
  getTokensPricesGoerli,
  getTokensPricesPolygon,
  
  sortTokensByPrice,
  sortTokenByTokenName,
  sortTokensByDeposit,
  sortTokensByUserBalanceDeposit } = tokenSlice.actions;

export const currentTokensList = (state: RootState) => {
  //return selected network tokens list
  switch (state.network.selectedNetwork.chainId) {
    // case 1: {
    //   return state.token.ethTokens;
    // }
    case 97: {
      return state.token.bscTokens;
    }
    case 80001: {
      return state.token.polygonTokens;
    }
    case 5: {
      return state.token.goerliTokens;
    }
    default: {
      return state.token.goerliTokens;
    }
  }

}
// export const eth = (state: RootState) => { return state.token.ethTokens }
export const bsc = (state: RootState) => { return state.token.bscTokens }
export const polygon = (state: RootState) => { return state.token.polygonTokens }
export const goerli = (state: RootState) => { return state.token.goerliTokens }

export const sortBy = (state: RootState) => { return state.token.sortBy }
export const sortType = (state: RootState) => { return state.token.sortType }
export default tokenSlice.reducer;

// Thunk to get data from blockchain
export const fetchTokensPricesGoerli = createAsyncThunk(
  'token/getTokensPricesGoerli',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerInfura = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY);
    const contractGoerli = new Contract(contractsAddresses["Goerli Testnet"][0].PriceOracle, OracleAbi, providerInfura);
    const newGoerli = state.token.goerliTokens.map(async (token: any) => {
      const goerliPrice = await contractGoerli.getAssetPrice(token.address);
      const tokenContract = new Contract(token.address, RTokenAbi, providerInfura);
      const totalDeposits = await tokenContract.totalSupply();
      const decimals = await tokenContract.decimals();
      return { ...token, tokenPrice: ethers.utils.formatUnits(goerliPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
    })
    return Promise.all(newGoerli);
  }
)
export const fetchTokensPricesPolygon = createAsyncThunk(
  'token/getTokensPricesPolygon',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerPolygon = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/' + process.env.REACT_APP_MUMBAI_KEY);
    const contractMumbai = new Contract(contractsAddresses["Mumbai Testnet"][0].PriceOracle, OracleAbi, providerPolygon);
    const newPolygon = state.token.polygonTokens.map(async (token: any) => {
      const tokenContract = new Contract(token.address, RTokenAbi, providerPolygon);
      const totalDeposits = await tokenContract.totalSupply();
      const polygonPrice = await contractMumbai.getAssetPrice(token.address);
      return { ...token, tokenPrice: ethers.utils.formatUnits(polygonPrice, token.decimal), deposits: ethers.utils.formatUnits(totalDeposits, token.decimal) }
    });

    return Promise.all(newPolygon);
  }
)
export const fetchTokensPricesBsc = createAsyncThunk(
  'token/getTokensPricesBsc',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerBsc = new ethers.providers.JsonRpcProvider('https://practical-cold-owl.bsc-testnet.discover.quiknode.pro/' + process.env.REACT_APP_QUICK_NODE_KEY);
    const contractBsc = new Contract(contractsAddresses["Smart Chain Testnet"][0].PriceOracle, OracleAbi, providerBsc);
    const newBsc = state.token.bscTokens.map(async (token: any) => {
      const tokenContract = new Contract(token.address, RTokenAbi, providerBsc);
      const totalDeposits = await tokenContract.totalSupply();
      const decimals = await tokenContract.decimals();
      const bscPrice = await contractBsc.getAssetPrice(token.address);
      return { ...token, tokenPrice: ethers.utils.formatUnits(bscPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
    })
    return Promise.all(newBsc);
  }
)
export const fetchUserBalanceGoerli = createAsyncThunk(
  'token/getUserBalanceGoerli',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { provider, address } = data;
    const newTokens = state.token.goerliTokens.map(async (token: any) => {
      const contract = new Contract(token.address, RTokenAbi, provider);
      const userBalanceDeposit = await contract.balanceOf(address);
      return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimal) }
    })
    return Promise.all(newTokens);
  }
)
export const fetchUserBalanceBsc = createAsyncThunk(
  'token/getUserBalanceBsc',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { provider, address } = data;
    const newTokens = state.token.bscTokens.map(async (token: any) => {
      const contract = new Contract(token.address, RTokenAbi, provider);
      const userBalanceDeposit = await contract.balanceOf(address);
      return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimal) }
    })
    return Promise.all(newTokens);
  }
)
export const fetchUserBalancePolygon = createAsyncThunk(
  'token/getUserBalancePolygon',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { provider, address } = data;
    const newTokens = state.token.polygonTokens.map(async (token: any) => {
      const contract = new Contract(token.address, RTokenAbi, provider);
      const userBalanceDeposit = await contract.balanceOf(address);
      return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimal) }
    })
    return Promise.all(newTokens);
  }
)
