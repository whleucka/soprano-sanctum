import React, { useContext } from "react";
import { BrowserRouter as Router, Link, useHistory } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import { SopranoContext } from "../Context/SopranoContext";
import Avatar from "react-avatar";
import { Soprano } from "../Library/Soprano";
import CreatePlaylistModal from "../Module/CreatePlaylistModal";

const Menu = () => {
    const { state, dispatch } = useContext(SopranoContext);
    const history = useHistory();
    const handleCopyPlaylist = (e) => {
        const playlist_id = e.currentTarget.id;
        Soprano.loadPlaylist(playlist_id).then((res) => {
            dispatch({ type: "copyPlaylist", payload: res });
            history.push("/home");
        });
    };

    return (
        <nav id="sidebar">
            <ul className="navbar-nav">
                <Link to="/home">
                    <li className="navbar-item">
                        <FontAwesome
                            name="headphones"
                            className="mr-2 sidebar-icon"
                        />
                        <span className="link-toggle">Home</span>
                    </li>
                </Link>
                <Link to="/playlists">
                    <li className="navbar-item">
                        <FontAwesome
                            name="list"
                            className="mr-2 sidebar-icon"
                        />
                        <span className="link-toggle">Playlists</span>
                    </li>
                </Link>
                <Link to="/search">
                    <li className="navbar-item">
                        <FontAwesome
                            name="search"
                            className="mr-2 sidebar-icon"
                        />
                        <span className="link-toggle">Search</span>
                    </li>
                </Link>
                <Link to="/podcasts">
                    <li className="navbar-item">
                        <FontAwesome
                            name="microphone"
                            className="mr-2 sidebar-icon"
                        />
                        <span className="link-toggle">Podcasts</span>
                    </li>
                </Link>
                {state.user && state.user.is_admin === 1 && (
                    <Link to="/admin">
                        <li className="navbar-item">
                            <FontAwesome
                                name="lock"
                                className="mr-2 sidebar-icon"
                            />
                            <span className="link-toggle">Admin</span>
                        </li>
                    </Link>
                )}
            </ul>

            <ul className="navbar-nav mt-3">
                <li
                    className="navbar-item mb-3"
                    data-toggle="modal"
                    data-target="#createPlaylistModal"
                >
                    <FontAwesome name="plus" className="mr-2 sidebar-icon" />
                    <span className="link-toggle">Create Playlist</span>
                </li>
                <div id="sidebar-playlist-cont">
                    {state.playlists.length > 0 &&
                        state.playlists.map((playlist, i) => {
                            return (
                                <li
                                    className="navbar-item"
                                    id={playlist.id}
                                    onClick={handleCopyPlaylist}
                                    key={i}
                                >
                                    <Avatar
                                        size={42}
                                        className="sidebar-icon playlist-avatar mr-2"
                                        title={playlist.name}
                                        name={playlist.name}
                                    />
                                    <span className="link-toggle">
                                        {playlist.name.length > 12
                                            ? playlist.name.substr(0, 12) +
                                              "..."
                                            : playlist.name}
                                    </span>
                                </li>
                            );
                        })}
                </div>
            </ul>
            <CreatePlaylistModal />
        </nav>
    );
};

export default Menu;
