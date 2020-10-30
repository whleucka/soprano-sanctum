import React, { useContext, useState } from "react";
import { SopranoContext } from "../Context/SopranoContext";
import { Soprano } from "../Library/Soprano";

const PlaylistsModule = ({ playlists }) => {
    const { state, dispatch } = useContext(SopranoContext);

    const handleDelete = (e) => {
        e.preventDefault();
        const id = parseInt(e.currentTarget.id);
        Soprano.removePlaylist(id).then((res) => {
            dispatch({ type: "removePlaylist", payload: id });
        });
    };

    return (
        <div id="playlists-module">
            <table id="tbl-playlists" className="w-100 table">
                <tbody>
                    {playlists.length > 0 &&
                        playlists.map((playlist, i) => {
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
                                            Delete
                                        </button>
                                        <button className="btn btn-sm btn-success">
                                            Play
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
