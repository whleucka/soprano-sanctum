import React from "react";
import PlaylistsModule from "../Module/PlaylistsModule";
import { Info } from "../Utilities/Alerts";

const Playlists = ({ playlists }) => {
    return (
        <section id="playlists" className="content">
            <h1>Playlists</h1>
            {!playlists.length && <Info msg="No playlists created yet." />}
            {playlists.length > 0 && <PlaylistsModule playlists={playlists} />}
        </section>
    );
};

export default Playlists;
