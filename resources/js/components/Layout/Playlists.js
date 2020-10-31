import React, { useContext } from "react";
import PlaylistsModule from "../Module/PlaylistsModule";
import { Info } from "../Utilities/Alerts";
import { SopranoContext } from "../Context/SopranoContext";

const Playlists = () => {
    const { state, dispatch } = useContext(SopranoContext);
    return (
        <section id="playlists" className="content">
            <h1>Playlists</h1>
            {!state.playlists.length && (
                <Info msg="No playlists created yet." />
            )}
            {state.playlists.length > 0 && <PlaylistsModule />}
        </section>
    );
};

export default Playlists;
