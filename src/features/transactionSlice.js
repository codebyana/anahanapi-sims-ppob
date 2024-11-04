import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    addTransaction(state, action) {
      state.transactions.push(action.payload);
    },
    setTransactions(state, action) {
      state.transactions = action.payload;
    },
  },
});

export const { addTransaction, setTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
