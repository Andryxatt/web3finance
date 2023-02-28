import {  createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface TransactionInfo {
    txHash: string;
    txStatus: string;
    txType: string;
    blockNumber: number;
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


