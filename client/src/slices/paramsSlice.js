import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  getObsParams: {
    page: 1,
    dataId: null,
    query: '',
    sort: '',
    filter: ''
  }
};

const paramsSlice = createSlice({
  name: 'params',
  initialState,
  reducers: {
    setGetObsParams: (state, action) => {
      state.getObsParams.page = action.payload.page;
      state.getObsParams.dataId = action.payload.dataId;
      state.getObsParams.query = action.payload.query;
      state.getObsParams.sort = action.payload.sort;
      state.getObsParams.filter = action.payload.filter;
    }
  }
});

export const { setGetObsParams } = paramsSlice.actions;

export default paramsSlice.reducer;

export const selectGetObsParams = (state) => state.params.getObsParams;
