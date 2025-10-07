import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoSearch, IoClose, IoAdd, IoCheckmark } from "react-icons/io5";
import Layout from "../components/Layout";
import PlaylistCard from "../components/PlaylistCard";
import MusicCard from "../components/MusicCard";
import type { Playlist, Music } from "../redux/playlistsSlice";
import { addPlaylist, updatePlaylist, deletePlaylist, addMusicToPlaylist, removeMusicFromPlaylist } from "../redux/playlistsSlice";
import type { RootState } from "../redux/store";
import { audioDbApi, type AudioDbTrack } from "../services/audioDbApi";
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
    
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Music[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [selectedMusics, setSelectedMusics] = useState<Music[]>([]);

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
        setSelectedMusics([]);
        setSearchQuery("");
        setSearchResults([]);
        setShowModal(true);
    };

    const handleEditPlaylist = (playlist: Playlist) => {
        setEditingPlaylist(playlist);
        setPlaylistName(playlist.nome);
        setSelectedMusics([...playlist.musicas]);
        setSearchQuery("");
        setSearchResults([]);
        setShowModal(true);
    };

    const handleSavePlaylist = () => {
        if (!playlistName.trim()) {
            alert("Por favor, insira um nome para a playlist!");
            return;
        }

        if (editingPlaylist) {
            dispatch(updatePlaylist({ 
                ...editingPlaylist, 
                nome: playlistName,
                musicas: selectedMusics 
            }));
        } else {
            dispatch(addPlaylist({
                nome: playlistName,
                usuarioId: user || "",
                musicas: selectedMusics,
            }));
        }

        setShowModal(false);
        setPlaylistName("");
        setEditingPlaylist(null);
        setSelectedMusics([]);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleSearchMusic = async () => {
        if (!searchQuery.trim()) {
            alert("Digite o nome de um artista para buscar!");
            return;
        }

        setLoadingSearch(true);
        try {
            const tracks = await audioDbApi.getTopTracks(searchQuery);
            const formattedTracks = tracks.map(convertToMusic);
            setSearchResults(formattedTracks);
        } catch (err) {
            console.error("Erro ao buscar músicas:", err);
            alert("Erro ao buscar músicas. Tente novamente.");
        } finally {
            setLoadingSearch(false);
        }
    };

    const convertToMusic = (track: AudioDbTrack): Music => ({
        id: track.idTrack,
        nome: track.strTrack,
        artista: track.strArtist,
        genero: track.strGenre || "Desconhecido",
        ano: track.intYearReleased || "N/A",
        album: track.strAlbum,
        thumb: track.strTrackThumb,
    });

    const handleAddMusicToSelection = (music: Music) => {
        const alreadySelected = selectedMusics.some(m => m.id === music.id);
        if (alreadySelected) {
            alert("Esta música já foi adicionada!");
            return;
        }
        setSelectedMusics([...selectedMusics, music]);
    };

    const handleRemoveMusicFromSelection = (musicId: string) => {
        setSelectedMusics(selectedMusics.filter(m => m.id !== musicId));
    };

    const isMusicSelected = (musicId: string) => {
        return selectedMusics.some(m => m.id === musicId);
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
                        <div className="modal-playlist-create" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingPlaylist ? "Editar Playlist" : "Nova Playlist"}</h2>
                                <button onClick={() => setShowModal(false)} className="btn-close-modal">
                                    <IoClose />
                                </button>
                            </div>

                            <div className="modal-body">
                                {/* Nome da Playlist */}
                                <div className="form-section">
                                    <label>Nome da Playlist</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Minhas favoritas"
                                        value={playlistName}
                                        onChange={(e) => setPlaylistName(e.target.value)}
                                        className="modal-input"
                                        autoFocus
                                    />
                                </div>

                                {/* Músicas Selecionadas */}
                                <div className="form-section">
                                    <label>Músicas Selecionadas ({selectedMusics.length})</label>
                                    {selectedMusics.length === 0 ? (
                                        <p className="no-music-text">Nenhuma música selecionada ainda</p>
                                    ) : (
                                        <div className="selected-musics-list">
                                            {selectedMusics.map((music) => (
                                                <div key={music.id} className="selected-music-item">
                                                    <div className="music-info">
                                                        <span className="music-name">{music.nome}</span>
                                                        <span className="music-artist">{music.artista}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleRemoveMusicFromSelection(music.id)}
                                                        className="btn-remove-music"
                                                        title="Remover"
                                                    >
                                                        <IoClose />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Busca de Músicas */}
                                <div className="form-section">
                                    <label>Adicionar Músicas da API</label>
                                    <div className="search-music-bar">
                                        <input
                                            type="text"
                                            placeholder="Buscar por artista (ex: Coldplay)"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && handleSearchMusic()}
                                            className="search-music-input"
                                        />
                                        <button 
                                            onClick={handleSearchMusic} 
                                            className="btn-search-music"
                                            disabled={loadingSearch}
                                        >
                                            {loadingSearch ? "..." : <IoSearch />}
                                        </button>
                                    </div>

                                    {searchResults.length > 0 && (
                                        <div className="search-results-list">
                                            {searchResults.map((music) => {
                                                const isSelected = isMusicSelected(music.id);
                                                return (
                                                    <div 
                                                        key={music.id} 
                                                        className={`search-result-item ${isSelected ? "selected" : ""}`}
                                                    >
                                                        <div className="music-info">
                                                            <span className="music-name">{music.nome}</span>
                                                            <span className="music-artist">{music.artista}</span>
                                                        </div>
                                                        <button 
                                                            onClick={() => isSelected 
                                                                ? handleRemoveMusicFromSelection(music.id)
                                                                : handleAddMusicToSelection(music)
                                                            }
                                                            className={`btn-add-music ${isSelected ? "selected" : ""}`}
                                                            title={isSelected ? "Remover" : "Adicionar"}
                                                        >
                                                            {isSelected ? <IoCheckmark /> : <IoAdd />}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button onClick={() => setShowModal(false)} className="btn-cancel">
                                    Cancelar
                                </button>
                                <button onClick={handleSavePlaylist} className="btn-save">
                                    {editingPlaylist ? "Salvar Alterações" : "Criar Playlist"}
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

