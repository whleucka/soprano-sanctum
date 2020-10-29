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
        return response.data;
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
    searchPodcastEpisode: async function (term) {
        const response = await axios.get(
            "https://listen-api.listennotes.com/api/v2/search",
            {
                headers: {
                    "X-ListenAPI-Key": process.env.MIX_LISTEN_API_KEY,
                },
                params: {
                    q: term,
                    type: "episode",
                    sort_by_date: 1,
                },
                withCredentials: false,
            }
        );
        return response.data;
    },
};
