import React from "react";
import FontAwesome from "react-fontawesome";
import { htmlDecode } from "../Utilities/Tools";

const Player = ({ currentTrack }) => {
    return (
        <div id="player">
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
                        <span id="player-album">
                            {currentTrack.album
                                ? htmlDecode(currentTrack.album)
                                : "No Album"}
                        </span>
                        <br />
                        <span id="player-artist-title">
                            {currentTrack.artist
                                ? htmlDecode(currentTrack.artist)
                                : "No Artist"}
                            {" - "}
                            {currentTrack.title
                                ? htmlDecode(currentTrack.title)
                                : "No Title"}
                        </span>
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
