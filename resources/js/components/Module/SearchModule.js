import React, { useState, useContext, useEffect } from "react";
import { SopranoContext } from "../Context/SopranoContext";
import FontAwesome from "react-fontawesome";
import { Soprano } from "../Library/Soprano";
import TrackRow from "./TrackRow";
import { BarSpinner, GridSpinner } from "../Utilities/Spinner";
import { Info } from "../Utilities/Alerts";
import Avatar from "react-avatar";
import { useHistory } from "react-router-dom";

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

    return (
        <>
            <div id="search-cont" className="pt-2">
                <SearchInput
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
                            className="btn btn-sm btn-success"
                            onClick={handleCopyPlaylist}
                        >
                            <FontAwesome name="play" />
                        </button>
                    </div>
                )}
                <SearchResults results={results} />
            </div>
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
                            value={genre}
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

const SearchInput = ({
    inputValue,
    handleInput,
    handleSubmit,
    handleClear,
}) => {
    const handleKeyUp = (e) => {
        if (e.keyCode === 13) {
            // Enter key
            e.preventDefault();
            handleSubmit(e);
        } else if (e.keyCode === 27) {
            // Escape key
            e.preventDefault();
            handleClear(e);
        }
    };

    return (
        <div className="input-group">
            <input
                type="text"
                className="form-control"
                placeholder="Artist, Album, Title, Genre..."
                aria-label=""
                value={inputValue}
                aria-describedby=""
                onChange={(e) => handleInput(e)}
                onKeyUp={handleKeyUp}
            />
            <div className="input-group-append">
                <button
                    id="btn-search"
                    className="btn btn-success"
                    type="button"
                    onClick={handleSubmit}
                >
                    <FontAwesome name="search" className="mr-2" />
                </button>
                <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={handleClear}
                >
                    <FontAwesome name="undo" className="mr-2" />
                </button>
            </div>
        </div>
    );
};

const SearchResults = ({ results }) => {
    const hasResults = results.length > 0;
    return (
        <>
            {hasResults &&
                results.map((result, i) => {
                    return <TrackRow track={result} key={i} />;
                })}
        </>
    );
};

export default SearchModule;
