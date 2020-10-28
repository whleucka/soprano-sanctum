import React from "react";
import TrackRow from "./TrackRow";
import { Alert } from "../Utilities/Alerts";

const PlaylistModule = ({ tracks }) => {
    const hasResults = tracks.length > 0;
    return (
        <>
            {hasResults &&
                tracks.map((track, i) => {
                    return (
                        <TrackRow
                            type={"playlist"}
                            index={i}
                            track={track}
                            key={i}
                        />
                    );
                })}
            {!hasResults && <Alert msg="No tracks are currently queued." />}
        </>
    );
};

export default PlaylistModule;
