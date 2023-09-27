import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    id: null,
    name: null,
    taxonomy: {
      id: null,
      name: null
    },
    completed: null,
    observations: []
  },
  reducers: {
    setCurrentData: (state, action) => {
      state.id = action.payload._id;
      state.name = action.payload.name;
      state.taxonomy.id = action.payload.taxonomy._id;
      state.taxonomy.name = action.payload.taxonomy.name;
      state.completed = action.payload.completed;
      state.observations = action.payload.observations;
    }
  }
});

export const { setCurrentData } = dataSlice.actions;

export default dataSlice.reducer;

export const selectCurrentData = (state) => state.data;
