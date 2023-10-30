import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../slices/apiSlice';
import { rotaSlice } from '../slices/rotaSlice';
import { demoDataSlice } from '../slices/demoSlice';
import authReducer from '../slices/authSlice';
import paramsReducer from '../slices/paramsSlice';
import selectionsReducer from '../slices/selectionsSlice';

export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [rotaSlice.reducerPath]: rotaSlice.reducer,
    [demoDataSlice.reducerPath]: demoDataSlice.reducer,
    auth: authReducer,
    params: paramsReducer,
    selections: selectionsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      apiSlice.middleware,
      rotaSlice.middleware,
      demoDataSlice.middleware
    ])
});
