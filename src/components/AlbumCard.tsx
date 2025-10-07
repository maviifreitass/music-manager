import "./AlbumCard.css";

export interface Album {
    id: string;
    nome: string;
    artista: string;
    ano: string;
    genero: string;
    thumb: string;
}

interface AlbumCardProps {
    album: Album;
    onViewDetails?: (album: Album) => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onViewDetails }) => {
    return (
        <div className="album-card">
            {album.thumb && (
                <div className="album-card-image">
                    <img src={album.thumb} alt={album.nome} />
                </div>
            )}
            <div className="album-card-content">
                <h3 className="album-card-title">{album.nome}</h3>
                <p className="album-card-artist">{album.artista}</p>
                <div className="album-card-info">
                    <span className="album-card-genre">{album.genero || "N/A"}</span>
                    <span className="album-card-year">{album.ano || "N/A"}</span>
                </div>
            </div>
            <div className="album-card-actions">
                {onViewDetails && (
                    <button onClick={() => onViewDetails(album)} className="btn-view-tracks">
                        Ver Detalhes
                    </button>
                )}
            </div>
        </div>
    );
};

export default AlbumCard;

