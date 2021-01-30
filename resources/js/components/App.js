import md5 from "md5";
import React, { useEffect, useMemo, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { SopranoContext } from "./Context/SopranoContext";
import Admin from "./Layout/Admin";
import Home from "./Layout/Home";
import Player from "./Layout/Player";
import Playlists from "./Layout/Playlists";
import Podcasts from "./Layout/Podcasts";
import Search from "./Layout/Search";
import Menu from "./Layout/Sidebar";
import { Soprano } from "./Library/Soprano";
import { SopranoReducer } from "./Reducer/SopranoReducer";

const initialState = {
    user: null,
    directories: null,
    currentIndex: -1,
    currentTrack: {},
    playlist: [],
    playlists: [],
    podcasts: [],
    shuffle: true,
    repeat: true,
};

const App = () => {
    const [state, dispatch] = useReducer(SopranoReducer, initialState);

    useEffect(() => {
        Soprano.getUser().then((res) =>
            dispatch({ type: "initUser", payload: res })
        );
        Soprano.getPlaylists().then((res) =>
            dispatch({ type: "getPlaylists", payload: res })
        );
        Soprano.getPodcasts().then((res) =>
            dispatch({ type: "getPodcasts", payload: res })
        );
    }, []);

    useEffect(() => {
        if (state.playlist.length > 0) {
            dispatch({ type: "changeTrack", payload: state.currentIndex });
        }
    }, [state.currentIndex]);

    useEffect(() => {
        if (state.user) {
            const email_hash = md5(state.user.email);
            const image = document.createElement("img");
            image.height = 30;
            image.width = 30;
            image.style.marginRight = "5px";
            image.style.borderRadius = "10px";
            image.src = `https://www.gravatar.com/avatar/${email_hash}`;
            document.getElementById("avatar").appendChild(image);
        }
    }, [state.user]);

    const ContextValue = useMemo(() => {
        return { state, dispatch };
    }, [state, dispatch]);

    return (
        <SopranoContext.Provider value={ContextValue}>
            <Router>
                <Menu />
                <Switch>
                    <Route path="/home">
                        <Home />
                    </Route>
                    <Route path="/playlists">
                        <Playlists />
                    </Route>
                    <Route path="/search">
                        <Search />
                    </Route>
                    <Route path="/podcasts">
                        <Podcasts />
                    </Route>
                    {user.is_admin && (
                        <Route path="/admin">
                            <Admin />
                        </Route>
                    )}
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
