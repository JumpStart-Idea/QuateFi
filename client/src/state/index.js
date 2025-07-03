import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark", // Default mode, will be overridden by App.js useEffect
  userId: "63701cc1f03239b7f700000e",
  user: typeof window !== 'undefined' && localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  token: typeof window !== 'undefined' && localStorage.getItem("token") ? localStorage.getItem("token") : null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state, action) => {
      if (action.payload) {
        state.mode = action.payload;
      } else {
        state.mode = state.mode === "light" ? "dark" : "light";
      }
      
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("themeMode", state.mode);
      }
    },
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.userId = action.payload.user && action.payload.user._id ? action.payload.user._id : null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userId = null;
    },
    register: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

export const { setMode, login, logout, register } = globalSlice.actions;

export default globalSlice.reducer;
