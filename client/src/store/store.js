import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../slices/apiSlice';
import { rotaSlice } from '../slices/rotaSlice';
import authReducer from '../slices/authSlice';
import paramsReducer from '../slices/paramsSlice';
import selectionsReducer from '../slices/selectionsSlice';

export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [rotaSlice.reducerPath]: rotaSlice.reducer,
    auth: authReducer,
    params: paramsReducer,
    selections: selectionsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([apiSlice.middleware, rotaSlice.middleware])
});
