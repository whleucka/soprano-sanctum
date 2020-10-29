import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import { SopranoContext } from "../Context/SopranoContext";
import Avatar from "react-avatar";

const Menu = ({ playlists }) => {
    const { state, dispatch } = useContext(SopranoContext);
    return (
        <nav id="sidebar" className="text-center">
            <ul className="navbar-nav">
                <Link to="/home">
                    <li className="navbar-item">
                        <FontAwesome
                            name="headphones"
                            className="mr-2 sidebar-icon"
                        />
                        <span className="link-toggle">Playlist</span>
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
                    className="navbar-item"
                    data-toggle="modal"
                    data-target="#createPlaylistModal"
                >
                    <FontAwesome name="plus" className="mr-2 sidebar-icon" />
                    <span className="link-toggle">Create Playlist</span>
                </li>
                <div id="sidebar-playlist-cont">
                    {playlists.length > 0 &&
                        playlists.map((playlist, i) => {
                            return (
                                <li className="navbar-item" key={i}>
                                    <Avatar
                                        size={42}
                                        className="sidebar-icon playlist-avatar mr-2"
                                        title={playlist.name}
                                        name={playlist.name}
                                    />
                                    <span className="link-toggle">
                                        {playlist.name}
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

const CreatePlaylistModal = () => {
    const [name, setName] = useState("");
    return (
        <div
            className="modal"
            id="createPlaylistModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="modalTitle"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalTitle">
                            Create Playlist
                        </h5>
                    </div>
                    <div className="modal-body">
                        <div className="form-group text-left">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                className="form-control"
                                id="name"
                                placeholder="Awesome Playlist 2004"
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            data-dismiss="modal"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-success"
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;
