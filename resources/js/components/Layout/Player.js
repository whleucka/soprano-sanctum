import React, { useContext, useState, useEffect } from "react";
import FontAwesome from "react-fontawesome";
import { htmlDecode } from "../Utilities/Tools";
import Marquee from "react-double-marquee";
import { SopranoContext } from "../Context/SopranoContext";

const Player = ({ currentTrack, shuffle }) => {
    const { state, dispatch } = useContext(SopranoContext);
    const [player, setPlayer] = useState({
        status: "idle",
    });

    const handleError = () => {
        setPlayer({
            ...player,
            status: "error",
        });
    };

    const handleLoadingTrack = () => {
        setPlayer({
            ...player,
            status: "loading",
        });
    };

    const handleNextTrack = () => {
        dispatch({ type: shuffle ? "shuffleTrack" : "nextTrack" });
    };

    const handlePrevTrack = () => {
        dispatch({ type: shuffle ? "shuffleTrack" : "prevTrack" });
    };

    const handlePlayPauseTrack = () => {
        if (player.status === "paused") handlePlayTrack();
        else handlePauseTrack();
    };

    const handlePlayTrack = () => {
        setPlayer({
            ...player,
            status: "playing",
        });
    };

    const handlePauseTrack = () => {
        setPlayer({
            ...player,
            status: "paused",
        });
    };

    const handleToggleShuffle = () => {
        dispatch({ type: "toggleShuffle" });
    };

    const handleToggleRepeat = () => {
        dispatch({ type: "toggleRepeat" });
    };

    const trackUrl =
        typeof currentTrack !== "undefined" && currentTrack.fingerprint
            ? `/api/track/stream/${currentTrack.fingerprint}`
            : null;

    const playPauseIcon =
        player.status === "playing" ? (
            <FontAwesome name="pause" />
        ) : (
            <FontAwesome name="play" />
        );

    const shuffleClass = shuffle ? "text-success" : "";

    useEffect(() => {
        const audio = document.getElementById("audio");
        audio.onplay = handlePlayTrack;
        audio.onpause = handlePauseTrack;
        audio.onload = handleLoadingTrack;
        audio.onerror = handleError;
        audio.onended = handleNextTrack;
    }, []);

    useEffect(() => {
        const audio = document.getElementById("audio");
        if (player.status === "playing") {
            audio.play();
        } else {
            audio.pause();
        }
    }, [player]);
    const cover_src = Object.entries(currentTrack).length
        ? currentTrack.cover
        : "/img/no-album.png";
    return (
        <div id="player">
            <audio id="audio" src={trackUrl} autoPlay />
            <div className="media">
                <img
                    data-toggle="modal"
                    data-target="#coverModal"
                    id="player-cover-art"
                    className="d-flex mr-3"
                    alt="album cover"
                    src={cover_src}
                />
                <div id="player-cont" className="media-body">
                    {player.status === "idle" && (
                        <>
                            <div id="player-album">
                                <img
                                    src="/img/music.png"
                                    alt="soprano"
                                    style={{ height: "13px" }}
                                    className="music-note mr-2"
                                />
                                <span>Soprano</span>
                            </div>
                            <div>
                                <span>&nbsp;</span>
                            </div>
                        </>
                    )}
                    {player.status !== "idle" && player.status !== "loading" && (
                        <div>
                            <div id="player-album" className="marquee">
                                <Marquee>
                                    {currentTrack.album
                                        ? htmlDecode(currentTrack.album)
                                        : "No Album"}
                                </Marquee>
                            </div>
                            <div id="player-artist-title" className="marquee">
                                <Marquee>
                                    {currentTrack.artist
                                        ? htmlDecode(currentTrack.artist)
                                        : "No Artist"}
                                    {" " + htmlDecode("&mdash;") + " "}
                                    {currentTrack.title
                                        ? htmlDecode(currentTrack.title)
                                        : "No Title"}
                                </Marquee>
                            </div>
                        </div>
                    )}
                    <div id="player-controls" className="d-flex">
                        <button
                            className="btn player-btn"
                            onClick={handlePrevTrack}
                            disabled={!state.playlist.length ? "disabled" : ""}
                        >
                            <FontAwesome name="step-backward" />
                        </button>
                        <button
                            className="btn player-btn"
                            onClick={handlePlayPauseTrack}
                            disabled={
                                player.status === "idle" ? "disabled" : ""
                            }
                        >
                            {playPauseIcon}
                        </button>
                        <button
                            className="btn player-btn"
                            onClick={handleNextTrack}
                            disabled={!state.playlist.length ? "disabled" : ""}
                        >
                            <FontAwesome name="step-forward" />
                        </button>
                        <button
                            className="btn player-btn"
                            onClick={handleToggleShuffle}
                        >
                            <FontAwesome
                                className={shuffleClass}
                                name="random"
                            />
                        </button>
                    </div>
                </div>
            </div>
            <CoverModal currentTrack={currentTrack} cover_src={cover_src} />
        </div>
    );
};

const CoverModal = ({ currentTrack, cover_src }) => {
    return (
        <div
            className="modal"
            id="coverModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="modalTitle"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalTitle">
                            {currentTrack.album
                                ? htmlDecode(currentTrack.album)
                                : "No Album"}
                            <br />
                            <small>{currentTrack.year}</small>
                        </h5>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <img
                            id="modal-cover-art"
                            className="w-100"
                            alt="album cover"
                            src={cover_src}
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            data-dismiss="modal"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player;
