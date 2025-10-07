import { FaGuitar } from "react-icons/fa";
import { IoEarth } from "react-icons/io5";
import { MdCalendarToday } from "react-icons/md";
import type { AudioDbArtist } from "../services/audioDbApi";
import "./ArtistInfo.css";

interface ArtistInfoProps {
    artist: AudioDbArtist;
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({ artist }) => {
    const shortBio = artist.strBiographyEN 
        ? artist.strBiographyEN.substring(0, 300) + "..." 
        : "Informação não disponível";

    return (
        <div className="artist-info">
            <div className="artist-info-header">
                {artist.strArtistThumb && (
                    <img 
                        src={artist.strArtistThumb} 
                        alt={artist.strArtist}
                        className="artist-thumb"
                    />
                )}
                <div className="artist-details">
                    <h2 className="artist-name">{artist.strArtist}</h2>
                    <div className="artist-meta">
                        {artist.strGenre && <span className="artist-genre"><FaGuitar /> {artist.strGenre}</span>}
                        {artist.strCountry && <span className="artist-country"><IoEarth /> {artist.strCountry}</span>}
                        {artist.intFormedYear && <span className="artist-year"><MdCalendarToday /> {artist.intFormedYear}</span>}
                    </div>
                    <p className="artist-bio">{shortBio}</p>
                </div>
            </div>
        </div>
    );
};

export default ArtistInfo;

