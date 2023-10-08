import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../slices/apiSlice';
import authReducer from '../slices/authSlice';
import paramsReducer from '../slices/paramsSlice';
import selectionsReducer from '../slices/selectionsSlice';

export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    params: paramsReducer,
    selections: selectionsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware)
});
