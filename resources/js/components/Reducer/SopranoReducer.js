export function SopranoReducer(state, action) {
    switch (action.type) {
        case "getUser":
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
        default:
            return state;
    }
}
