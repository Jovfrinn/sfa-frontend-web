import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    restoreSession: (state, action) => {
      const { user, token } = action.payload;

      if (user && token) {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      }
      state.isLoading = false;
    },
  },
});

export const { loginSuccess, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
