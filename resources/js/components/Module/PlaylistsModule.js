import { useHistory } from "react-router-dom";
import React, { useContext, useState } from "react";
import FontAwesome from "react-fontawesome";
import { SopranoContext } from "../Context/SopranoContext";
import { Soprano } from "../Library/Soprano";

const PlaylistsModule = () => {
    const { state, dispatch } = useContext(SopranoContext);
    const history = useHistory();

    const handleDelete = (e) => {
        e.preventDefault();
        const id = parseInt(e.currentTarget.id);
        Soprano.removePlaylist(id).then((res) => {
            dispatch({ type: "removePlaylist", payload: id });
        });
    };

    const handleCopyPlaylist = (e) => {
        const playlist_id = e.currentTarget.id;
        Soprano.loadPlaylist(playlist_id).then((res) => {
            dispatch({ type: "copyPlaylist", payload: res });
            history.push("/home");
        });
    };

    return (
        <div id="playlists-module">
            <table id="tbl-playlists" className="w-100 table">
                <tbody>
                    {state.playlists.length > 0 &&
                        state.playlists.map((playlist, i) => {
                            return (
                                <tr key={i}>
                                    <td className="border-0">
                                        {playlist.name}
                                    </td>
                                    <td className="text-right border-0">
                                        <button
                                            id={playlist.id}
                                            onClick={handleDelete}
                                            className="btn btn-sm btn-danger mr-1"
                                        >
                                            <FontAwesome name="trash" /> Delete
                                        </button>
                                        <button
                                            id={playlist.id}
                                            onClick={handleCopyPlaylist}
                                            className="btn btn-sm btn-success"
                                        >
                                            <FontAwesome name="play" /> Load
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    <tr></tr>
                </tbody>
            </table>
        </div>
    );
};

export default PlaylistsModule;
