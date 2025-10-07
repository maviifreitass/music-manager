import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Layout from "../components/Layout";
import MusicCard from "../components/MusicCard";
import PlaylistSelectModal from "../components/PlaylistSelectModal";
import type { Music } from "../redux/playlistsSlice";
import { addMusicToPlaylist } from "../redux/playlistsSlice";
import type { RootState } from "../redux/store";
import { audioDbApi, type TrendingTrack } from "../services/audioDbApi";
import "./Home.css";

const Home = () => {
    const dispatch = useDispatch();
    const [popularTracks, setPopularTracks] = useState<Music[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const playlists = useSelector((state: RootState) => 
        state.playlists.playlists.filter((p) => p.usuarioId === user)
    );

    useEffect(() => {
        loadPopularTracks();
    }, []);

    const loadPopularTracks = async () => {
        setLoading(true);
        setError(null);
        try {
            const tracks = await audioDbApi.getTrending("us", "itunes", "singles");
            const formattedTracks = tracks.slice(0, 10).map(convertTrendingToMusic);
            setPopularTracks(formattedTracks);
        } catch (err) {
            setError("Erro ao carregar músicas populares. Tente novamente.");
            console.error("Error loading popular tracks:", err);
        } finally {
            setLoading(false);
        }
    };

    const convertTrendingToMusic = (track: TrendingTrack): Music => ({
        id: track.idTrack,
        nome: track.strTrack,
        artista: track.strArtist,
        genero: "Trending",
        ano: "2025",
        album: track.strAlbum,
        thumb: track.strTrackThumb || undefined,
    });

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

    return (
        <Layout>
            <div className="home-page">
                <div className="home-header">
                    <h1>Top 3 Músicas Mais Ouvidas</h1>
                    <p className="home-subtitle">As músicas em alta no iTunes US</p>
                </div>

                {loading && <div className="loading">Carregando músicas populares...</div>}

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={loadPopularTracks} className="btn-retry">
                            Tentar Novamente
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="music-grid">
                        {popularTracks.map((track) => (
                            <MusicCard
                                key={track.id}
                                music={track}
                                onAddToPlaylist={handleAddToPlaylist}
                                showAddButton={true}
                            />
                        ))}
                    </div>
                )}

                <PlaylistSelectModal
                    isOpen={isModalOpen}
                    playlists={playlists}
                    musicName={selectedMusic?.nome || ""}
                    onClose={() => setIsModalOpen(false)}
                    onSelect={handleConfirmAddToPlaylist}
                />
            </div>
        </Layout>
    );
};

export default Home;

