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
    currentIndex: 0,
    currentTrack: {},
    playlist: [],
    shuffle: true,
    repeat: true,
};

const App = () => {
    const [state, dispatch] = useReducer(SopranoReducer, initialState);

    useEffect(() => {
        Soprano.getUser().then((res) =>
            dispatch({ type: "initUser", payload: res })
        );
    }, []);

    useEffect(() => {
        if (state.playlist.length > 0)
            dispatch({ type: "changeTrack", payload: state.currentIndex });
    }, [state.currentIndex]);

    const ContextValue = useMemo(() => {
        return { state, dispatch };
    }, [state, dispatch]);

    return (
        <SopranoContext.Provider value={ContextValue}>
            <Router>
                <Menu />
                <Switch>
                    <Route path="/home">
                        <Playlist tracks={state.playlist} />
                    </Route>
                    <Route path="/search">
                        <Search />
                    </Route>
                    <Route path="/admin">
                        <Admin />
                    </Route>
                </Switch>
                <Player
                    shuffle={state.shuffle}
                    repeat={state.repeat}
                    currentTrack={
                        state.currentTrack ?? {
                            album: "No Album",
                            track: "No Track",
                            artist: "No Artist",
                            cover: "/img/no-album.png",
                        }
                    }
                />
            </Router>
        </SopranoContext.Provider>
    );
};

export default App;

if (document.getElementById("soprano")) {
    ReactDOM.render(<App />, document.getElementById("soprano"));
}
