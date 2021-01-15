import React, { useContext, useState } from "react";
import FontAwesome from "react-fontawesome";

import { SopranoContext } from "../Context/SopranoContext";
import { Soprano } from "../Library/Soprano";
import { htmlDecode } from "../Utilities/Tools";

const TrackRow = ({ type, track, index, callback = null }) => {
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
            dispatch({ type: "setCurrentIndex", payload: index });
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
                                        title={track.album}
                                        src={track.cover}
                                        alt="cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/img/no-album.png";
                                        }}
                                    />
                                </button>
                                <div
                                    className="dropdown-menu"
                                    x-placement="right-start"
                                >
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={callback}
                                        data-type="artist"
                                        data-artist={track.artist}
                                    >
                                        Artist:{" "}
                                        {htmlDecode(track.artist).length > 30
                                            ? htmlDecode(
                                                  track.artist
                                              ).substring(0, 30) + "..."
                                            : htmlDecode(track.artist)}
                                    </a>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={callback}
                                        data-type="album"
                                        data-artist={track.artist}
                                        data-album={track.album}
                                    >
                                        Album:{" "}
                                        {htmlDecode(track.album).length > 30
                                            ? htmlDecode(track.album).substring(
                                                  0,
                                                  30
                                              ) + "..."
                                            : htmlDecode(track.album)}
                                    </a>
                                    <div className="dropdown-divider"></div>
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
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/img/no-album.png";
                                }}
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
