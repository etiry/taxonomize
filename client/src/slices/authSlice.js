import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';

const loggedInUserId = localStorage.getItem('taxonomizeId');
const loggedInUserEmail = localStorage.getItem('taxonomizeEmail');
const loggedInUserToken = localStorage.getItem('taxonomizeToken');
const loggedInUserTeam = JSON.parse(localStorage.getItem('taxonomizeTeam'));

const initialState = {
  id: loggedInUserId || null,
  email: loggedInUserEmail || null,
  token: loggedInUserToken || null,
  team: {
    id: loggedInUserTeam.id || null,
    name: loggedInUserTeam.name || null
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.id = null;
      state.token = null;
      state.email = null;
      state.team.id = null;
      state.team.name = null;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.signin.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.id = payload.id;
        state.email = payload.email;
        state.team.id = payload.team.id;
        state.team.name = payload.team.name;
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
export const selectCurrentUserTeam = (state) => state.auth.team;
