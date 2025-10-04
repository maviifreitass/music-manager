import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import playlistsReducer from "./playlistsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        playlists: playlistsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
