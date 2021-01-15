import React, { useContext, useEffect, useState } from "react";
import Avatar from "react-avatar";
import FontAwesome from "react-fontawesome";
import { useHistory } from "react-router-dom";

import { SopranoContext } from "../Context/SopranoContext";
import { Soprano } from "../Library/Soprano";
import { Info } from "../Utilities/Alerts";
import { BarSpinner, GridSpinner } from "../Utilities/Spinner";
import { htmlDecode } from "../Utilities/Tools";

import SavePlaylistModal from "./SavePlaylistModal";
import SearchInput from "./SearchInput";
import TrackRow from "./TrackRow";

const SearchModule = () => {
    const { state, dispatch } = useContext(SopranoContext);
    const [term, setTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const history = useHistory();

    const search = (searchTerm) => {
        if (searchTerm.trim() !== "") {
            setLoading(true);
            Soprano.search(searchTerm).then((res) => {
                if (!res.length) setNoResults(true);
                else setNoResults(false);
                setResults(res);
                setLoading(false);
            });
        } else {
            setTerm("");
        }
    };

    const handleInput = (e) => {
        const input = e.currentTarget.value;
        if (input.trim() !== "") setNoResults(false);
        setTerm(input);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        search(term);
    };

    const handleClear = (e) => {
        e.preventDefault();
        setResults([]);
        setTerm("");
        setNoResults(false);
    };

    const handleCopyPlaylist = (e) => {
        e.preventDefault();
        dispatch({ type: "copyPlaylist", payload: results });
        dispatch({ type: "changeTrack", payload: 0 });
        history.push("/home");
    };

    const handleAddToPlaylist = async (e) => {
        e.preventDefault();
        const playlist_id = e.currentTarget.id;
        let insert_tracks = [];
        results.map((track) => insert_tracks.push(track.id));
        await Soprano.savePlaylist(playlist_id, insert_tracks);
        await Soprano.loadPlaylist(playlist_id).then((res) => {
            dispatch({ type: "copyPlaylist", payload: res });
            history.push("/home");
        });
    };

    const callback = (e) => {
        const set = e.currentTarget.dataset;
        if (set.type === "album") {
            setLoading(true);
            Soprano.album(set.artist, set.album).then((res) => {
                if (!res.length) setNoResults(true);
                else setResults(res);
                setLoading(false);
            });
        } else if (set.type === "artist") {
            setLoading(true);
            Soprano.artist(set.artist).then((res) => {
                if (!res.length) setNoResults(true);
                else setResults(res);
                setLoading(false);
            });
        } else {
            console.log("Unknown callback, trackRow");
        }
    };

    return (
        <>
            <div id="search-cont" className="pt-2">
                <SearchInput
                    placeholder="Artist, Album, Track, Genre..."
                    inputValue={term}
                    handleInput={handleInput}
                    handleSubmit={handleSubmit}
                    handleClear={handleClear}
                />
            </div>
            <div id="results-cont" className="mt-2">
                {noResults && (
                    <Info msg="No results found. Please search for an artist, album, track, or genre." />
                )}
                {!loading && !term && !results.length && (
                    <div>
                        <Genres
                            handleClick={(e, genre) => {
                                e.preventDefault();
                                search(genre);
                            }}
                        />
                        <Years
                            handleClick={(e, year) => {
                                e.preventDefault();
                                search(year);
                            }}
                        />
                    </div>
                )}
                {loading && <BarSpinner width={"80%"} />}
                {results.length > 0 && (
                    <div id="search-actions" className="py-2">
                        <button
                            className="btn btn-sm btn-success mr-1"
                            onClick={handleCopyPlaylist}
                        >
                            <FontAwesome name="play" className="mr-2" />{" "}
                            Playlist
                        </button>
                        <div
                            className="dropdown mr-1"
                            style={{ display: "inline" }}
                        >
                            <button
                                className="btn btn-success btn-sm dropdown-toggle"
                                type="button"
                                id="playlistMenu"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <FontAwesome name="plus" className="mr-2" />{" "}
                                Playlist
                            </button>
                            <div
                                className="dropdown-menu"
                                aria-labelledby="playlistMenu"
                            >
                                {state.playlists.length > 0 &&
                                    state.playlists.map((playlist, i) => {
                                        return (
                                            <a
                                                key={i}
                                                onClick={handleAddToPlaylist}
                                                id={playlist.id}
                                                className="dropdown-item"
                                                href="#!"
                                            >
                                                {playlist.name}
                                            </a>
                                        );
                                    })}
                                {!state.playlists.length && (
                                    <a
                                        className="dropdown-item disabled"
                                        href="#!"
                                    >
                                        No playlists added yet
                                    </a>
                                )}
                            </div>
                        </div>
                        <button
                            data-toggle="modal"
                            data-target="#savePlaylistModal"
                            className="btn btn-sm btn-success"
                        >
                            <FontAwesome name="save" className="mr-2" />{" "}
                            Playlist
                        </button>
                    </div>
                )}
                <SearchResults callback={callback} results={results} />
                <SavePlaylistModal tracks={results} />
            </div>
        </>
    );
};
const SearchResults = ({ results, callback }) => {
    const hasResults = results.length > 0;
    return (
        <>
            {hasResults &&
                results.map((result, i) => {
                    return (
                        <TrackRow
                            type={"search"}
                            index={i}
                            track={result}
                            key={i}
                            callback={callback}
                        />
                    );
                })}
        </>
    );
};

const Genres = ({ handleClick }) => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        setLoading(true);
        Soprano.getGenres().then((res) => {
            if (!res.length) setNoResults(true);
            else setNoResults(false);
            setGenres(res);
            setLoading(false);
        });
    }, []);

    return (
        <section id="genre" className="mt-4">
            <h3>Genre</h3>
            {loading && <GridSpinner size={14} />}
            {noResults && <Info msg="No genres found." />}
            <div
                id="genre-cont"
                className="d-flex justify-content-around flex-wrap"
            >
                {genres.map((genre, i) => {
                    return (
                        <Avatar
                            key={i}
                            onClick={(e) => {
                                handleClick(e, genre);
                            }}
                            className="grid-icon m-2"
                            title={name}
                            value={htmlDecode(genre)}
                        />
                    );
                })}
            </div>
        </section>
    );
};

const Years = ({ handleClick }) => {
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        setLoading(true);
        Soprano.getYears().then((res) => {
            if (!res.length) setNoResults(true);
            else setNoResults(false);
            setYears(res);
            setLoading(false);
        });
    }, []);

    return (
        <section id="year" className="mt-4">
            <h3>Year</h3>
            {loading && <GridSpinner size={14} />}
            {noResults && <Info msg="No years found." />}
            <div
                id="years-cont"
                className="d-flex justify-content-around flex-wrap"
            >
                {years.map((year, i) => {
                    if (year.length !== 4) return;
                    return (
                        <Avatar
                            key={i}
                            onClick={(e) => {
                                handleClick(e, year);
                            }}
                            className="grid-icon m-2"
                            title={year}
                            value={year}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default SearchModule;
