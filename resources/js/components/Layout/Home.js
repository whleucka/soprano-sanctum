import React from "react";
import PlaylistModule from "../Module/PlaylistModule";

const Home = ({ tracks }) => {
    return (
        <section id="home" className="content">
            <h1>Current Playlist</h1>
            <PlaylistModule tracks={tracks} />
        </section>
    );
};

export default Home;
