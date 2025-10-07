import type { Music } from "../redux/playlistsSlice";
import "./MusicCard.css";

interface MusicCardProps {
    music: Music;
    onAddToPlaylist?: (music: Music) => void;
    onRemove?: (musicId: string) => void;
    showAddButton?: boolean;
    showRemoveButton?: boolean;
}

const MusicCard: React.FC<MusicCardProps> = ({
    music,
    onAddToPlaylist,
    onRemove,
    showAddButton = false,
    showRemoveButton = false,
}) => {
    return (
        <div className="music-card">
            {music.thumb && (
                <div className="music-card-image">
                    <img src={music.thumb} alt={music.nome} />
                </div>
            )}
            <div className="music-card-content">
                <h3 className="music-card-title">{music.nome}</h3>
                <p className="music-card-artist">{music.artista}</p>
                <div className="music-card-info">
                    {music.album && <span className="music-card-album">{music.album}</span>}
                    <span className="music-card-genre">{music.genero || "N/A"}</span>
                    <span className="music-card-year">{music.ano || "N/A"}</span>
                </div>
            </div>
            <div className="music-card-actions">
                {showAddButton && onAddToPlaylist && (
                    <button onClick={() => onAddToPlaylist(music)} className="btn-add">
                        Adicionar
                    </button>
                )}
                {showRemoveButton && onRemove && (
                    <button onClick={() => onRemove(music.id)} className="btn-remove">
                        Remover
                    </button>
                )}
            </div>
        </div>
    );
};

export default MusicCard;

