import React from "react";
import FontAwesome from "react-fontawesome";
import { htmlDecode } from "../Utilities/Tools";
import Marquee from "react-double-marquee";

const Player = ({ currentTrack }) => {
    const trackUrl =
        typeof currentTrack !== "undefined" && currentTrack.fingerprint
            ? `/api/track/stream/${currentTrack.fingerprint}`
            : null;

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
                        <button className="btn player-btn">
                            <FontAwesome name="step-backward" />
                        </button>
                        <button className="btn player-btn">
                            <FontAwesome name="play" />
                        </button>
                        <button className="btn player-btn">
                            <FontAwesome name="step-forward" />
                        </button>
                        <button className="btn player-btn">
                            <FontAwesome name="random" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Player;
