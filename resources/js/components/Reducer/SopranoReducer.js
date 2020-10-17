export function SopranoReducer(state, action) {
    switch (action.type) {
        case "getUser":
            return { ...state, user: action.payload };
        default:
            return state;
    }
}
