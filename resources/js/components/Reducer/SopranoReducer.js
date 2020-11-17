import { mod } from "../Utilities/Tools";

export function SopranoReducer(state, action) {
    switch (action.type) {
        case "initUser":
            return { ...state, user: action.payload };
        case "getDirectories":
            return { ...state, directories: action.payload };
        case "getPodcasts":
            return { ...state, podcasts: action.payload };
        case "addDirectory":
            return {
                ...state,
                directories: [...state.directories, action.payload],
            };
        case "removeDirectory":
            return {
                ...state,
                directories: state.directories.filter(
                    (directory) => directory.id != action.payload
                ),
            };
        case "playTrack":
            return {
                ...state,
                currentTrack: action.payload,
            };
        case "copyPlaylist":
            return {
                ...state,
                playlist: action.payload,
            };
        case "nextTrack":
            return {
                ...state,
                currentIndex: mod(
                    state.currentIndex + 1,
                    state.playlist.length
                ),
            };
        case "prevTrack":
            return {
                ...state,
                currentIndex: mod(
                    state.currentIndex - 1,
                    state.playlist.length
                ),
            };
        case "toggleShuffle":
            return {
                ...state,
                shuffle: !state.shuffle,
            };
        case "toggleRepeat":
            return {
                ...state,
                shuffle: !state.repeat,
            };
        case "shuffleTrack":
            let nextIndex = null;
            while (nextIndex === null) {
                nextIndex = Math.floor(Math.random() * state.playlist.length);
                if (nextIndex === state.currentIndex) nextIndex = null;
            }
            return {
                ...state,
                currentIndex: nextIndex,
            };
        case "setCurrentIndex":
            return {
                ...state,
                currentIndex: action.payload,
            };
        case "changeTrack":
            return {
                ...state,
                currentTrack: state.playlist[action.payload],
            };
        case "getPlaylists":
            return { ...state, playlists: action.payload };
        case "addPlaylist":
            return {
                ...state,
                playlists: [...state.playlists, action.payload],
            };
        case "removePlaylist":
            return {
                ...state,
                playlists: state.playlists.filter(
                    (playlist) => playlist.id != action.payload
                ),
            };
        default:
            return state;
    }
}
