import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // { username, email, phoneNumber, displayName, uid, provider }
  token: null, // Firebase ID token or custom token
  loading: false,
  error: null, // { message, code }
  isAuthenticated: false,
  resetPassword: {
    loading: false,
    error: null,
    success: false,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login Actions
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user; // Structured user object
      state.token = action.payload.token || null; // Optional token
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // { message, code }
    },

    // Registration Actions
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Password Reset Actions
    resetPasswordStart: (state) => {
      state.resetPassword.loading = true;
      state.resetPassword.error = null;
      state.resetPassword.success = false;
    },
    resetPasswordSuccess: (state) => {
      state.resetPassword.loading = false;
      state.resetPassword.success = true;
      state.resetPassword.error = null;
    },
    resetPasswordFailure: (state, action) => {
      state.resetPassword.loading = false;
      state.resetPassword.error = action.payload;
      state.resetPassword.success = false;
    },

    // Logout and Error Clearing
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.resetPassword = initialState.resetPassword;
    },
    clearError: (state) => {
      state.error = null;
      state.resetPassword.error = null;
    },
    updateUser: (state, action) => {
    state.user = { ...state.user, ...action.payload };
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  resetPasswordStart,
  resetPasswordSuccess,
  resetPasswordFailure,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;