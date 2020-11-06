import axios from "axios";

function promiseDebounce(fn, delay, count) {
    var working = 0,
        queue = [];
    function work() {
        if (queue.length === 0 || working === count) return;
        working++;
        Promise.delay(delay)
            .tap(function () {
                working--;
            })
            .then(work);
        var next = queue.shift();
        next[2](fn.apply(next[0], next[1]));
    }
    return function debounced() {
        var args = arguments;
        return new Promise(
            function (resolve) {
                queue.push([this, args, resolve]);
                if (working < count) work();
            }.bind(this)
        );
    };
}

axios.post = promiseDebounce(axios.post, 1000, 2);

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
        const response = await axios.post(
            "/api/track",
            { filepath: path },
            { withCredentials: true }
        );
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
};

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
                    region: "ca,us,gb,au,nz",
                    sort_by_date: sortByDate,
                    offset,
                },
                withCredentials: false,
            }
        );
        return response.data;
    },
};
