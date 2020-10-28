import React from "react";
import TrackRow from "./TrackRow";

const PlaylistModule = ({ tracks }) => {
    const hasResults = tracks.length > 0;
    return (
        <>
            {hasResults &&
                tracks.map((track, i) => {
                    return <TrackRow track={track} key={i} />;
                })}
        </>
    );
};

export default PlaylistModule;
