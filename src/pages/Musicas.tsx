import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMusicalNotes } from "react-icons/io5";
import Layout from "../components/Layout";
import MusicCard from "../components/MusicCard";
import AlbumCard, { type Album } from "../components/AlbumCard";
import ArtistInfo from "../components/ArtistInfo";
import PlaylistSelectModal from "../components/PlaylistSelectModal";
import AlbumDetailModal from "../components/AlbumDetailModal";
import type { Music } from "../redux/playlistsSlice";
import { addMusicToPlaylist } from "../redux/playlistsSlice";
import type { RootState } from "../redux/store";
import { audioDbApi, type AudioDbTrack, type AudioDbAlbum, type AudioDbArtist } from "../services/audioDbApi";
import "./Musicas.css";

const Musicas = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const playlists = useSelector((state: RootState) => 
        state.playlists.playlists.filter((p) => p.usuarioId === user)
    );

    const [searchType, setSearchType] = useState<"artist" | "track">("artist");
    const [contentType, setContentType] = useState<"tracks" | "albums">("tracks");
    const [searchQuery, setSearchQuery] = useState("");
    const [trackName, setTrackName] = useState("");
    const [searchResults, setSearchResults] = useState<Music[]>([]);
    const [albumResults, setAlbumResults] = useState<Album[]>([]);
    const [artistInfo, setArtistInfo] = useState<AudioDbArtist | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
    const [isAlbumDetailOpen, setIsAlbumDetailOpen] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

    const resetSearchState = () => {
        setLoading(true);
        setError(null);
        setSearchResults([]);
        setAlbumResults([]);
        setArtistInfo(null);
        setSelectedAlbum(null);
    };

    const searchArtistInfo = async (): Promise<AudioDbArtist | null> => {
        const artists = await audioDbApi.searchArtist(searchQuery);
        
        if (artists.length === 0) {
            setError("Artista não encontrado. Tente outro nome.");
            return null;
        }

        const artist = artists[0];
        setArtistInfo(artist);
        return artist;
    };

    const searchArtistTracks = async () => {
        const tracks = trackName.trim()
            ? await audioDbApi.searchTrack(searchQuery, trackName)
            : await audioDbApi.getTopTracks(searchQuery);
        
        if (tracks.length === 0) {
            const errorMsg = trackName.trim()
                ? "Nenhuma música encontrada com esse nome para este artista."
                : "Nenhuma música encontrada para este artista.";
            setError(errorMsg);
            return;
        }

        const formattedTracks = tracks.map(convertToMusic);
        setSearchResults(formattedTracks);
    };

    const searchArtistAlbums = async () => {
        const albums = await audioDbApi.searchAlbum(searchQuery);
        
        if (albums.length === 0) {
            setError("Nenhum álbum encontrado para este artista.");
            return;
        }

        const formattedAlbums = albums.map(convertToAlbum);
        setAlbumResults(formattedAlbums);
    };

    const searchSpecificTrack = async () => {
        const tracks = await audioDbApi.searchTrack(searchQuery, trackName);
        
        if (tracks.length === 0) {
            setError("Nenhuma música encontrada. Tente outro termo de busca.");
            return;
        }

        const formattedTracks = tracks.map(convertToMusic);
        setSearchResults(formattedTracks);
    };

    const handleSearchByArtist = async () => {
        const artist = await searchArtistInfo();
        if (!artist) return;

        if (contentType === "tracks") {
            await searchArtistTracks();
        } else {
            await searchArtistAlbums();
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!searchQuery.trim()) {
            alert("Por favor, insira um termo de busca!");
            return;
        }

        resetSearchState();

        try {
            if (searchType === "artist") {
                await handleSearchByArtist();
            } else {
                await searchSpecificTrack();
            }
        } catch (err) {
            setError("Erro ao buscar. Tente novamente.");
            console.error("Search error:", err);
        } finally {
            setLoading(false);
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

    const convertToAlbum = (album: AudioDbAlbum): Album => ({
        id: album.idAlbum,
        nome: album.strAlbum,
        artista: album.strArtist,
        ano: album.intYearReleased || "N/A",
        genero: album.strGenre || "Desconhecido",
        thumb: album.strAlbumThumb,
    });

    const handleViewAlbumDetails = (album: Album) => {
        setSelectedAlbum(album);
        setIsAlbumDetailOpen(true);
    };

    const handleAddToPlaylist = (music: Music) => {
        setSelectedMusic(music);
        setIsModalOpen(true);
    };

    const handleConfirmAddToPlaylist = (playlistId: string) => {
        if (selectedMusic) {
            dispatch(addMusicToPlaylist({ playlistId, music: selectedMusic }));
            alert(`Música "${selectedMusic.nome}" adicionada à playlist!`);
        }
    };

    const filterResults = (results: Music[], filterType: string, filterValue: string): Music[] => {
        if (!filterValue) return results;

        const lowerValue = filterValue.toLowerCase();
        
        switch (filterType) {
            case "genre":
                return results.filter((m) => m.genero.toLowerCase().includes(lowerValue));
            case "year":
                return results.filter((m) => m.ano.includes(filterValue));
            case "name":
                return results.filter((m) => m.nome.toLowerCase().includes(lowerValue));
            default:
                return results;
        }
    };

    const [filterType, setFilterType] = useState<string>("");
    const [filterValue, setFilterValue] = useState<string>("");

    const filteredResults = filterResults(searchResults, filterType, filterValue);

    return (
        <Layout>
            <div className="musicas-page">
                <div className="musicas-header">
                    <h1>Buscar Músicas</h1>
                    <p className="musicas-subtitle">Encontre suas músicas favoritas</p>
                </div>

                <div className="search-section">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-type-selector">
                            <label>
                                <input
                                    type="radio"
                                    value="artist"
                                    checked={searchType === "artist"}
                                    onChange={(e) => {
                                        setSearchType(e.target.value as "artist");
                                        setSearchResults([]);
                                        setAlbumResults([]);
                                    }}
                                />
                                Buscar por Artista
                            </label>
                        </div>

                        {searchType === "artist" && (
                            <div className="content-type-selector">
                                <label>
                                    <input
                                        type="radio"
                                        value="tracks"
                                        checked={contentType === "tracks"}
                                        onChange={(e) => {
                                            setContentType(e.target.value as "tracks");
                                            setSearchResults([]);
                                            setAlbumResults([]);
                                            setTrackName("");
                                        }}
                                    />
                                    Ver Músicas
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="albums"
                                        checked={contentType === "albums"}
                                        onChange={(e) => {
                                            setContentType(e.target.value as "albums");
                                            setSearchResults([]);
                                            setAlbumResults([]);
                                            setTrackName("");
                                        }}
                                    />
                                    Ver Álbuns
                                </label>
                            </div>
                        )}

                        <div className="search-inputs">
                            <input
                                type="text"
                                placeholder={searchType === "artist" ? "Nome do artista (ex: Coldplay)" : "Nome do artista"}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            
                            {searchType === "artist" && contentType === "tracks" && (
                                <div className="search-input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Nome da música (ex: Yellow)"
                                        value={trackName}
                                        onChange={(e) => setTrackName(e.target.value)}
                                        className="search-input optional-input"
                                    />
                                    <span className="optional-badge">Opcional</span>
                                </div>
                            )}
                            
                            {searchType === "track" && (
                                <input
                                    type="text"
                                    placeholder="Nome da música (opcional)"
                                    value={trackName}
                                    onChange={(e) => setTrackName(e.target.value)}
                                    className="search-input"
                                />
                            )}
                        </div>

                        <button type="submit" className="btn-search" disabled={loading}>
                            {loading ? "Buscando..." : "Buscar"}
                        </button>
                    </form>

                    {searchResults.length > 0 && (
                        <div className="filter-section">
                            <h3>Filtrar Resultados</h3>
                            <div className="filter-controls">
                                <select
                                    value={filterType}
                                    onChange={(e) => {
                                        setFilterType(e.target.value);
                                        setFilterValue("");
                                    }}
                                    className="filter-select"
                                >
                                    <option value="">Selecione um filtro</option>
                                    <option value="genre">Gênero</option>
                                    <option value="year">Ano</option>
                                    <option value="name">Nome da música</option>
                                </select>

                                {filterType && (
                                    <input
                                        type="text"
                                        placeholder={`Filtrar por ${filterType === "genre" ? "gênero" : filterType === "year" ? "ano" : "nome"}`}
                                        value={filterValue}
                                        onChange={(e) => setFilterValue(e.target.value)}
                                        className="filter-input"
                                    />
                                )}

                                {filterType && (
                                    <button
                                        onClick={() => {
                                            setFilterType("");
                                            setFilterValue("");
                                        }}
                                        className="btn-clear-filter"
                                    >
                                        Limpar Filtro
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                )}

                {artistInfo && <ArtistInfo artist={artistInfo} />}

                {albumResults.length > 0 && (
                    <div className="results-section">
                        <h2>Álbuns Encontrados ({albumResults.length})</h2>
                        <div className="music-grid">
                            {albumResults.map((album) => (
                                <AlbumCard
                                    key={album.id}
                                    album={album}
                                    onViewDetails={handleViewAlbumDetails}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {filteredResults.length > 0 && (
                    <div className="results-section">
                        <h2>Músicas Encontradas ({filteredResults.length})</h2>
                        <div className="music-grid">
                            {filteredResults.map((music) => (
                                <MusicCard
                                    key={music.id}
                                    music={music}
                                    onAddToPlaylist={handleAddToPlaylist}
                                    showAddButton={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {!loading && !error && searchResults.length === 0 && albumResults.length === 0 && (
                    <div className="empty-state">
                        <p className="empty-state-icon"><IoMusicalNotes /></p>
                        <p>Busque por artistas ou músicas para começar</p>
                    </div>
                )}

                <PlaylistSelectModal
                    isOpen={isModalOpen}
                    playlists={playlists}
                    musicName={selectedMusic?.nome || ""}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handleConfirmAddToPlaylist}
                />

                <AlbumDetailModal
                    isOpen={isAlbumDetailOpen}
                    album={selectedAlbum}
                    onClose={() => setIsAlbumDetailOpen(false)}
                />
            </div>
        </Layout>
    );
};

export default Musicas;

