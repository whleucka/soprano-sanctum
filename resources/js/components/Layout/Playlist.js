import React from "react";
import PlaylistModule from "../Module/PlaylistModule";

const Playlist = ({ tracks }) => {
    return (
        <section id="playlist" className="content">
            <h1>Playlist</h1>
            <PlaylistModule tracks={tracks} />
        </section>
    );
};

export default Playlist;
