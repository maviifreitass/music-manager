import { useState } from "react";
import type { Playlist } from "../redux/playlistsSlice";
import "./PlaylistSelectModal.css";

interface PlaylistSelectModalProps {
    isOpen: boolean;
    playlists: Playlist[];
    musicName: string;
    onClose: () => void;
    onSelect: (playlistId: string) => void;
}

const PlaylistSelectModal: React.FC<PlaylistSelectModalProps> = ({
    isOpen,
    playlists,
    musicName,
    onClose,
    onSelect,
}) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!selectedPlaylist) {
            alert("Por favor, selecione uma playlist!");
            return;
        }
        onSelect(selectedPlaylist);
        setSelectedPlaylist("");
        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setSelectedPlaylist("");
            onClose();
        }
    };

    return (
        <div className="playlist-select-overlay" onClick={handleOverlayClick}>
            <div className="playlist-select-modal">
                <div className="playlist-select-header">
                    <h2>Adicionar à Playlist</h2>
                    <button onClick={onClose} className="modal-close-btn">
                        ✕
                    </button>
                </div>

                <div className="playlist-select-content">
                    <p className="selected-music">
                        <strong>Música:</strong> {musicName}
                    </p>

                    {playlists.length === 0 ? (
                        <div className="no-playlists">
                            <p>Você ainda não tem playlists.</p>
                            <p>Crie uma playlist primeiro na página "Playlists".</p>
                        </div>
                    ) : (
                        <div className="playlists-list">
                            <label className="playlists-label">Selecione uma playlist:</label>
                            {playlists.map((playlist) => (
                                <div
                                    key={playlist.id}
                                    className={`playlist-option ${selectedPlaylist === playlist.id ? "selected" : ""}`}
                                    onClick={() => setSelectedPlaylist(playlist.id)}
                                >
                                    <div className="playlist-option-info">
                                        <span className="playlist-option-name">{playlist.nome}</span>
                                        <span className="playlist-option-count">
                                            {playlist.musicas.length} música{playlist.musicas.length !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                    <div className="playlist-option-radio">
                                        {selectedPlaylist === playlist.id && <span className="radio-checked">✓</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {playlists.length > 0 && (
                    <div className="playlist-select-actions">
                        <button onClick={() => {
                            setSelectedPlaylist("");
                            onClose();
                        }} className="btn-cancel-modal">
                            Cancelar
                        </button>
                        <button 
                            onClick={handleConfirm} 
                            className="btn-confirm-modal"
                            disabled={!selectedPlaylist}
                        >
                            Adicionar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaylistSelectModal;

