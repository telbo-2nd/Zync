import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");

const initialState = {
    token: token || null,
    user: null,
    isAuthenticated: !!token,
    };

    const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
    setCredentials: (state, action) => {
    state.token = action.payload.token;
    state.user = action.payload.user;
    state.isAuthenticated = true;
    localStorage.setItem("token", action.payload.token);
    },
    setUser: (state, action) => {
    state.user = action.payload;
    },
    logout: (state) => {
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;
    localStorage.removeItem("token");
    },
},
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;