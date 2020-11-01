import React, { useContext, useState } from "react";
import { SopranoContext } from "../Context/SopranoContext";
import FontAwesome from "react-fontawesome";
import { htmlDecode } from "../Utilities/Tools";
import { Soprano } from "../Library/Soprano";

const TrackRow = ({ type, track, index }) => {
    const { state, dispatch } = useContext(SopranoContext);
    const [trackPlaylist, setTrackPlaylist] = useState({});
    const handlePlay = (e) => {
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

    const handleTrackPlaylists = (e) => {
        Soprano.getTrackPlaylists(track.fingerprint).then((res) => {
            setTrackPlaylist(res);
        });
    };

    const handleToggleTrackPlaylist = (e, trackId, playlistId) => {
        Soprano.toggleTrackPlaylist(trackId, playlistId).then((res) => {
            setTrackPlaylist({
                ...trackPlaylist,
                [playlistId]: res.toggle,
            });
        });
    };

    return (
        <div className="row resultRow">
            <div className="col">
                <div className="d-flex">
                    <div className={type + "-search-row-cover"}>
                        {type === "search" && (
                            <div className="btn-group dropright">
                                <button
                                    onClick={handleTrackPlaylists}
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
                                                    {trackPlaylist[
                                                        playlist.id
                                                    ] == 1 && (
                                                        <FontAwesome name="check" />
                                                    )}{" "}
                                                    {playlist.name}
                                                </a>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                        {type === "playlist" && (
                            <img
                                className="search-album-cover mr-2"
                                src={track.cover}
                                alt="cover"
                            />
                        )}
                    </div>
                    <div
                        onClick={handlePlay}
                        className={type + "-search-row-title truncate w-100"}
                    >
                        {htmlDecode(track.artist)}
                        {" " + htmlDecode("&mdash;") + " "}
                        {htmlDecode(track.title)}
                    </div>
                    <div className={type + "-search-row-playtime-string"}>
                        {track.playtime_string}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackRow;
