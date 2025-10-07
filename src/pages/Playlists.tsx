import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/Layout";
import PlaylistCard from "../components/PlaylistCard";
import MusicCard from "../components/MusicCard";
import type { Playlist } from "../redux/playlistsSlice";
import { addPlaylist, updatePlaylist, deletePlaylist, addMusicToPlaylist, removeMusicFromPlaylist } from "../redux/playlistsSlice";
import type { RootState } from "../redux/store";
import "./Playlists.css";

const Playlists = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const allPlaylists = useSelector((state: RootState) => state.playlists.playlists);
    
    // Filter playlists for current user
    const userPlaylists = allPlaylists.filter((p) => p.usuarioId === user);

    const [showModal, setShowModal] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
    const [playlistName, setPlaylistName] = useState("");
    const [viewingPlaylist, setViewingPlaylist] = useState<Playlist | null>(null);

    useEffect(() => {
        // Check for pending music add from sessionStorage
        const pending = sessionStorage.getItem("pendingMusicAdd");
        if (pending) {
            const { playlistId, music } = JSON.parse(pending);
            dispatch(addMusicToPlaylist({ playlistId, music }));
            sessionStorage.removeItem("pendingMusicAdd");
            sessionStorage.setItem("lastAccessedPlaylist", playlistId);
        }
    }, [dispatch]);

    const handleCreatePlaylist = () => {
        setEditingPlaylist(null);
        setPlaylistName("");
        setShowModal(true);
    };

    const handleEditPlaylist = (playlist: Playlist) => {
        setEditingPlaylist(playlist);
        setPlaylistName(playlist.nome);
        setShowModal(true);
    };

    const handleSavePlaylist = () => {
        if (!playlistName.trim()) {
            alert("Por favor, insira um nome para a playlist!");
            return;
        }

        if (editingPlaylist) {
            dispatch(updatePlaylist({ ...editingPlaylist, nome: playlistName }));
        } else {
            dispatch(addPlaylist({
                nome: playlistName,
                usuarioId: user || "",
                musicas: [],
            }));
        }

        setShowModal(false);
        setPlaylistName("");
        setEditingPlaylist(null);
    };

    const handleDeletePlaylist = (playlistId: string) => {
        if (confirm("Tem certeza que deseja excluir esta playlist?")) {
            dispatch(deletePlaylist(playlistId));
            if (viewingPlaylist?.id === playlistId) {
                setViewingPlaylist(null);
            }
        }
    };

    const handleViewPlaylist = (playlist: Playlist) => {
        setViewingPlaylist(playlist);
        sessionStorage.setItem("lastAccessedPlaylist", playlist.id);
    };

    const handleRemoveMusicFromPlaylist = (musicId: string) => {
        if (viewingPlaylist && confirm("Remover esta música da playlist?")) {
            dispatch(removeMusicFromPlaylist({ playlistId: viewingPlaylist.id, musicId }));
            // Update viewing playlist with fresh data
            const updated = allPlaylists.find((p) => p.id === viewingPlaylist.id);
            if (updated) {
                setViewingPlaylist(updated);
            }
        }
    };

    return (
        <Layout>
            <div className="playlists-page">
                <div className="playlists-header">
                    <h1>Minhas Playlists</h1>
                    <button onClick={handleCreatePlaylist} className="btn-create">
                        + Nova Playlist
                    </button>
                </div>

                {userPlaylists.length === 0 && (
                    <div className="empty-state">
                        <p>Você ainda não tem playlists.</p>
                        <p>Crie sua primeira playlist para começar!</p>
                    </div>
                )}

                {!viewingPlaylist && userPlaylists.length > 0 && (
                    <div className="playlists-grid">
                        {userPlaylists.map((playlist) => (
                            <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                                onEdit={handleEditPlaylist}
                                onDelete={handleDeletePlaylist}
                                onView={handleViewPlaylist}
                            />
                        ))}
                    </div>
                )}

                {viewingPlaylist && (
                    <div className="playlist-detail">
                        <div className="playlist-detail-header">
                            <div>
                                <h2>{viewingPlaylist.nome}</h2>
                                <p>{viewingPlaylist.musicas.length} músicas</p>
                            </div>
                            <button onClick={() => setViewingPlaylist(null)} className="btn-back">
                                ← Voltar
                            </button>
                        </div>

                        {viewingPlaylist.musicas.length === 0 ? (
                            <div className="empty-playlist">
                                <p>Esta playlist está vazia.</p>
                                <p>Adicione músicas através da página "Buscar Músicas" ou "Início".</p>
                            </div>
                        ) : (
                            <div className="music-grid">
                                {viewingPlaylist.musicas.map((music) => (
                                    <MusicCard
                                        key={music.id}
                                        music={music}
                                        onRemove={handleRemoveMusicFromPlaylist}
                                        showRemoveButton={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h2>{editingPlaylist ? "Editar Playlist" : "Nova Playlist"}</h2>
                            <input
                                type="text"
                                placeholder="Nome da playlist"
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                                className="modal-input"
                                autoFocus
                            />
                            <div className="modal-actions">
                                <button onClick={() => setShowModal(false)} className="btn-cancel">
                                    Cancelar
                                </button>
                                <button onClick={handleSavePlaylist} className="btn-save">
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Playlists;

