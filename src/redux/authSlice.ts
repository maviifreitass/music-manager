import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    user: string | null;
}

const initialState: AuthState = {
    isAuthenticated: !!sessionStorage.getItem("user"),
    user: sessionStorage.getItem("user"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            sessionStorage.setItem("user", action.payload);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            sessionStorage.removeItem("user");
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
