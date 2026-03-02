import { createSlice } from "@reduxjs/toolkit";

// Rehydrate from localStorage on startup
const storedUser = (() => {
  try { return JSON.parse(localStorage.getItem("auth_user")); } catch { return null; }
})();

const initialState = {
  user: storedUser || null,
  isAuthenticated: !!storedUser,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      // Support both { user, accessToken } shape and plain user object
      const userData = user ?? action.payload;
      state.user = userData;
      state.isAuthenticated = true;
      localStorage.setItem("auth_user", JSON.stringify(userData));
      if (accessToken) localStorage.setItem("access_token", accessToken);
      if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth_user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("auth_user", JSON.stringify(state.user));
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

// ── Selectors ──
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;

export default authSlice.reducer;
