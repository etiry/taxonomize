import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

const authSlice = createSlice({
  name: 'auth',
  initialState: { id: null, token: null, email: null },
  reducers: {
    logout: (state) => {
      state.id = null;
      state.token = null;
      state.email = null;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.signin.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.id = payload.id;
        state.email = payload.email;
      }
    );
    builder.addMatcher(
      apiSlice.endpoints.signup.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.id = payload.id;
        state.email = payload.email;
      }
    );
  }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.id;
export const selectCurrentUserEmail = (state) => state.auth.email;
