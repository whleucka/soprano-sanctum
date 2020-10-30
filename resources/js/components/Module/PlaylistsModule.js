import React from "react";

const PlaylistsModule = ({ playlists }) => {
    return (
        <div id="playlists-module">
            <table id="tbl-playlists" className="w-100 table">
                <tbody>
                    {playlists.length > 0 &&
                        playlists.map((playlist) => {
                            return (
                                <tr>
                                    <td className="border-0">
                                        {playlist.name}
                                    </td>
                                    <td className="text-right border-0">
                                        <button className="btn btn-sm btn-secondary mr-1">
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger mr-1">
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
