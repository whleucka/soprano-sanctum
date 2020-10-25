import React, { useEffect, useReducer, useMemo } from "react";
import ReactDOM from "react-dom";
import { SopranoReducer } from "./Reducer/SopranoReducer";
import { Soprano } from "./Library/Soprano";
import { SopranoContext } from "./Context/SopranoContext";
import Search from "./Layout/Search";
import Menu from "./Layout/Sidebar";
import Playlist from "./Layout/Playlist";
import Admin from "./Layout/Admin";
import Player from "./Layout/Player";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const initialState = {
    user: null,
    directories: null,
    currentTrack: {},
    playlist: [],
};

const App = () => {
    const [state, dispatch] = useReducer(SopranoReducer, initialState);

    useEffect(() => {
        Soprano.getUser().then((res) =>
            dispatch({ type: "getUser", payload: res })
        );
    }, []);

    const ContextValue = useMemo(() => {
        return { state, dispatch };
    }, [state, dispatch]);

    return (
        <SopranoContext.Provider value={ContextValue}>
            <Router>
                <Menu />
                <Switch>
                    <Route path="/home">
                        <Playlist />
                    </Route>
                    <Route path="/search">
                        <Search />
                    </Route>
                    <Route path="/admin">
                        <Admin />
                    </Route>
                </Switch>
                <Player currentTrack={state.currentTrack} />
            </Router>
        </SopranoContext.Provider>
    );
};

export default App;

if (document.getElementById("soprano")) {
    ReactDOM.render(<App />, document.getElementById("soprano"));
}
