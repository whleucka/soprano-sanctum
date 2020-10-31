import React from "react";
import PlaylistModule from "../Module/PlaylistModule";

const Home = () => {
    return (
        <section id="home" className="content">
            <h1>Current Playlist</h1>
            <PlaylistModule />
        </section>
    );
};

export default Home;
