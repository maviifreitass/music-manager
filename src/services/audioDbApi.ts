const API_KEY = "123";
const BASE_URL = "https://www.theaudiodb.com/api/v1/json";

export interface AudioDbTrack {
    idTrack: string;
    strTrack: string;
    strArtist: string;
    strAlbum: string;
    intTrackNumber: string;
    strGenre: string;
    strMood: string;
    intDuration: string;
    strTrackThumb: string;
    intYearReleased: string;
    strMusicVid: string;
}

export interface AudioDbArtist {
    idArtist: string;
    strArtist: string;
    strArtistThumb: string;
    strGenre: string;
    intFormedYear: string;
    strBiographyEN: string;
    strCountry: string;
}

export interface SearchTrackResponse {
    track: AudioDbTrack[] | null;
}

export interface SearchArtistResponse {
    artists: AudioDbArtist[] | null;
}

export interface TopTracksResponse {
    track: AudioDbTrack[] | null;
}

export interface TrendingTrack {
    idTrend: string;
    intChartPlace: string;
    idArtist: string;
    idAlbum: string;
    idTrack: string;
    strArtist: string;
    strAlbum: string;
    strTrack: string;
    strTrackThumb: string | null;
    strCountry: string;
    strType: string;
    intWeek: string;
    dateAdded: string;
}

export interface TrendingResponse {
    trending: TrendingTrack[] | null;
}

export interface AudioDbAlbum {
    idAlbum: string;
    strAlbum: string;
    strArtist: string;
    intYearReleased: string;
    strAlbumThumb: string;
    strGenre: string;
    strAlbumMBID: string;
}

export interface SearchAlbumResponse {
    album: AudioDbAlbum[] | null;
}

export const audioDbApi = {
    // Busca informações do artista - retorna dados como bio, foto, país, etc
    searchArtist: async (artistName: string): Promise<AudioDbArtist[]> => {
        const response = await fetch(`${BASE_URL}/${API_KEY}/search.php?s=${encodeURIComponent(artistName)}`);
        const data: SearchArtistResponse = await response.json();
        return data.artists || [];
    },

    // Busca músicas específicas por nome do artista e opcionalmente nome da música
    searchTrack: async (artistName: string, trackName?: string): Promise<AudioDbTrack[]> => {
        let url = `${BASE_URL}/${API_KEY}/searchtrack.php?s=${encodeURIComponent(artistName)}`;
        if (trackName) {
            url += `&t=${encodeURIComponent(trackName)}`;
        }
        const response = await fetch(url);
        const data: SearchTrackResponse = await response.json();
        return data.track || [];
    },

    // Método melhorado: busca artista e suas músicas em uma chamada integrada
    searchArtistWithTracks: async (artistName: string): Promise<{
        artist: AudioDbArtist | null;
        tracks: AudioDbTrack[];
    }> => {
        // Primeiro busca o artista
        const artists = await audioDbApi.searchArtist(artistName);
        const artist = artists.length > 0 ? artists[0] : null;

        // Se encontrar o artista, busca suas top 10 músicas
        let tracks: AudioDbTrack[] = [];
        if (artist) {
            tracks = await audioDbApi.getTopTracks(artistName);
        }

        return { artist, tracks };
    },

    searchAlbum: async (artistName: string, albumName?: string): Promise<AudioDbAlbum[]> => {
        let url = `${BASE_URL}/${API_KEY}/searchalbum.php?s=${encodeURIComponent(artistName)}`;
        if (albumName) {
            url += `&a=${encodeURIComponent(albumName)}`;
        }
        const response = await fetch(url);
        const data: SearchAlbumResponse = await response.json();
        return data.album || [];
    },

    getTopTracks: async (artistName: string): Promise<AudioDbTrack[]> => {
        const response = await fetch(`${BASE_URL}/${API_KEY}/track-top10.php?s=${encodeURIComponent(artistName)}`);
        const data: TopTracksResponse = await response.json();
        return data.track || [];
    },

    getMostLoved: async (format: "track" | "album" = "track"): Promise<AudioDbTrack[]> => {
        const response = await fetch(`${BASE_URL}/${API_KEY}/mostloved.php?format=${format}`);
        const data: TopTracksResponse = await response.json();
        return data.track || [];
    },

    getTrending: async (country: string = "us", type: string = "itunes", format: string = "singles"): Promise<TrendingTrack[]> => {
        const response = await fetch(`${BASE_URL}/${API_KEY}/trending.php?country=${country}&type=${type}&format=${format}`);
        const data: TrendingResponse = await response.json();
        return data.trending || [];
    },
};

