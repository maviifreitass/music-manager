import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Music {
    id: string;
    nome: string;
    artista: string;
    genero: string;
    ano: string;
    album?: string;
    thumb?: string;
}

export interface Playlist {
    id: string;
    nome: string;
    usuarioId: string;
    musicas: Music[];
}

interface PlaylistsState {
    playlists: Playlist[];
}

const loadPlaylistsFromStorage = (): Playlist[] => {
    const stored = localStorage.getItem("playlists");
    return stored ? JSON.parse(stored) : [];
};

const savePlaylistsToStorage = (playlists: Playlist[]) => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
};

const initialState: PlaylistsState = {
    playlists: loadPlaylistsFromStorage(),
};

const playlistsSlice = createSlice({
    name: "playlists",
    initialState,
    reducers: {
        addPlaylist: (state, action: PayloadAction<Omit<Playlist, "id">>) => {
            const newPlaylist: Playlist = {
                ...action.payload,
                id: Date.now().toString(),
            };
            state.playlists.push(newPlaylist);
            savePlaylistsToStorage(state.playlists);
        },
        updatePlaylist: (state, action: PayloadAction<Playlist>) => {
            const index = state.playlists.findIndex((p) => p.id === action.payload.id);
            if (index !== -1) {
                state.playlists[index] = action.payload;
                savePlaylistsToStorage(state.playlists);
            }
        },
        deletePlaylist: (state, action: PayloadAction<string>) => {
            state.playlists = state.playlists.filter((p) => p.id !== action.payload);
            savePlaylistsToStorage(state.playlists);
        },
        addMusicToPlaylist: (state, action: PayloadAction<{ playlistId: string; music: Music }>) => {
            const playlist = state.playlists.find((p) => p.id === action.payload.playlistId);
            if (playlist) {
                const musicExists = playlist.musicas.some((m) => m.id === action.payload.music.id);
                if (!musicExists) {
                    playlist.musicas.push(action.payload.music);
                    savePlaylistsToStorage(state.playlists);
                }
            }
        },
        removeMusicFromPlaylist: (state, action: PayloadAction<{ playlistId: string; musicId: string }>) => {
            const playlist = state.playlists.find((p) => p.id === action.payload.playlistId);
            if (playlist) {
                playlist.musicas = playlist.musicas.filter((m) => m.id !== action.payload.musicId);
                savePlaylistsToStorage(state.playlists);
            }
        },
    },
});

export const { addPlaylist, updatePlaylist, deletePlaylist, addMusicToPlaylist, removeMusicFromPlaylist } = playlistsSlice.actions;
export default playlistsSlice.reducer;

