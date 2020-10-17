import React from "react";
import FontAwesome from "react-fontawesome";

const Player = () => {
    return (
        <div id="player">
            <div className="media">
                <img
                    id="player-cover-art"
                    className="d-flex mr-3"
                    alt="album cover"
                    src="/img/no-album.png"
                />
                <div id="player-cont" className="media-body">
                    <h5>
                        {"Artist"} - {"Title"}
                    </h5>
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
