import React, { useContext, useState, useEffect } from "react";
import FontAwesome from "react-fontawesome";
import { htmlDecode } from "../Utilities/Tools";
import Marquee from "react-double-marquee";
import { SopranoContext } from "../Context/SopranoContext";

const Player = ({ currentTrack }) => {
    const { state, dispatch } = useContext(SopranoContext);
    const [player, setPlayer] = useState({
        status: "idle",
        shuffle: true,
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
        // Implement next track
        // dispatch nextTrack
    };

    const handlePrevTrack = () => {
        // Implement prev track
        // dispatch prevTrack
    };

    const handlePlayPauseTrack = () => {
        setPlayer({
            ...player,
            status: player.status === "paused" ? "playing" : "paused",
        });
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
        // TODO Make this a global state
        setPlayer({
            ...player,
            shuffle: !player.shuffle,
        });
    };

    const handleToggleRepeat = () => {};

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

    const shuffleClass = player.shuffle ? "text-success" : "";

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

    return (
        <div id="player">
            <audio id="audio" src={trackUrl} autoPlay />
            <div className="media">
                <img
                    id="player-cover-art"
                    className="d-flex mr-3"
                    alt="album cover"
                    src={
                        currentTrack.cover
                            ? currentTrack.cover
                            : "/img/no-album.png"
                    }
                />
                <div id="player-cont" className="media-body">
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
                    <div id="player-controls" className="d-flex">
                        <button
                            className="btn player-btn"
                            onClick={handlePrevTrack}
                        >
                            <FontAwesome name="step-backward" />
                        </button>
                        <button
                            className="btn player-btn"
                            onClick={handlePlayPauseTrack}
                        >
                            {playPauseIcon}
                        </button>
                        <button
                            className="btn player-btn"
                            onClick={handleNextTrack}
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
        </div>
    );
};

export default Player;
