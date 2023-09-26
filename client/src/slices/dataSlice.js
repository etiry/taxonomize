import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    id: null,
    name: null,
    taxonomy: null,
    completed: null
  },
  reducers: {
    setCurrentData: (state, action) => {
      state.id = action.payload._id;
      state.name = action.payload.name;
      state.taxonomy = action.payload.taxonomy;
      state.completed = action.payload.completed;
    }
  }
});

export const { setCurrentData } = dataSlice.actions;

export default dataSlice.reducer;

export const selectCurrentData = (state) => state.data;
