import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import bscTestTokens from "../../tokens/bsct.json";
import bscTokens from "../../tokens/bsc.json";
import polygonTokens from "../../tokens/polygon.json";
import goerliTokens from "../../tokens/goerli.json";
import mumbaiTokens from "../../tokens/mumbai.json";
import ethereumTokens from "../../tokens/ethereum.json";
import { Contract, ethers } from 'ethers';
import contractsAddresses from "../../contracts/AddressesContracts.json";
import OracleAbi from "../../contracts/oracle/Oracle.json";
import RTokenAbi from "../../contracts/RTokenAbi.json";
export interface TokenState {
  goerliTokens: Token[];
  ethTokens: Token[];
  bscTestTokens: Token[];
  bscTokens: Token[];
  polygonTokens: Token[];
  mumbaiTokens: Token[];
  selectedTokens: Token[];
  status: 'idle' | 'loading' | 'failed';
  sortBy: string;
  sortType: string;
  filterBy: string;
  searchField: string;
}
export interface Token {
  name: string;
  address: string;
  decimals: number;
  tokenPrice: string;
  deposits: string;
  userBalance: string;
  userBalanceDeposit: string;
  isOpen: boolean;
  isNative: boolean;
  isStablecoin: boolean;
  inactive: boolean;
  isDeposit: boolean;
}

const initialState: TokenState = {
  goerliTokens: goerliTokens.Tokenization,
  ethTokens: ethereumTokens.Tokenization,
  bscTokens: bscTokens.Tokenization,
  bscTestTokens: bscTestTokens.Tokenization,
  polygonTokens: polygonTokens.Tokenization,
  mumbaiTokens: mumbaiTokens.Tokenization,
  selectedTokens: [],
  status: 'idle',
  sortBy: '',
  sortType: 'asc',
  filterBy: 'All',
  searchField: '',
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    changeTokenByNetwork: (state, action: PayloadAction<any>) => {
      const { chainId } = action.payload;
      switch (chainId) {
        case 1: {
          state.ethTokens = ethereumTokens.Tokenization;
          break;
        }
        case 97: {
          state.bscTestTokens = bscTestTokens.Tokenization;
          break;
        }
        case 56: {
          state.bscTokens = bscTokens.Tokenization;
          break;
        }
        case 80001: {
          state.mumbaiTokens = mumbaiTokens.Tokenization;
          break;
        }
        case 137: {
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
    getTokensPricesEth: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.ethTokens = newTokens;
    },
    getTokensPricesBsc: (state, action: PayloadAction<any>) => {
      state.bscTokens = action.payload;
    },
    getTokensPricesBscT: (state, action: PayloadAction<any>) => {
      state.bscTestTokens = action.payload;
    },
    getTokensPricesPolygon: (state, action: PayloadAction<any>) => {
      state.polygonTokens = action.payload;
    },
    getTokensPricesMumbai: (state, action: PayloadAction<any>) => {
      state.mumbaiTokens = action.payload;
    },
    getUserBalanceGoerli: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.goerliTokens = newTokens;
    },
    getUserBalanceEth: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.ethTokens = newTokens;
    },
    getUserBalanceBsc: (state, action: PayloadAction<any>) => {
      state.bscTokens = action.payload;
    },
    getUserBalanceBscT: (state, action: PayloadAction<any>) => {
      state.bscTestTokens = action.payload;
    },
    getUserBalancePolygon: (state, action: PayloadAction<any>) => {
      state.polygonTokens = action.payload;
    },
    getUserBalanceMumbai: (state, action: PayloadAction<any>) => {
      state.mumbaiTokens = action.payload;
    },
    sortTokensByPrice: (state, action: PayloadAction<any>) => {
      state.sortBy = "price";
      switch (action.payload.id) {
        case 1: {
          //sort tokens by price asc and desc
          if (state.sortType === "asc") {
            state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.tokenPrice) - parseFloat(b.tokenPrice);
            });
            state.sortType = "desc";
          }
          else {
            state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.tokenPrice) - parseFloat(a.tokenPrice);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 97: {
          if (state.sortType === "asc") {
            state.bscTestTokens = state.bscTestTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.tokenPrice) - parseFloat(b.tokenPrice);
            });
            state.sortType = "desc";
          }
          else {
            state.bscTestTokens = state.bscTestTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.tokenPrice) - parseFloat(a.tokenPrice);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 56: {
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
            state.mumbaiTokens = state.mumbaiTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.tokenPrice) - parseFloat(b.tokenPrice);
            });
            state.sortType = "desc";
          }
          else {
            state.mumbaiTokens = state.mumbaiTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.tokenPrice) - parseFloat(a.tokenPrice);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 137: {
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
      switch (action.payload.id) {
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
            state.bscTestTokens = state.bscTestTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.deposits) - parseFloat(b.deposits);
            });
            state.sortType = "desc";
          }
          else {
            state.bscTestTokens = state.bscTestTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.deposits) - parseFloat(a.deposits);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 56: {
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
        case 137: {
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
        case 80001: {
          if (state.sortType === "asc") {
            state.mumbaiTokens = state.mumbaiTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.deposits) - parseFloat(b.deposits);
            });
            state.sortType = "desc";
          }
          else {
            state.mumbaiTokens = state.mumbaiTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.deposits) - parseFloat(a.deposits);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 1: {
          if (state.sortType === "asc") {
            state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.deposits) - parseFloat(b.deposits);
            });
            state.sortType = "desc";
          }
          else {
            state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
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
      switch (action.payload.id) {
        case 1: {
          //sort tokens by userBalanceDeposit asc and desc
          if (state.sortType === "asc") {
            state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.userBalanceDeposit) - parseFloat(b.userBalanceDeposit);
            });
            state.sortType = "desc";
          }
          else {
            state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.userBalanceDeposit) - parseFloat(a.userBalanceDeposit);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 97: {
          if (state.sortType === "asc") {
            state.bscTestTokens = state.bscTestTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.userBalanceDeposit) - parseFloat(b.userBalanceDeposit);
            });
            state.sortType = "desc";
          }
          else {
            state.bscTestTokens = state.bscTestTokens.sort((a: Token, b: Token) => {
              return parseFloat(b.userBalanceDeposit) - parseFloat(a.userBalanceDeposit);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 56: {
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
        case 137: {
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
        case 80001: {
          if (state.sortType === "asc") {
            state.mumbaiTokens = state.mumbaiTokens.sort((a: Token, b: Token) => {
              return parseFloat(a.userBalanceDeposit) - parseFloat(b.userBalanceDeposit);
            });
            state.sortType = "desc";
          }
          else {
            state.mumbaiTokens = state.mumbaiTokens.sort((a: Token, b: Token) => {
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
      switch (action.payload.id) {
        case 1: {
          if (state.sortType === "asc") {
            state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
              return a.name.localeCompare(b.name);
            });
            state.sortType = "desc";
          }
          else {
            state.ethTokens = state.ethTokens.sort((a: Token, b: Token) => {
              return b.name.localeCompare(a.name);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 97: {
          if (state.sortType === "asc") {
            state.bscTestTokens = state.bscTestTokens.sort((a: Token, b: Token) => {
              return a.name.localeCompare(b.name);
            });
            state.sortType = "desc";
          }
          else {
            state.bscTestTokens = state.bscTestTokens.sort((a: Token, b: Token) => {
              return b.name.localeCompare(a.name);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 56: {
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
            state.mumbaiTokens = state.mumbaiTokens.sort((a: Token, b: Token) => {
              return a.name.localeCompare(b.name);
            });
            state.sortType = "desc";
          }
          else {
            state.mumbaiTokens = state.mumbaiTokens.sort((a: Token, b: Token) => {
              return b.name.localeCompare(a.name);
            });
            state.sortType = "asc";
          }
          break;
        }
        case 137: {
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
    filterTokens: (state, action: PayloadAction<any>) => {
      state.filterBy = action.payload.filter;
    },
    filterByName: (state, action: PayloadAction<any>) => {
      state.searchField = action.payload.searchField;
    },
  
    openElement: (state, action: PayloadAction<any>) => {
      const { chainId, name } = action.payload;
      switch (chainId) {
        case 5: {
          state.goerliTokens = state.goerliTokens.map((token: Token) => {
            if (token.name === name) {
              token.isOpen = !token.isOpen;
            }
            else {
              token.isOpen = false;
            }
            return token;
          });
          break;
        }
        case 1: {
          state.ethTokens = state.ethTokens.map((token: Token) => {
            if (token.name === name) {
              token.isOpen = !token.isOpen;
            }
            else {
              token.isOpen = false;
            }
            return token;
          });
          break;
        }
        case 97: {
          state.bscTestTokens = state.bscTestTokens.map((token: Token) => {
            if (token.name === name) {
              token.isOpen = !token.isOpen;
            }
            else {
              token.isOpen = false;
            }
            return token;
          });
          break;
        }
        case 56: {
          state.bscTokens = state.bscTokens.map((token: Token) => {
            if (token.name === name) {
              token.isOpen = !token.isOpen;
            }
            else {
              token.isOpen = false;
            }
            return token;
          });
          break;
        }
        case 80001: {
          state.mumbaiTokens = state.mumbaiTokens.map((token: Token) => {
            if (token.name === name) {
              token.isOpen = !token.isOpen;
            }
            else {
              token.isOpen = false;
            }
            return token;
          });
          break;
        }
        case 137: {
          state.polygonTokens = state.polygonTokens.map((token: Token) => {
            if (token.name === name) {
              token.isOpen = !token.isOpen;
            }
            else {
              token.isOpen = false;
            }
            return token;
          });
          break;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTokensPricesGoerli.fulfilled, (state, action) => {
      state.goerliTokens = action.payload;
    });
    builder.addCase(fetchTokensPricesEth.fulfilled, (state, action) => {
      state.ethTokens = action.payload;
    });
    builder.addCase(fetchTokensPricesBsc.fulfilled, (state, action) => {
      state.bscTokens = action.payload;
    });
       builder.addCase(fetchTokensPricesBscT.fulfilled, (state, action) => {
      state.bscTestTokens = action.payload;
    });
    builder.addCase(fetchTokensPricesPolygon.fulfilled, (state, action) => {
      state.polygonTokens = action.payload;
    });
    builder.addCase(fetchUserBalanceGoerli.fulfilled, (state, action) => {
      state.goerliTokens = action.payload;
    });
    builder.addCase(fetchUserBalanceEth.fulfilled, (state, action) => {
      state.ethTokens = action.payload;
    });
    builder.addCase(fetchUserBalanceBsc.fulfilled, (state, action) => {
      state.bscTokens = action.payload;
    });
    builder.addCase(fetchUserBalanceBscT.fulfilled, (state, action) => {
      state.bscTestTokens = action.payload;
    });
    builder.addCase(fetchUserBalancePolygon.fulfilled, (state, action) => {
      state.polygonTokens = action.payload;
    });
    builder.addCase(fetchUserBalanceMumbai.fulfilled, (state, action) => {
      state.mumbaiTokens = action.payload;
    });
    builder.addCase(fetchTokensPricesMumbai.fulfilled, (state, action) => {
      state.mumbaiTokens = action.payload;
    });
  }
});
export const {
  openElement,
  filterByName,
  filterTokens,

  changeTokenByNetwork,

  getUserBalanceBsc,
  getUserBalancePolygon,
  getUserBalanceGoerli,
  getUserBalanceMumbai,
  getUserBalanceEth,

  getTokensPricesBsc,
  getTokensPricesGoerli,
  getTokensPricesPolygon,
  getTokensPricesMumbai,
  getTokensPricesEth,

  sortTokensByPrice,
  sortTokenByTokenName,
  sortTokensByDeposit,
  sortTokensByUserBalanceDeposit 
} = tokenSlice.actions;

export const currentTokensList = (state: RootState) => {
  //return selected network tokens list
  switch (state.network.selectedNetwork.id) {
    
    case 1: {
      if (state.token.filterBy === "Stablecoins") {
        return state.token.ethTokens.filter((token: Token) => {
            return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Inactive") {
        return state.token.ethTokens.filter((token: Token) => {
            return token.inactive && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if(state.token.filterBy === "Deposited"){
        return state.token.ethTokens.filter((token: Token) => {
            return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else {
        return state.token.ethTokens.filter((token: Token) => { 
            return token.name.toLowerCase().includes(state.token.searchField.toLowerCase()) 
        });
      }
    }
    case 97: {
      if (state.token.filterBy === "Stablecoins") {
        return state.token.bscTestTokens.filter((token: Token) => {
            return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Inactive") {
        return state.token.bscTestTokens.filter((token: Token) => {
            return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if(state.token.filterBy === "Deposited"){
        return state.token.bscTestTokens.filter((token: Token) => {
            return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else {
        return state.token.bscTestTokens.filter((token: Token) => { 
            return token.name.toLowerCase().includes(state.token.searchField.toLowerCase()) 
        });
      }
    }
    case 56: {
      if (state.token.filterBy === "Stablecoins") {
        return state.token.bscTokens.filter((token: Token) => {
            return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Inactive") {
        return state.token.bscTokens.filter((token: Token) => {
            return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if(state.token.filterBy === "Deposited"){
        return state.token.bscTokens.filter((token: Token) => {
            return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else {
        return state.token.bscTokens.filter((token: Token) => { 
            return token.name.toLowerCase().includes(state.token.searchField.toLowerCase()) 
        });
      }
    }
    case 80001: {
      if (state.token.filterBy === "Stablecoins") {
        return state.token.mumbaiTokens.filter((token: Token) => {
            return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Inactive") {
        return state.token.mumbaiTokens.filter((token: Token) => {
            return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if(state.token.filterBy === "Deposited"){
        return state.token.mumbaiTokens.filter((token: Token) => {
            return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else {
        return state.token.mumbaiTokens.filter((token: Token) => { 
            return token.name.toLowerCase().includes(state.token.searchField.toLowerCase()) 
        });
      }
    }
    case 5: {
      if (state.token.filterBy === "Stablecoins") {
        return state.token.goerliTokens.filter((token: Token) => {
            return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Inactive") {
        return state.token.goerliTokens.filter((token: Token) => {
            return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if(state.token.filterBy === "Deposited"){
        return state.token.goerliTokens.filter((token: Token) => {
            return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else {
        return state.token.goerliTokens.filter((token: Token) => { 
            return token.name.toLowerCase().includes(state.token.searchField.toLowerCase()) 
        });
      }
    }
    case 137:{
      if (state.token.filterBy === "Stablecoins") {
        return state.token.polygonTokens.filter((token: Token) => {
            return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Inactive") {
        return state.token.polygonTokens.filter((token: Token) => {
            return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if(state.token.filterBy === "Deposited"){
        return state.token.polygonTokens.filter((token: Token) => {
            return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else {
        return state.token.polygonTokens.filter((token: Token) => { 
            return token.name.toLowerCase().includes(state.token.searchField.toLowerCase()) 
        });
      }
    }
    default: {
      return state.token.goerliTokens;
    }
  }

}
 export const eth = (state: RootState) => { return state.token.ethTokens }
export const bsc = (state: RootState) => { return state.token.bscTokens }
export const bscTest = (state: RootState) => { return state.token.bscTestTokens }
export const polygon = (state: RootState) => { return state.token.polygonTokens }
export const goerli = (state: RootState) => { return state.token.goerliTokens }
export const mumbai = (state: RootState) => { return state.token.mumbaiTokens }
export const sortBy = (state: RootState) => { return state.token.sortBy }
export const sortType = (state: RootState) => { return state.token.sortType }
export const nativeBalance = (state: RootState) => {
  switch (state.network.selectedNetwork.id) {
    case 97: {
      //return token userBalance if token isNative is true
      return state.token.bscTestTokens.filter((token: Token) => {
        return token.isNative === true;
      });
    }
    case 56: {
      //return token userBalance if token isNative is true
      return state.token.bscTokens.filter((token: Token) => {
        return token.isNative === true;
      });
    }
    case 80001: {
      return state.token.mumbaiTokens.filter((token: Token) => {
        return token.isNative === true;
      });
    }
    case 5: {
      return state.token.goerliTokens.filter((token: Token) => {
        return token.isNative === true;
      });
    }
    case 137: {
      return state.token.polygonTokens.filter((token: Token) => {
        return token.isNative === true;
      });
    }
  }
}
export default tokenSlice.reducer;

// Thunk to get data from blockchain
export const fetchTokensPricesGoerli = createAsyncThunk(
  'token/getTokensPricesGoerli',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerInfura = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY);
    const contractGoerli = new Contract(contractsAddresses["Goerli"][0].PriceOracle, OracleAbi, providerInfura);
    const newGoerli = state.token.goerliTokens.map(async (token: any) => {
      const goerliPrice = await contractGoerli.getAssetPrice(token.address);
      if (token.isNative) {
        return { ...token, tokenPrice: ethers.utils.formatUnits(goerliPrice, 8), deposits: "-" }
      }
      else {
        const tokenContract = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, providerInfura);
        const totalDeposits = await tokenContract.totalSupply();
        const decimals = await tokenContract.decimals();
        return { ...token, tokenPrice: ethers.utils.formatUnits(goerliPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
      }
    })
    return Promise.all(newGoerli);
  }
)
export const fetchTokensPricesEth = createAsyncThunk(
  'token/getTokensPricesEth',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerInfura = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY);
    const contractEth = new Contract(contractsAddresses["Ethereum"][0].PriceOracle, OracleAbi, providerInfura);
    const newEth = state.token.ethTokens.map(async (token: any) => {
      const ethPrice = await contractEth.getAssetPrice(token.address);
      if (token.isNative) {
        return { ...token, tokenPrice: ethers.utils.formatUnits(ethPrice, 8), deposits: "-" }
      }
      else {
        const rTokenContract = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, providerInfura);
        const totalDeposits = await rTokenContract.totalSupply();
        const decimals = await rTokenContract.decimals();
        return { ...token, tokenPrice: ethers.utils.formatUnits(ethPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
      }
    })
    return Promise.all(newEth);
  }
)
export const fetchTokensPricesPolygon = createAsyncThunk(
  'token/getTokensPricesPolygon',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerPolygon = new ethers.providers.JsonRpcProvider('https://rpc-mainnet.maticvigil.com/');
    const contractMumbai = new Contract(contractsAddresses["Polygon"][0].PriceOracle, OracleAbi, providerPolygon);
    const newPolygon = state.token.polygonTokens.map(async (token: any) => {
      const tokenContract = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, providerPolygon);
      const polygonPrice = await contractMumbai.getAssetPrice(token.address);
      if (token.isNative) {
        return { ...token, tokenPrice: ethers.utils.formatUnits(polygonPrice, 8), deposits: "-" }
      }
      else {
        const decimals = await tokenContract.decimals();
        const totalDeposits = await tokenContract.totalSupply();
        return { ...token, tokenPrice: ethers.utils.formatUnits(polygonPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
      }
    });

    return Promise.all(newPolygon);
  }
)
export const fetchTokensPricesMumbai = createAsyncThunk(
  'token/getTokensPricesMumbai',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerMumbai = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/' + process.env.REACT_APP_MUMBAI_KEY);
    const contractMumbai = new Contract(contractsAddresses["Polygon Mumbai"][0].PriceOracle, OracleAbi, providerMumbai);
    const newMumbai = state.token.mumbaiTokens.map(async (token: any) => {
      const tokenContract = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, providerMumbai);
      const mumbaiPrice = await contractMumbai.getAssetPrice(token.address);
      if (token.isNative) {
        return { ...token, tokenPrice: ethers.utils.formatUnits(mumbaiPrice, 8), deposits: "-" }
      }
      else {
        const decimals = await tokenContract.decimals();
        const totalDeposits = await tokenContract.totalSupply();
        return { ...token, tokenPrice: ethers.utils.formatUnits(mumbaiPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
      }
    });

    return Promise.all(newMumbai);
  }
)
export const fetchTokensPricesBscT = createAsyncThunk(
  'token/getTokensPricesBscT',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerBsc = new ethers.providers.JsonRpcProvider('https://practical-cold-owl.bsc-testnet.discover.quiknode.pro/' + process.env.REACT_APP_QUICK_NODE_KEY);
    const contractBsc = new Contract(contractsAddresses["Binance Smart Chain Testnet"][0].PriceOracle, OracleAbi, providerBsc);
    const newBsc = state.token.bscTestTokens.map(async (token: any) => {
      const tokenContract = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, providerBsc);
      const bscPrice = await contractBsc.getAssetPrice(token.address);
      if (token.isNative) {
        return { ...token, tokenPrice: ethers.utils.formatUnits(bscPrice, 8), deposits: "-" }
      }
      else {
        const totalDeposits = await tokenContract.totalSupply();
        const decimals = await tokenContract.decimals();
        return { ...token, tokenPrice: ethers.utils.formatUnits(bscPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
      }
    })
    return Promise.all(newBsc);
  }
)
export const fetchTokensPricesBsc = createAsyncThunk(
  'token/getTokensPricesBsc',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerBsc = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org');
    const contractBsc = new Contract(contractsAddresses["Binance Smart Chain"][0].PriceOracle, OracleAbi, providerBsc);
    const newBsc = state.token.bscTokens.map(async (token: any) => {
      const tokenContract = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, providerBsc);
      const bscPrice = await contractBsc.getAssetPrice(token.address);
      if (token.isNative) {
        return { ...token, tokenPrice: ethers.utils.formatUnits(bscPrice, 8), deposits: "-" }
      }
      else {
        const totalDeposits = await tokenContract.totalSupply();
        const decimals = await tokenContract.decimals();
        return { ...token, tokenPrice: ethers.utils.formatUnits(bscPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
      }
    })
    return Promise.all(newBsc);
  }
)
export const fetchUserBalanceGoerli = createAsyncThunk(
  'token/getUserBalanceGoerli',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { provider, address } = data;
    const newTokens = state.token.goerliTokens.map(async (token: Token) => {
      const contractRToken = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, provider);
      if (token.isNative) {
        const userBalance = await provider.getBalance(address);
        return { ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatEther(userBalance) }
      }
      else {
        const contractToken = new Contract(token.address, RTokenAbi, provider);
        const userBalanceToken = await contractToken.balanceOf(address);
        const userBalanceDeposit = await contractRToken.balanceOf(address);
        return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals), isDeposit: userBalanceDeposit.gt(0) }
      }

    })
    return Promise.all(newTokens);
  }
)
export const fetchUserBalanceEth = createAsyncThunk(
  'token/getUserBalanceEth',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { provider, address } = data;
    const newTokens = state.token.ethTokens.map(async (token: Token) => {
      const contractRToken = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, provider);
      if (token.isNative) {
        const userBalance = await provider.getBalance(address);
        return { ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatEther(userBalance) }
      }
      else {
        const contractToken = new Contract(token.address, RTokenAbi, provider);
        const userBalanceToken = await contractToken.balanceOf(address);
        const userBalanceDeposit = await contractRToken.balanceOf(address);
        return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals), isDeposit: userBalanceDeposit.gt(0) }
      }

    })
    return Promise.all(newTokens);
  }
)
export const fetchUserBalanceBscT = createAsyncThunk(
  'token/getUserBalanceBscT',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { provider, address } = data;
    const newTokens = state.token.bscTestTokens.map(async (token: any) => {
      const contractRToken = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, provider);
      if (token.isNative) {
        const userBalance = await provider.getBalance(address);
        return { ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatUnits(userBalance) }
      }
      else {
        const contractToken = new Contract(token.address, RTokenAbi, provider);
        const userBalanceToken = await contractToken.balanceOf(address);
        const userBalanceDeposit = await contractRToken.balanceOf(address);
        return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals),isDeposit: userBalanceDeposit.gt(0) }
      }
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
      const contractRToken = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, provider);
      if (token.isNative) {
        const userBalance = await provider.getBalance(address);
        return { ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatUnits(userBalance) }
      }
      else {
        const contractToken = new Contract(token.address, RTokenAbi, provider);
        const userBalanceToken = await contractToken.balanceOf(address);
        const userBalanceDeposit = await contractRToken.balanceOf(address);
        return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals),isDeposit: userBalanceDeposit.gt(0) }
      }
     
    })
    return Promise.all(newTokens);
  }
)
export const fetchUserBalancePolygon = createAsyncThunk(
  'token/getUserBalancePolygon',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { provider, address } = data;
    const newTokens = state.token.polygonTokens.map(async (token: Token) => {
      if (token.isNative) {
        const userBalance = await provider.getBalance(address);
        return { ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatUnits(userBalance) }
      }
      else {
        const contractRToken = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, provider);
        const contractToken = new Contract(token.address, RTokenAbi, provider);
        const userBalanceToken = await contractToken.balanceOf(address);
        const userBalanceDeposit = await contractRToken.balanceOf(address);
        return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals),isDeposit: userBalanceDeposit.gt(0) }
      }
    })
    return Promise.all(newTokens);
  }
)
export const fetchUserBalanceMumbai = createAsyncThunk(
  'token/getUserBalanceMumbai',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { provider, address } = data;
    const newTokens = state.token.mumbaiTokens.map(async (token: Token) => {
      if (token.isNative) {
        const userBalance = await provider.getBalance(address);
        return { ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatUnits(userBalance, 18) }
      }
      else {
        const contractRToken = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, provider);
        const contractToken = new Contract(token.address, RTokenAbi, provider);
        const userBalanceToken = await contractToken.balanceOf(address);
        const userBalanceDeposit = await contractRToken.balanceOf(address);
        return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals),isDeposit: userBalanceDeposit.gt(0) }
      }
    })
    return Promise.all(newTokens);
  }
)
