import axios from "axios";

export const Soprano = {
    getUser: async function () {
        const response = await axios.get("/api/user", {
            withCredentials: true,
        });
        return response.data;
    },
    getDirectories: async function () {
        const response = await axios.get("/api/directory", {
            withCredentials: true,
        });
        return response.data;
    },
    getPodcasts: async function () {
        const response = await axios.get("/api/podcast", {
            withCredentials: true,
        });
        return response.data;
    },
    addDirectory: async function (path) {
        const response = await axios.post(
            "/api/directory",
            { path },
            { withCredentials: true }
        );
        return response.data;
    },
    removeDirectory: async function (id) {
        const response = await axios.delete(`/api/directory/${id}`, {
            withCredentials: true,
        });
        return response.data;
    },
    scanDirectory: async function (id) {
        const response = await axios.get(`/api/directory/scan/${id}`, {
            withCredentials: true,
        });
        return response.data;
    },
    synchTrack: async function (path) {
        const response = await axios
            .post("/api/track", { filepath: path }, { withCredentials: true })
            .then(await wait(1));
        return response.data;
    },
    getRecentAlbums: async function () {
        const response = await axios.get("/api/track/recent/albums", {
            withCredentials: true,
        });
        return response.data;
    },
    search: async function (term) {
        const response = await axios.post(
            "/api/track/search",
            { term },
            { withCredentials: true }
        );
        return response.data.data;
    },
    artist: async function (artist) {
        const response = await axios.post(
            "/api/track/artist",
            { artist },
            { withCredentials: true }
        );
        return response.data.data;
    },
    album: async function (album_signature) {
        const response = await axios.post(
            "/api/track/album",
            { album_signature },
            { withCredentials: true }
        );
        return response.data.data;
    },
    genre: async function (genre) {
        const response = await axios.post(
            "/api/track/genre",
            { genre },
            { withCredentials: true }
        );
        return response.data.data;
    },
    year: async function (year) {
        const response = await axios.post(
            "/api/track/year",
            { year },
            { withCredentials: true }
        );
        return response.data.data;
    },
    getGenres: async function () {
        const response = await axios.get("/api/track/genres", {
            withCredentials: true,
        });
        return response.data;
    },
    getYears: async function () {
        const response = await axios.get("/api/track/years", {
            withCredentials: true,
        });
        return response.data;
    },
    getPlaylists: async function () {
        const response = await axios.get("/api/playlist", {
            withCredentials: true,
        });
        return response.data;
    },
    addPlaylist: async function (name) {
        const response = await axios.post(
            "/api/playlist",
            { name },
            { withCredentials: true }
        );
        return response.data;
    },
    removePlaylist: async function (id) {
        const response = await axios.delete(`/api/playlist/${id}`, {
            withCredentials: true,
        });
        return response.data;
    },
    toggleTrackPlaylist: async function (trackId, playlistId) {
        const response = await axios.post(
            `/api/playlist/${playlistId}/track`,
            { track_id: trackId },
            { withCredentials: true }
        );
        return response.data;
    },
    getTrackPlaylists: async function (fingerprint) {
        const response = await axios.get(
            `/api/track/${fingerprint}/playlists`,
            { withCredentials: true }
        );
        return response.data;
    },
    loadPlaylist: async function (playlistId) {
        const response = await axios.get(`/api/playlist/${playlistId}/load`, {
            withCredentials: true,
        });
        return response.data.data;
    },
    savePlaylist: async function (playlistId, tracks) {
        const response = await axios.post(
            `/api/playlist/${playlistId}/save`,
            { tracks },
            { withCredentials: true }
        );
        return response.data.data;
    },
    togglePodcast: async function (podcastId, title, image, publisher) {
        const response = await axios.post(
            `/api/podcast`,
            { podcast_id: podcastId, title, image, publisher },
            { withCredentials: true }
        );
        return response.data;
    },
};

function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export const ListenNotes = {
    searchEpisode: async function (term, offset, sortByDate) {
        const response = await axios.get(
            "https://listen-api.listennotes.com/api/v2/search",
            {
                headers: {
                    "X-ListenAPI-Key": process.env.MIX_LISTEN_API_KEY,
                },
                params: {
                    q: term,
                    type: "episode",
                    language: "English",
                    region: "ca,us,gb",
                    sort_by_date: sortByDate,
                    offset,
                },
                withCredentials: false,
            }
        );
        return response.data;
    },
    searchPodcast: async function (id, recentFirst = true) {
        const response = await axios.get(
            `https://listen-api.listennotes.com/api/v2/podcasts/${id}`,
            {
                headers: {
                    "X-ListenAPI-Key": process.env.MIX_LISTEN_API_KEY,
                },
                params: {
                    sort: recentFirst ? "recent_first" : "oldest_first",
                },
                withCredentials: false,
            }
        );
        return response.data;
    },
};
