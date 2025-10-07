import type { Playlist } from "../redux/playlistsSlice";
import "./PlaylistCard.css";

interface PlaylistCardProps {
    playlist: Playlist;
    onEdit: (playlist: Playlist) => void;
    onDelete: (playlistId: string) => void;
    onView: (playlist: Playlist) => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onEdit, onDelete, onView }) => {
    return (
        <div className="playlist-card">
            <div className="playlist-card-header">
                <h3 className="playlist-card-title">{playlist.nome}</h3>
                <span className="playlist-card-count">{playlist.musicas.length} músicas</span>
            </div>
            <div className="playlist-card-actions">
                <button onClick={() => onView(playlist)} className="btn-view">
                    Visualizar
                </button>
                <button onClick={() => onEdit(playlist)} className="btn-edit">
                    Editar
                </button>
                <button onClick={() => onDelete(playlist.id)} className="btn-delete">
                    Excluir
                </button>
            </div>
        </div>
    );
};

export default PlaylistCard;

