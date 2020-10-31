import React, { useContext } from "react";
import TrackRow from "./TrackRow";
import { Alert } from "../Utilities/Alerts";
import { SopranoContext } from "../Context/SopranoContext";

const PlaylistModule = () => {
    const { state, dispatch } = useContext(SopranoContext);
    const hasResults = state.playlist.length > 0;
    return (
        <>
            {hasResults &&
                state.playlist.map((track, i) => {
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
