import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import  networkReducer  from '../store/network/networkSlice';
import tokenReducer from '../store/token/tokenSlice';
import multiDepositReducer from './multiDeposit/multiDepositSlice';
import userReducer from './user/userSlice';
export const store = configureStore({
  
  reducer: {
    // Add your reducers here
    network: networkReducer,
    token: tokenReducer,
    multiDeposit: multiDepositReducer,
    user: userReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;



export default store;


