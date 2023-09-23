import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.signin.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
      }
    );
  }
});

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
