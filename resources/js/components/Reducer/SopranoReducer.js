import { mod } from "../Utilities/Tools";

export function SopranoReducer(state, action) {
    switch (action.type) {
        case "initUser":
            return { ...state, user: action.payload };
        case "getDirectories":
            return { ...state, directories: action.payload };
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
        case "changeTrack":
            return {
                ...state,
                currentTrack: state.playlist[action.payload],
            };
        default:
            return state;
    }
}
