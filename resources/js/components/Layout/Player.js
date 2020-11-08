import React, { useContext, useState, useEffect } from "react";
import FontAwesome from "react-fontawesome";
import { htmlDecode } from "../Utilities/Tools";
import Marquee from "react-double-marquee";
import { SopranoContext } from "../Context/SopranoContext";

let progressTimer = null;

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
        resetProgress();
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

    const onEnded = () => {
        if (state.playlist.length > 0) {
            handleNextTrack();
            return;
        }
        resetProgress();
        clearInterval(progressTimer);
        setPlayer({ status: "idle" });
    };

    const resetProgress = () => {
        const progress = document.getElementById("progress");
        progress.style.width = "0%";
    };

    const startProgress = (max_seconds) => {
        const progress = document.getElementById("progress");
        const audio = document.getElementById("audio");
        if (max_seconds > 0) {
            progressTimer = setInterval(function () {
                if (!audio.paused) {
                    const currTime = parseFloat(audio.currentTime);
                    const end = parseFloat(max_seconds);
                    const pct = ((currTime / end) * 100).toFixed(2);
                    //console.log({ currTime, end, pct });
                    progress.style.width = pct + "%";
                }
            }, 250);
        }
    };

    const startPlayback = (max_seconds) => {
        const audio = document.getElementById("audio");
        const progress = document.getElementById("progress");
        let seconds = 0;
        const pad = function (num, size) {
            return ("000" + num).slice(size * -1);
        };
        if (playtime && max_seconds > 0) {
            playtime.innerText = "0:00";
            playbackTimer = setInterval(function () {
                if (!audio.paused) {
                    if (seconds < max_seconds) {
                        seconds++;
                    } else {
                        return;
                    }
                    let time = parseFloat(seconds).toFixed(3);
                    let _hours = Math.floor(time / 60 / 60);
                    let _minutes = Math.floor(time / 60) % 60;
                    let _seconds = Math.floor(time - _minutes * 60);
                    let output = "";
                    if (_hours) output += pad(_hours, 1) + ":";
                    output += pad(_minutes, 1) + ":" + pad(_seconds, 2);
                    playtime.innerText = output;
                }
            }, 1000);
        }
    };

    const setTimer = (max_seconds) => {
        if (typeof max_seconds !== "undefined") startProgress(max_seconds);
    };

    const mediaSessionMeta = (title, artist, album, cover_src) => {
        if (cover_src && "mediaSession" in navigator) {
            navigator.mediaSession.metadata = new window.MediaMetadata({
                title: htmlDecode(title),
                artist: htmlDecode(artist),
                album: htmlDecode(album),
                artwork: [
                    { src: cover_src, sizes: "256x256", type: "image/jpeg" },
                ],
            });
            navigator.mediaSession.setActionHandler("play", handlePlayTrack);
            navigator.mediaSession.setActionHandler("pause", handlePauseTrack);
            /*navigator.mediaSession.setActionHandler('seekbackward', function() {});
            navigator.mediaSession.setActionHandler('seekforward', function() {});*/
            navigator.mediaSession.setActionHandler(
                "previoustrack",
                handlePrevTrack
            );
            navigator.mediaSession.setActionHandler(
                "nexttrack",
                handleNextTrack
            );
        }
    };

    let trackUrl =
        typeof currentTrack !== "undefined" && currentTrack.fingerprint
            ? `/api/track/stream/${currentTrack.fingerprint}`
            : null;

    // Override if podcast
    if (typeof currentTrack !== "undefined" && currentTrack.podcast_url)
        trackUrl = currentTrack.podcast_url;

    const playPauseIcon =
        player.status === "playing" ? (
            <FontAwesome name="pause" />
        ) : (
            <FontAwesome name="play" />
        );

    const shuffleClass = shuffle ? "text-success" : "";

    const cover_src = Object.entries(currentTrack).length
        ? currentTrack.cover
        : "/img/no-album.png";

    const progressExtra =
        player.status === "playing"
            ? "bg-success progress-bar-animated"
            : "bg-secondary";

    useEffect(() => {
        const audio = document.getElementById("audio");
        if (player.status === "playing") {
            audio.play();
        } else {
            audio.pause();
        }
        audio.onplay = handlePlayTrack;
        audio.onpause = handlePauseTrack;
        audio.onload = handleLoadingTrack;
        audio.onerror = handleError;
        audio.onended = onEnded;
    }, [player]);

    useEffect(() => {
        clearInterval(progressTimer);
        if (state.currentTrack) {
            setTimer(state.currentTrack.playtime_seconds);
            mediaSessionMeta(
                state.currentTrack.title,
                state.currentTrack.artist ?? "",
                state.currentTrack.album ?? state.currentTrack.podcast,
                state.currentTrack.cover
            );
        }
    }, [state.currentIndex, state.currentTrack]);

    return (
        <>
            <div className="progress progress-player bg-dark">
                <div
                    id="progress"
                    className={
                        "progress-bar progress-bar-striped " + progressExtra
                    }
                    role="progressbar"
                    aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: 0 }}
                />
            </div>
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
                        {player.status !== "idle" &&
                            player.status !== "loading" && (
                                <div>
                                    <div id="player-album" className="marquee">
                                        <Marquee>
                                            {currentTrack.album
                                                ? htmlDecode(currentTrack.album)
                                                : currentTrack.podcast}
                                        </Marquee>
                                    </div>
                                    <div
                                        id="player-artist-title"
                                        className="marquee"
                                    >
                                        <Marquee>
                                            {currentTrack.artist &&
                                            currentTrack.title
                                                ? htmlDecode(
                                                      currentTrack.artist
                                                  ) +
                                                  " " +
                                                  htmlDecode("&mdash;") +
                                                  " " +
                                                  htmlDecode(currentTrack.title)
                                                : currentTrack.title}
                                        </Marquee>
                                    </div>
                                </div>
                            )}
                        <div id="player-controls" className="d-flex">
                            <button
                                className="btn player-btn"
                                onClick={handlePrevTrack}
                                disabled={
                                    !state.playlist.length ? "disabled" : ""
                                }
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
                                disabled={
                                    !state.playlist.length ? "disabled" : ""
                                }
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
        </>
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
                                : htmlDecode(currentTrack.podcast)}
                            <br />
                            <small>
                                {currentTrack.year ?? currentTrack.title}
                            </small>
                        </h5>
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
                            className="btn btn-sm btn-outline-secondary"
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
