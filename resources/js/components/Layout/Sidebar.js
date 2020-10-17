import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import FontAwesome from "react-fontawesome";

const Menu = () => {
    return (
        <nav id="sidebar" className="text-center">
            <ul className="navbar-nav">
                <Link to="/home">
                    <li className="navbar-item">
                        <FontAwesome name="headphones" className="mr-2" />
                        <span className="link-toggle">Playlist</span>
                    </li>
                </Link>
                <Link to="/search">
                    <li className="navbar-item">
                        <FontAwesome name="search" className="mr-2" />
                        <span className="link-toggle">Search</span>
                    </li>
                </Link>
                <Link to="/admin">
                    <li className="navbar-item">
                        <FontAwesome name="lock" className="mr-2" />
                        <span className="link-toggle">Admin</span>
                    </li>
                </Link>
            </ul>
        </nav>
    );
};

export default Menu;
