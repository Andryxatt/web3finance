import {  createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface TransactionInfo {
  transactionHash: string;
  event: string;
    blockNumber: number;
    timestamp: number;
    data: string;
}
export interface HistoryState {
    transactions: TransactionInfo[];
    isLoading: boolean;
    error: string;
}

const initialState: HistoryState = {
    transactions: [],
    isLoading: true,
    error: '',
  };

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadTransactionHistory: (state, action: PayloadAction<TransactionInfo[]>) => {
        state.transactions = action.payload;
        state.isLoading = false;
    },
    sortByDate: (state) => {
        state.transactions = state.transactions.sort((a, b) => {
            return a.timestamp - b.timestamp;
        });
    }
  },
  extraReducers: (builder) => {
   
  }
});
export const {
    loadTransactionHistory
   } = userSlice.actions;

export const allTransactions = (state: RootState) => state.user.transactions;

export default userSlice.reducer;

// Thunk to get data from blockchain


