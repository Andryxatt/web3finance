import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import bscTestTokens from "../../tokens/bsct.json";
import bscTokens from "../../tokens/bsc.json";
import polygonTokens from "../../tokens/polygon.json";
import goerliTokens from "../../tokens/goerli.json";
import mumbaiTokens from "../../tokens/mumbai.json";
import ethereumTokens from "../../tokens/ethereum.json";
import avxTokens from "../../tokens/avalanche.json";
import optimismTokens from "../../tokens/optimism.json";
import arbitrumTokens from "../../tokens/arbitrum.json";
import { Contract, ethers } from 'ethers';
import contractsAddresses from "../../contracts/AddressesContracts.json";
import OracleAbi from "../../contracts/oracle/Oracle.json";
import RTokenAbi from "../../contracts/RTokenAbi.json";
export interface TokenState {
  goerliTokens: Token[];
  avalancheTokens: Token[];
  optimismTokens: Token[];
  arbitrumTokens: Token[];
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
export interface ChainTokenMap {
  [chainId: number]: Token[];
}

export type ChainSortTypeMap = {
  [chainId: number]: "asc" | "desc";
};

export const CHAIN_SORT_TYPE_MAP: ChainSortTypeMap = {
  1: "asc",
  10: "asc",
  56: "asc",
  97: "asc",
  137: "asc",
  43114: "asc",
  42161: "asc",
};
export interface TokenMap {
  [id: number]: Token[];
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
  avalancheTokens: avxTokens.Tokenization,
  optimismTokens: optimismTokens.Tokenization,
  arbitrumTokens: arbitrumTokens.Tokenization,
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
    //   changeTokenByNetwork: (state, action: PayloadAction<any>) => {
    //     const { chainId } = action.payload;
    // const tokenizationMap = {
    //   1: ethereumTokens.Tokenization,
    //   // 5: goerliTokens.Tokenization,
    //   10: optimismTokens.Tokenization,
    //   56: bscTokens.Tokenization,
    //   97: bscTestTokens.Tokenization,
    //   137: polygonTokens.Tokenization,
    //   43114: avxTokens.Tokenization,
    //   42161:arbitrumTokens.Tokenization,
    //   // 80001: mumbaiTokens.Tokenization,
    // };
    // const tokenization = tokenizationMap[chainId] || goerliTokens.Tokenization;
    // state.ethTokens = tokenization;
    // // state.goerliTokens = tokenization;
    // state.optimismTokens = tokenization;
    // state.bscTokens = tokenization;
    // state.bscTestTokens = tokenization;
    // state.polygonTokens = tokenization;
    // state.avalancheTokens = tokenization;
    // // state.mumbaiTokens = tokenization;
    // state.arbitrumTokens = tokenization;

    //   },
    // getTokensPricesGoerli: (state, action: PayloadAction<any>) => {
    //   const { newTokens } = action.payload;
    //   state.goerliTokens = newTokens;
    // },
    getTokensPricesOptimism: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.optimismTokens = newTokens;
    },
    getTokensPricesArbitrum: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.arbitrumTokens = newTokens;
    },
    getTokensPricesEth: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.ethTokens = newTokens;
    },
    getTokensPricesBsc: (state, action: PayloadAction<any>) => {
      state.bscTokens = action.payload;
    },
    // getTokensPricesBscT: (state, action: PayloadAction<any>) => {
    //   state.bscTestTokens = action.payload;
    // },
    getTokensPricesAvalanche: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.avalancheTokens = newTokens;
    },
    getTokensPricesPolygon: (state, action: PayloadAction<any>) => {
      state.polygonTokens = action.payload;
    },
    // getTokensPricesMumbai: (state, action: PayloadAction<any>) => {
    //   state.mumbaiTokens = action.payload;
    // },
    // getUserBalanceGoerli: (state, action: PayloadAction<any>) => {
    //   const { newTokens } = action.payload;
    //   state.goerliTokens = newTokens;
    // },
    getTokensPricesSingleToken: (state, action: PayloadAction<any>) => {
      console.log('getUserBalanceSingleToken');
      const { token, chainId } = action.payload;
      if (chainId === 1) state.ethTokens = [...state.ethTokens, token];
      if (chainId === 10) state.optimismTokens = [...state.optimismTokens, token];
      if (chainId === 56) state.bscTokens = [...state.bscTokens, token];
      if (chainId === 137) state.polygonTokens = [...state.polygonTokens, token];
      if (chainId === 43114) state.avalancheTokens = [...state.avalancheTokens, token];
      if (chainId === 42161) state.arbitrumTokens = [...state.arbitrumTokens, token];
    },
    getUserBalanceSingleToken: (state, action: PayloadAction<any>) => {
      console.log('getUserBalanceSingleToken');
      const { token, chainId } = action.payload;
      if (chainId === 1) state.ethTokens = [...state.ethTokens, token];
      if (chainId === 10) state.optimismTokens = [...state.optimismTokens, token];
      if (chainId === 56) state.bscTokens = [...state.bscTokens, token];
      if (chainId === 137) state.polygonTokens = [...state.polygonTokens, token];
      if (chainId === 43114) state.avalancheTokens = [...state.avalancheTokens, token];
      if (chainId === 42161) state.arbitrumTokens = [...state.arbitrumTokens, token];
    },
    getUserBalanceArbitrum: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.arbitrumTokens = newTokens;
    },
    getUserBalanceOptimism: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.optimismTokens = newTokens;
    },
    getUserBalanceAvalanche: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.avalancheTokens = newTokens;
    },
    getUserBalanceEth: (state, action: PayloadAction<any>) => {
      const { newTokens } = action.payload;
      state.ethTokens = newTokens;
    },
    getUserBalanceBsc: (state, action: PayloadAction<any>) => {
      state.bscTokens = action.payload;
    },
    // getUserBalanceBscT: (state, action: PayloadAction<any>) => {
    //   state.bscTestTokens = action.payload;
    // },
    getUserBalancePolygon: (state, action: PayloadAction<any>) => {
      state.polygonTokens = action.payload;
    },
    // getUserBalanceMumbai: (state, action: PayloadAction<any>) => {
    //   state.mumbaiTokens = action.payload;
    // },
    sortTokensByPrice: (state, action: PayloadAction<any>) => {
      state.sortBy = "price";
      const tokenMap: TokenMap = {
        1: state.ethTokens,
        // 97: state.bscTestTokens,
        56: state.bscTokens,
        // 80001: state.mumbaiTokens,
        137: state.polygonTokens,
        // 5: state.goerliTokens,
        43114: state.avalancheTokens,
        42161: state.arbitrumTokens,
        10: state.optimismTokens,
      };
      const tokens = tokenMap[action.payload.id] ?? state.goerliTokens;
      const sortFunc = (a: Token, b: Token) => {
        return parseFloat(a.tokenPrice) - parseFloat(b.tokenPrice);
      };
      if (state.sortType === "asc") {
        tokens.sort(sortFunc);
        state.sortType = "desc";
      } else {
        tokens.sort((a: Token, b: Token) => sortFunc(b, a));
        state.sortType = "asc";
      }
    },
    sortTokensByDeposit: (state, action: PayloadAction<any>) => {
      const { id } = action.payload;

      const chainTokensMap: ChainTokenMap = {
        1: state.ethTokens,
        // 5: state.goerliTokens,
        10: state.optimismTokens,
        56: state.bscTokens,
        // 97: state.bscTestTokens,
        137: state.polygonTokens,
        42161: state.arbitrumTokens,
        43114: state.avalancheTokens,
        // 80001: state.mumbaiTokens,
      };

      const chainSortTypeMap: ChainSortTypeMap = {
        ...CHAIN_SORT_TYPE_MAP,
        [id]: state.sortType === "asc" ? "desc" : "asc",
      };

      const tokensToSort = chainTokensMap[id];
      const sortType = chainSortTypeMap[id];

      const sortedTokens = tokensToSort.sort((a: Token, b: Token) => {
        const aDeposits = parseFloat(a.deposits);
        const bDeposits = parseFloat(b.deposits);

        if (sortType === "asc") {
          return aDeposits - bDeposits;
        } else {
          return bDeposits - aDeposits;
        }
      });

      state.sortBy = "deposit";
      chainTokensMap[id] = sortedTokens;
      chainSortTypeMap[id] = sortType;

      Object.keys(chainTokensMap).forEach((chainId) => {
        state[`${chainTokensMap[chainId][0].chainId}Tokens`] = chainTokensMap[chainId];
      });

      state.sortType = sortType;
    },
    sortTokensByUserBalanceDeposit: (state, action: PayloadAction<any>) => {
      state.sortBy = "userBalanceDeposit";
      const { id } = action.payload;
      const tokensMap = {
        1: state.ethTokens,
        // 5: state.goerliTokens,
        10: state.optimismTokens,
        56: state.bscTokens,
        // 97: state.bscTestTokens,
        137: state.polygonTokens,
        42161: state.arbitrumTokens,
        // 80001: state.mumbaiTokens,
        43114: state.avalancheTokens,
      };
      const tokens = tokensMap[id] || state.goerliTokens;
      const sortFn = (a: Token, b: Token) =>
        parseFloat(b.userBalanceDeposit) - parseFloat(a.userBalanceDeposit);
      if (state.sortType === "asc") {
        tokens.sort(sortFn);
        state.sortType = "desc";
      } else {
        tokens.sort(sortFn);
        state.sortType = "asc";
      }
    },

    sortTokenByTokenName: (state, action: PayloadAction<any>) => {
      state.sortBy = "name";
      const tokens = {
        1: state.ethTokens,
        // 5: state.goerliTokens,
        10: state.optimismTokens,
        56: state.bscTokens,
        // 97: state.bscTestTokens,
        137: state.polygonTokens,
        42161: state.arbitrumTokens,
        // 80001: state.mumbaiTokens,
        43114: state.avalancheTokens
      };
      const id = action.payload.id in tokens ? action.payload.id : 5;
      const tokenList = tokens[id];
      const sortFunction = (a: Token, b: Token) => {
        return state.sortType === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      };
      tokenList.sort(sortFunction);
      state.sortType = state.sortType === "asc" ? "desc" : "asc";
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
        // case 5: {
        //   state.goerliTokens = state.goerliTokens.map((token: Token) => {
        //     if (token.name === name) {
        //       token.isOpen = !token.isOpen;
        //     }
        //     else {
        //       token.isOpen = false;
        //     }
        //     return token;
        //   });
        //   break;
        // }
        case 10: {
          state.optimismTokens = state.optimismTokens.map((token: Token) => {
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
        // case 97: {
        //   state.bscTestTokens = state.bscTestTokens.map((token: Token) => {
        //     if (token.name === name) {
        //       token.isOpen = !token.isOpen;
        //     }
        //     else {
        //       token.isOpen = false;
        //     }
        //     return token;
        //   });
        //   break;
        // }
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
        // case 80001: {
        //   state.mumbaiTokens = state.mumbaiTokens.map((token: Token) => {
        //     if (token.name === name) {
        //       token.isOpen = !token.isOpen;
        //     }
        //     else {
        //       token.isOpen = false;
        //     }
        //     return token;
        //   });
        //   break;
        // }
        case 42161: {
          state.arbitrumTokens = state.arbitrumTokens.map((token: Token) => {
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
        case 43114: {
          state.avalancheTokens = state.avalancheTokens.map((token: Token) => {
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
    closeAllElements: (state) => {
      console.log("closeAllElements");
      state.ethTokens = state.ethTokens.map((token: Token) => {
        token.isOpen = false;
        return token;
      });
      // state.goerliTokens = state.goerliTokens.map((token: Token) => {
      //   token.isOpen = false;
      //   return token;
      // });
      state.optimismTokens = state.optimismTokens.map((token: Token) => {
        token.isOpen = false;
        return token;
      }
      );
      state.bscTokens = state.bscTokens.map((token: Token) => {
        token.isOpen = false;
        return token;
      }
      );
      // state.bscTestTokens = state.bscTestTokens.map((token: Token) => {
      //   token.isOpen = false;
      //   return token;
      // }
      // );
      state.polygonTokens = state.polygonTokens.map((token: Token) => {

        token.isOpen = false;
        return token;
      }
      );
      // state.mumbaiTokens = state.mumbaiTokens.map((token: Token) => {
      //   token.isOpen = false;
      //   return token;
      // }
      // );
      state.arbitrumTokens = state.arbitrumTokens.map((token: Token) => {
        token.isOpen = false;
        return token;
      }
      );
      state.avalancheTokens = state.avalancheTokens.map((token: Token) => {
        token.isOpen = false;
        return token;
      }
      );
    },

  },
  extraReducers: (builder) => {
    // builder.addCase(fetchTokensPricesGoerli.fulfilled, (state, action) => {
    //   state.goerliTokens = action.payload;
    // });
    builder.addCase(fetchTokensPricesAvalanche.fulfilled, (state, action) => {
      state.avalancheTokens = action.payload;
    });
    builder.addCase(fetchTokensPricesArbitrum.fulfilled, (state, action) => {
      state.arbitrumTokens = action.payload;
    });
    builder.addCase(fetchTokensPricesOptimism.fulfilled, (state, action) => {
      state.optimismTokens = action.payload;
    });
    builder.addCase(fetchTokensPricesEth.fulfilled, (state, action) => {
      state.ethTokens = action.payload;
    });
    builder.addCase(fetchTokensPricesBsc.fulfilled, (state, action) => {
      state.bscTokens = action.payload;
    });
    // builder.addCase(fetchTokensPricesBscT.fulfilled, (state, action) => {
    //   state.bscTestTokens = action.payload;
    // });
    builder.addCase(fetchTokensPricesPolygon.fulfilled, (state, action) => {
      state.polygonTokens = action.payload;
    });
    // builder.addCase(fetchUserBalanceGoerli.fulfilled, (state, action) => {
    //   state.goerliTokens = action.payload;
    // });
    builder.addCase(fetchUserBalanceEth.fulfilled, (state, action) => {
      state.ethTokens = action.payload;
    });
    builder.addCase(fetchUserBalanceBsc.fulfilled, (state, action) => {
      state.bscTokens = action.payload;
    });
    builder.addCase(fetchUserBalanceOptimism.fulfilled, (state, action) => {
      state.optimismTokens = action.payload;
    });
    builder.addCase(fetchUserBalanceArbitrum.fulfilled, (state, action) => {
      state.arbitrumTokens = action.payload;
    });
    // builder.addCase(fetchUserBalanceBscT.fulfilled, (state, action) => {
    //   state.bscTestTokens = action.payload;
    // });
    builder.addCase(fetchUserBalancePolygon.fulfilled, (state, action) => {
      state.polygonTokens = action.payload;
    });
    builder.addCase(fetchUserBalanceAvalanche.fulfilled, (state, action) => {
      state.avalancheTokens = action.payload;
    });
    // builder.addCase(fetchUserBalanceMumbai.fulfilled, (state, action) => {
    //   state.mumbaiTokens = action.payload;
    // });
    // builder.addCase(fetchTokensPricesMumbai.fulfilled, (state, action) => {
    //   state.mumbaiTokens = action.payload;
    // });
    builder.addCase(fetchTokensPricesSingleToken.fulfilled, (state, action) => {
      console.log(action.payload);
      //need to update the token in current network token list
      switch (action.payload.network) {
        case "Binance Smart Chain": {
          state.bscTokens = state.bscTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, deposits: action.payload.token.deposits};
          });
          break;
        }
        case "Ethereum": {
          state.ethTokens = state.ethTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, deposits: action.payload.token.deposits};
          });
          break;
        }
        case "Polygon": {
          state.polygonTokens = state.polygonTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, deposits: action.payload.token.deposits};
          });
          break;
        }
        case "Avalanche": {
          state.avalancheTokens = state.avalancheTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, deposits: action.payload.token.deposits};
          }
          );
          break;
        }
        case "Arbitrum": {
          state.arbitrumTokens = state.arbitrumTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, deposits: action.payload.token.deposits};
          }
          );
          break;
        }
        case "Optimism": {
          state.optimismTokens = state.optimismTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, deposits: action.payload.token.deposits};
          }
          );
          break;
        }
        default: {
          break;
        }
      }
      });
    builder.addCase(fetchUserBalanceSingleToken.fulfilled, (state, action) => {
      console.log(action.payload);
      switch (action.payload.network) {
        case "Binance Smart Chain": {
          state.bscTokens = state.bscTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, userBalanceDeposit: action.payload.token.userBalanceDeposit, userBalance: action.payload.token.userBalance, isDeposit: action.payload.token.isDeposit};
          });
          break;
        }
        case "Ethereum": {
          state.ethTokens = state.ethTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, userBalanceDeposit: action.payload.token.userBalanceDeposit, userBalance: action.payload.token.userBalance, isDeposit: action.payload.token.isDeposit};
          });
          break;
        }
        case "Polygon": {
          state.polygonTokens = state.polygonTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, userBalanceDeposit: action.payload.token.userBalanceDeposit, userBalance: action.payload.token.userBalance, isDeposit: action.payload.token.isDeposit};
          });
          break;
        }
        case "Avalanche": {
          state.avalancheTokens = state.avalancheTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, userBalanceDeposit: action.payload.token.userBalanceDeposit, userBalance: action.payload.token.userBalance, isDeposit: action.payload.token.isDeposit};
          }
          );
          break;
        }
        case "Arbitrum": {
          state.arbitrumTokens = state.arbitrumTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, userBalanceDeposit: action.payload.token.userBalanceDeposit, userBalance: action.payload.token.userBalance, isDeposit: action.payload.token.isDeposit};
          }
          );
          break;
        }
        case "Optimism": {
          state.optimismTokens = state.optimismTokens.map((token: Token) => {
            return token.address === action.payload.token.address ? action.payload.token : {...token, userBalanceDeposit: action.payload.token.userBalanceDeposit, userBalance: action.payload.token.userBalance, isDeposit: action.payload.token.isDeposit};
          }
          );
          break;
        }
        default: {
          break;
        }
      }
    });
  }
});
export const {
  openElement,
  filterByName,
  filterTokens,
  closeAllElements,

  getUserBalanceBsc,
  getUserBalancePolygon,
  getUserBalanceEth,
  getUserBalanceAvalanche,
  getUserBalanceOptimism,
  getUserBalanceArbitrum,

  getTokensPricesBsc,
  getTokensPricesPolygon,
  getTokensPricesEth,
  getTokensPricesAvalanche,
  getTokensPricesOptimism,
  getTokensPricesArbitrum,

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
      else if (state.token.filterBy === "Deposited") {
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
    // case 5: {
    //   if (state.token.filterBy === "Stablecoins") {
    //     return state.token.goerliTokens.filter((token: Token) => {
    //       return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
    //     });
    //   }
    //   else if (state.token.filterBy === "Inactive") {
    //     return state.token.goerliTokens.filter((token: Token) => {
    //       return token.inactive && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
    //     });
    //   }
    //   else if (state.token.filterBy === "Deposited") {
    //     return state.token.goerliTokens.filter((token: Token) => {
    //       return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
    //     });
    //   }
    //   else {
    //     return state.token.goerliTokens.filter((token: Token) => {
    //       return token.name.toLowerCase().includes(state.token.searchField.toLowerCase())
    //     });
    //   }
    // }
    case 10: {
      if (state.token.filterBy === "Stablecoins") {
        return state.token.optimismTokens.filter((token: Token) => {
          return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Inactive") {
        return state.token.optimismTokens.filter((token: Token) => {
          return token.inactive && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Deposited") {
        return state.token.optimismTokens.filter((token: Token) => {
          return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else {
        return state.token.optimismTokens.filter((token: Token) => {
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
          return token.inactive && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Deposited") {
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
    // case 97: {
    //   if (state.token.filterBy === "Stablecoins") {
    //     return state.token.bscTestTokens.filter((token: Token) => {
    //       return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
    //     });
    //   }
    //   else if (state.token.filterBy === "Inactive") {
    //     return state.token.bscTestTokens.filter((token: Token) => {
    //       return token.inactive && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
    //     });
    //   }
    //   else if (state.token.filterBy === "Deposited") {
    //     return state.token.bscTestTokens.filter((token: Token) => {
    //       return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
    //     });
    //   }
    //   else {
    //     return state.token.bscTestTokens.filter((token: Token) => {
    //       return token.name.toLowerCase().includes(state.token.searchField.toLowerCase())
    //     });
    //   }
    // }
    case 137: {
      if (state.token.filterBy === "Stablecoins") {
        return state.token.polygonTokens.filter((token: Token) => {
          return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Inactive") {
        return state.token.polygonTokens.filter((token: Token) => {
          return token.inactive && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Deposited") {
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
    // case 80001: {
    //   if (state.token.filterBy === "Stablecoins") {
    //     return state.token.mumbaiTokens.filter((token: Token) => {
    //       return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
    //     });
    //   }
    //   else if (state.token.filterBy === "Inactive") {
    //     return state.token.mumbaiTokens.filter((token: Token) => {
    //       return token.inactive && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
    //     });
    //   }
    //   else if (state.token.filterBy === "Deposited") {
    //     return state.token.mumbaiTokens.filter((token: Token) => {
    //       return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
    //     });
    //   }
    //   else {
    //     return state.token.mumbaiTokens.filter((token: Token) => {
    //       return token.name.toLowerCase().includes(state.token.searchField.toLowerCase())
    //     });
    //   }
    // }
    case 42161: {
      if (state.token.filterBy === "Stablecoins") {
        return state.token.arbitrumTokens.filter((token: Token) => {
          return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Inactive") {
        return state.token.arbitrumTokens.filter((token: Token) => {
          return token.inactive && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Deposited") {
        return state.token.arbitrumTokens.filter((token: Token) => {
          return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else {
        return state.token.arbitrumTokens.filter((token: Token) => {
          return token.name.toLowerCase().includes(state.token.searchField.toLowerCase())
        });
      }
    }
    case 43114: {
      if (state.token.filterBy === "Stablecoins") {
        return state.token.avalancheTokens.filter((token: Token) => {
          return token.isStablecoin && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Inactive") {
        return state.token.avalancheTokens.filter((token: Token) => {
          return token.inactive && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else if (state.token.filterBy === "Deposited") {
        return state.token.avalancheTokens.filter((token: Token) => {
          return token.isDeposit && token.name.toLowerCase().includes(state.token.searchField.toLowerCase());
        });
      }
      else {
        return state.token.avalancheTokens.filter((token: Token) => {
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
// export const bscTest = (state: RootState) => { return state.token.bscTestTokens }
export const polygon = (state: RootState) => { return state.token.polygonTokens }
// export const goerli = (state: RootState) => { return state.token.goerliTokens }
// export const mumbai = (state: RootState) => { return state.token.mumbaiTokens }
export const avalanche = (state: RootState) => { return state.token.avalancheTokens }
export const arbitrum = (state: RootState) => { return state.token.arbitrumTokens }
export const sortBy = (state: RootState) => { return state.token.sortBy }
export const sortType = (state: RootState) => { return state.token.sortType }
export const nativeBalance = (state: RootState) => {
  const tokenArraysByNetworkId = {
    1: state.token.ethTokens,
    // 5: state.token.goerliTokens,
    10: state.token.mumbaiTokens,
    56: state.token.bscTokens,
    // 97: state.token.bscTestTokens,
    137: state.token.avalancheTokens,
    // 80001: state.token.mumbaiTokens,
    42161: state.token.arbitrumTokens,
    43114: state.token.avalancheTokens,
  };

  const selectedNetworkId = state.network.selectedNetwork.id;
  const selectedTokenArray = tokenArraysByNetworkId[selectedNetworkId];

  return selectedTokenArray.filter((token: Token) => {
    return token.isNative === true;
  });
}
export default tokenSlice.reducer;

// Thunk to get data from blockchain
// export const fetchTokensPricesGoerli = createAsyncThunk(
//   'token/getTokensPricesGoerli',
//   async (args: any, { getState }) => {
//     const state = getState() as any;
//     const providerInfura = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY);
//     const contractGoerli = new Contract(contractsAddresses["Goerli"][0].PriceOracle, OracleAbi, providerInfura);
//     const newGoerli = state.token.goerliTokens.map(async (token: any) => {
//       const goerliPrice = await contractGoerli.getAssetPrice(token.address);
//       if (token.isNative) {
//         return { ...token, tokenPrice: ethers.utils.formatUnits(goerliPrice, 8), deposits: "-" }
//       }
//       else {
//         const tokenContract = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, providerInfura);
//         const totalDeposits = await tokenContract.totalSupply();
//         const decimals = await tokenContract.decimals();
//         return { ...token, tokenPrice: ethers.utils.formatUnits(goerliPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
//       }
//     })
//     return Promise.all(newGoerli);
//   }
// )
export const fetchTokensPricesAvalanche = createAsyncThunk(
  'token/getTokensPricesAvalanche',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerAvalanche = new ethers.providers.JsonRpcProvider('https://avalanche-mainnet.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY);
    const contractAvalanche = new Contract(contractsAddresses["Avalanche"][0].PriceOracle, OracleAbi, providerAvalanche);
    const newAvalanche = state.token.avalancheTokens.map(async (token: any) => {
      const avalanchePrice = await contractAvalanche.getAssetPrice(token.address);
      if (token.isNative) {
        return { ...token, tokenPrice: ethers.utils.formatUnits(avalanchePrice, 8), deposits: "-" }
      }
      else {
        const tokenContract = new Contract(contractsAddresses["Avalanche"][0]["r" + token.name], RTokenAbi, providerAvalanche);
        const totalDeposits = await tokenContract.totalSupply();
        return { ...token, tokenPrice: ethers.utils.formatUnits(avalanchePrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, token.decimals) }
      }
    })
    return Promise.all(newAvalanche);
  }
)
export const fetchTokensPricesOptimism = createAsyncThunk(
  'token/getTokensPricesOptimism',
  async (args: any, { getState }) => {
    const state = getState() as any;
    //providerInfura
    // const providerOptimism = new ethers.providers.JsonRpcProvider('https://optimism-mainnet.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY);
    //provider Alchemy
    const providerOptimism = new ethers.providers.JsonRpcProvider('https://opt-mainnet.g.alchemy.com/v2/IZcTWl8yY9G_lnKiSJupPvSI-Q752SXj');

    const contractOptimism = new Contract(contractsAddresses["Optimism"][0].PriceOracle, OracleAbi, providerOptimism);
    const assetsPrices = await contractOptimism.getAssetsPrices(state.token.optimismTokens.map((token: any) => token.address));
    const newOptimism = state.token.optimismTokens.map(async (token: any, index: number) => {
      // Add a delay of 1 second before making each request
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (token.isNative) {
        return { ...token, tokenPrice: ethers.utils.formatUnits(assetsPrices[index], 8), deposits: "-" }
      }
      else {
        const tokenContract = new Contract(contractsAddresses["Optimism"][0]["r" + token.name], RTokenAbi, providerOptimism);
        const totalDeposits = await tokenContract.totalSupply();
        return { ...token, tokenPrice: ethers.utils.formatUnits(assetsPrices[index], 8), deposits: ethers.utils.formatUnits(totalDeposits, token.decimals) }
      }
    })
    return Promise.all(newOptimism);
  }
)
export const fetchTokensPricesArbitrum = createAsyncThunk(
  'token/getTokensPricesArbitrum',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerArbitrum = new ethers.providers.JsonRpcProvider('https://arbitrum-mainnet.infura.io/v3/' + process.env.REACT_APP_INFURA_KEY);
    const contractArbitrum = new Contract(contractsAddresses["Arbitrum"][0].PriceOracle, OracleAbi, providerArbitrum);
    const assetsPrices = await contractArbitrum.getAssetsPrices(state.token.arbitrumTokens.map((token: any) => token.address));
    const newArbitrum = state.token.arbitrumTokens.map(async (token: any, index: number) => {
      // const arbitrumPrice = await contractArbitrum.getAssetPrice(token.address);
      if (token.isNative) {
        return { ...token, tokenPrice: ethers.utils.formatUnits(assetsPrices[index], 8), deposits: "-" }
      }
      else {
        const tokenContract = new Contract(contractsAddresses["Arbitrum"][0]["r" + token.name], RTokenAbi, providerArbitrum);
        const totalDeposits = await tokenContract.totalSupply();
        return { ...token, tokenPrice: ethers.utils.formatUnits(assetsPrices[index], 8), deposits: ethers.utils.formatUnits(totalDeposits, token.decimals) }
      }
    })
    return Promise.all(newArbitrum);
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
        const rTokenContract = new Contract(contractsAddresses["Ethereum"][0]["r" + token.name], RTokenAbi, providerInfura);
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
      const tokenContract = new Contract(contractsAddresses["Polygon"][0]["r" + token.name], RTokenAbi, providerPolygon);
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
// export const fetchTokensPricesMumbai = createAsyncThunk(
//   'token/getTokensPricesMumbai',
//   async (args: any, { getState }) => {
//     const state = getState() as any;
//     const providerMumbai = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.g.alchemy.com/v2/' + process.env.REACT_APP_MUMBAI_KEY);
//     const contractMumbai = new Contract(contractsAddresses["Polygon Mumbai"][0].PriceOracle, OracleAbi, providerMumbai);
//     const newMumbai = state.token.mumbaiTokens.map(async (token: any) => {
//       const tokenContract = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, providerMumbai);
//       const mumbaiPrice = await contractMumbai.getAssetPrice(token.address);
//       if (token.isNative) {
//         return { ...token, tokenPrice: ethers.utils.formatUnits(mumbaiPrice, 8), deposits: "-" }
//       }
//       else {
//         const decimals = await tokenContract.decimals();
//         const totalDeposits = await tokenContract.totalSupply();
//         return { ...token, tokenPrice: ethers.utils.formatUnits(mumbaiPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
//       }
//     });

//     return Promise.all(newMumbai);
//   }
// )
// export const fetchTokensPricesBscT = createAsyncThunk(
//   'token/getTokensPricesBscT',
//   async (args: any, { getState }) => {
//     const state = getState() as any;
//     const providerBsc = new ethers.providers.JsonRpcProvider('https://practical-cold-owl.bsc-testnet.discover.quiknode.pro/' + process.env.REACT_APP_QUICK_NODE_KEY);
//     const contractBsc = new Contract(contractsAddresses["Binance Smart Chain Testnet"][0].PriceOracle, OracleAbi, providerBsc);
//     const newBsc = state.token.bscTestTokens.map(async (token: any) => {
//       const tokenContract = new Contract(contractsAddresses["Binance Smart Chain Testnet"][0]["r" + token.name], RTokenAbi, providerBsc);
//       const bscPrice = await contractBsc.getAssetPrice(token.address);
//       if (token.isNative) {
//         return { ...token, tokenPrice: ethers.utils.formatUnits(bscPrice, 8), deposits: "-" }
//       }
//       else {
//         const totalDeposits = await tokenContract.totalSupply();
//         const decimals = await tokenContract.decimals();
//         return { ...token, tokenPrice: ethers.utils.formatUnits(bscPrice, 8), deposits: ethers.utils.formatUnits(totalDeposits, decimals) }
//       }
//     })
//     return Promise.all(newBsc);
//   }
// )
export const fetchTokensPricesBsc = createAsyncThunk(
  'token/getTokensPricesBsc',
  async (args: any, { getState }) => {
    const state = getState() as any;
    const providerBsc = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org');
    const contractBsc = new Contract(contractsAddresses["Binance Smart Chain"][0].PriceOracle, OracleAbi, providerBsc);
    const newBsc = state.token.bscTokens.map(async (token: any) => {
      const tokenContract = new Contract(contractsAddresses["Binance Smart Chain"][0]["r" + token.name], RTokenAbi, providerBsc);
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
// export const fetchUserBalanceGoerli = createAsyncThunk(
//   'token/getUserBalanceGoerli',
//   async (data: any, { getState }) => {
//     const state = getState() as any;
//     const { provider, address } = data;
//     const newTokens = state.token.goerliTokens.map(async (token: Token) => {
//       const contractRToken = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, provider);
//       if (token.isNative) {
//         const userBalance = await provider.getBalance(address);
//         return { ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatEther(userBalance) }
//       }
//       else {
//         const contractToken = new Contract(token.address, RTokenAbi, provider);
//         const userBalanceToken = await contractToken.balanceOf(address);
//         const userBalanceDeposit = await contractRToken.balanceOf(address);
//         return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals), isDeposit: userBalanceDeposit.gt(0) }
//       }

//     })
//     return Promise.all(newTokens);
//   }
// )
export const fetchUserBalanceAvalanche = createAsyncThunk(
  'token/getUserBalanceAvalanche',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { provider, address } = data;
    const newTokens = state.token.avalancheTokens.map(async (token: Token) => {
      const contractRToken = new Contract(contractsAddresses["Avalanche"][0]["r" + token.name], RTokenAbi, provider);
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
export const fetchUserBalanceArbitrum = createAsyncThunk(
  'token/getUserBalanceArbitrum',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { provider, address } = data;
    const newTokens = state.token.arbitrumTokens.map(async (token: Token) => {
      const contractRToken = new Contract(contractsAddresses["Arbitrum"][0]["r" + token.name], RTokenAbi, provider);
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
      const contractRToken = new Contract(contractsAddresses["Ethereum"][0]["r" + token.name], RTokenAbi, provider);
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
export const fetchUserBalanceOptimism = createAsyncThunk(
  'token/getUserBalanceOptimism',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { address } = data;
    const provider = new ethers.providers.JsonRpcProvider('https://opt-mainnet.g.alchemy.com/v2/IZcTWl8yY9G_lnKiSJupPvSI-Q752SXj');
    const newTokens = state.token.optimismTokens.map(async (token: Token) => {
      const contractRToken = new Contract(contractsAddresses["Optimism"][0]["r" + token.name], RTokenAbi, provider);
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
// export const fetchUserBalanceOptimism = createAsyncThunk(
//   'token/getUserBalanceOptimism',
//   async (data: any, { getState }) => {
//     const state = getState() as any;
//     const { provider, address } = data;
//     const newTokens = [];
//     for (const token of state.token.optimismTokens) {
//       const contractRToken = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, provider);
//       if (token.isNative) {
//         const userBalance = await provider.getBalance(address);
//         newTokens.push({ ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatEther(userBalance) });
//       } else {
//         const contractToken = new Contract(token.address, RTokenAbi, provider);
//         const userBalanceToken = await contractToken.balanceOf(address);
//         const userBalanceDeposit = await contractRToken.balanceOf(address);
//         newTokens.push({ ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals), isDeposit: userBalanceDeposit.gt(0) });
//       }
//       await new Promise(resolve => setTimeout(resolve, 1000)); // add a 1 second delay between requests
//     }
//     return newTokens;
//   }
// );
// export const fetchUserBalanceOptimism = createAsyncThunk(
//   'token/getUserBalanceOptimism',
//   async (data: any, { getState }) => {
//     const state = getState() as any;
//     const { provider, address } = data;
//     const newTokens = state.token.optimismTokens.map(async (token: Token, index:number) => {
//       const delay = index * 1000; // add a delay that increases with each iteration
//       await new Promise(resolve => setTimeout(resolve, delay));
//       const contractRToken = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, provider);
//       if (token.isNative) {
//         const userBalance = await provider.getBalance(address);
//         return  { ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatEther(userBalance) }
//       }
//       else {
//         const contractToken = new Contract(token.address, RTokenAbi, provider);
//         const userBalanceToken = await contractToken.balanceOf(address);
//         const userBalanceDeposit = await contractRToken.balanceOf(address);
//         return  { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals), isDeposit: userBalanceDeposit.gt(0) }
//       }

//     })
//     return Promise.all(newTokens);
//   }
// )
// export const fetchUserBalanceBscT = createAsyncThunk(
//   'token/getUserBalanceBscT',
//   async (data: any, { getState }) => {
//     const state = getState() as any;
//     const { provider, address } = data;
//     const newTokens = state.token.bscTestTokens.map(async (token: any) => {
//       const contractRToken = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, provider);
//       if (token.isNative) {
//         const userBalance = await provider.getBalance(address);
//         return { ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatUnits(userBalance) }
//       }
//       else {
//         const contractToken = new Contract(token.address, RTokenAbi, provider);
//         const userBalanceToken = await contractToken.balanceOf(address);
//         const userBalanceDeposit = await contractRToken.balanceOf(address);
//         return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals), isDeposit: userBalanceDeposit.gt(0) }
//       }
//     })
//     return Promise.all(newTokens);
//   }
// )
export const fetchUserBalanceBsc = createAsyncThunk(
  'token/getUserBalanceBsc',
  async (data: any, { getState }) => {
    const state = getState() as any;
    const { provider, address } = data;
    const newTokens = state.token.bscTokens.map(async (token: any) => {
      const contractRToken = new Contract(contractsAddresses["Binance Smart Chain"][0]["r" + token.name], RTokenAbi, provider);
      if (token.isNative) {
        const userBalance = await provider.getBalance(address);
        return { ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatUnits(userBalance) }
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
        return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals), isDeposit: userBalanceDeposit.gt(0) }
      }
    })
    return Promise.all(newTokens);
  }
)
export const fetchUserBalanceSingleToken = createAsyncThunk(
  'token/getUserBalanceSingleToken',
  async (data: any, { getState }) => {
    const { address, token, networkName, provider } = data;
    console.log(address, token, networkName)
    const contractRToken = new Contract(contractsAddresses[networkName][0]["r" + token.name], RTokenAbi, provider);
    const contractToken = new Contract(token.address, RTokenAbi, provider);
    const userBalanceDeposit = await contractRToken.balanceOf(address);
    const userBalance = await provider.getBalance(address);
    const userBalanceToken = await contractToken.balanceOf(address);
    const newToken = { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalance, token.decimals), userBalance:token.isNative ? ethers.utils.formatUnits(userBalanceToken, token.decimals) : ethers.utils.formatUnits(userBalanceToken, token.decimals), isDeposit: userBalanceDeposit.gt(0) }
    Promise.resolve(newToken);
    return { token: newToken, network: networkName }
  }
)
export const fetchTokensPricesSingleToken = createAsyncThunk(
  'token/fetchTokensPricesSingleToken',
  async (args: any, { getState }) => {
    try {
      const { token, networkName, provider } = args;
      const contractAddress = contractsAddresses[networkName][0]['r' + token.name];
      const tokenContract = new Contract(contractAddress, RTokenAbi, provider);
      const totalSupply = await tokenContract.totalSupply();
      const decimals = await tokenContract.decimals();
      const deposits = token.isNative ? '-' : ethers.utils.formatUnits(totalSupply, decimals);
      const newToken = { ...token, deposits };

      return { token: newToken, network: networkName };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);
// export const fetchUserBalanceMumbai = createAsyncThunk(
//   'token/getUserBalanceMumbai',
//   async (data: any, { getState }) => {
//     const state = getState() as any;
//     const { provider, address } = data;
//     const newTokens = state.token.mumbaiTokens.map(async (token: Token) => {
//       if (token.isNative) {
//         const userBalance = await provider.getBalance(address);
//         return { ...token, userBalanceDeposit: "0", userBalance: ethers.utils.formatUnits(userBalance, 18) }
//       }
//       else {
//         const contractRToken = new Contract(contractsAddresses[state.network.selectedNetwork.name][0]["r" + token.name], RTokenAbi, provider);
//         const contractToken = new Contract(token.address, RTokenAbi, provider);
//         const userBalanceToken = await contractToken.balanceOf(address);
//         const userBalanceDeposit = await contractRToken.balanceOf(address);
//         return { ...token, userBalanceDeposit: ethers.utils.formatUnits(userBalanceDeposit, token.decimals), userBalance: ethers.utils.formatUnits(userBalanceToken, token.decimals), isDeposit: userBalanceDeposit.gt(0) }
//       }
//     })
//     return Promise.all(newTokens);
//   }
// )
