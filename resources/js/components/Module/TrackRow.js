import React, { useContext } from "react";
import { SopranoContext } from "../Context/SopranoContext";
import { htmlDecode } from "../Utilities/Tools";

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
    return (
        <div className="row resultRow">
            <div className="col">
                <div className="d-flex">
                    <div className="search-row-cover">
                        <img
                            className="search-album-cover"
                            src={track.cover}
                            alt="cover"
                        />
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
