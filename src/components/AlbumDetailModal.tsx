import { MdAlbum } from "react-icons/md";
import { FaGuitar } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import type { Album } from "./AlbumCard";
import "./AlbumDetailModal.css";

interface AlbumDetailModalProps {
    isOpen: boolean;
    album: Album | null;
    onClose: () => void;
}

const AlbumDetailModal: React.FC<AlbumDetailModalProps> = ({ isOpen, album, onClose }) => {
    if (!isOpen || !album) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="album-detail-overlay" onClick={handleOverlayClick}>
            <div className="album-detail-modal">
                <div className="album-detail-header">
                    <h2>Detalhes do Álbum</h2>
                    <button onClick={onClose} className="modal-close-btn">
                        ✕
                    </button>
                </div>

                <div className="album-detail-content">
                    <div className="album-detail-cover">
                        {album.thumb ? (
                            <img src={album.thumb} alt={album.nome} />
                        ) : (
                            <div className="album-detail-placeholder">
                                <span className="album-icon"><MdAlbum /></span>
                            </div>
                        )}
                    </div>

                    <div className="album-detail-info">
                        <h3 className="album-detail-title">{album.nome}</h3>
                        <p className="album-detail-artist">
                            <strong>Artista:</strong> {album.artista}
                        </p>

                        <div className="album-detail-meta">
                            <div className="meta-item">
                                <span className="meta-label"><FaGuitar /> Gênero</span>
                                <span className="meta-value">{album.genero || "Não informado"}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label"><MdCalendarToday /> Ano</span>
                                <span className="meta-value">{album.ano || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="album-detail-footer">
                    <button onClick={onClose} className="btn-close-detail">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlbumDetailModal;

