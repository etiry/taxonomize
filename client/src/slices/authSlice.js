import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, email: null },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.email = null;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.signin.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
        state.email = payload.email;
      }
    );
    builder.addMatcher(
      apiSlice.endpoints.signup.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
      }
    );
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentUserEmail = (state) => state.auth.email;
