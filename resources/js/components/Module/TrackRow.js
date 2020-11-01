import React, { useContext } from "react";
import { SopranoContext } from "../Context/SopranoContext";
import { htmlDecode } from "../Utilities/Tools";
import { Soprano } from "../Library/Soprano";

const TrackRow = ({ type, track, index }) => {
    const { state, dispatch } = useContext(SopranoContext);
    const handleClick = (e) => {
        e.preventDefault();
        if (type === "search") {
            dispatch({
                type: "playTrack",
                payload: track,
            });
        } else if (type === "playlist") {
            dispatch({ type: "changeTrack", payload: index });
        }
    };

    const handleToggleTrackPlaylist = (e, trackId, playlistId) => {
        Soprano.toggleTrackPlaylist(trackId, playlistId).then((res) => {
            console.log(res);
        });
    };

    return (
        <div className="row resultRow">
            <div className="col">
                <div className="d-flex">
                    <div className="search-row-cover">
                        <div className="btn-group dropright">
                            <button
                                type="button"
                                className="btn dropdown-toggle"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <img
                                    className="search-album-cover"
                                    src={track.cover}
                                    alt="cover"
                                />
                            </button>
                            <div
                                title={track.album}
                                className="dropdown-menu"
                                x-placement="right-start"
                            >
                                {!state.playlists.length && (
                                    <a
                                        className="dropdown-item disabled"
                                        href="#"
                                    >
                                        No playlists added yet.
                                    </a>
                                )}
                                {state.playlists.length > 0 &&
                                    state.playlists.map((playlist, i) => {
                                        return (
                                            <a
                                                key={i}
                                                className="dropdown-item"
                                                href="#"
                                                onClick={(e) =>
                                                    handleToggleTrackPlaylist(
                                                        e,
                                                        track.id,
                                                        playlist.id
                                                    )
                                                }
                                            >
                                                {playlist.name}
                                            </a>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={handleClick}
                        className="search-row-title truncate w-100"
                    >
                        {htmlDecode(track.artist)}
                        {" " + htmlDecode("&mdash;") + " "}
                        {htmlDecode(track.title)}
                    </div>
                    <div className="search-row-playtime-string">
                        {track.playtime_string}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackRow;
