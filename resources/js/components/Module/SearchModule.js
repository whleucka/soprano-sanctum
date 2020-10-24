import React, { useState } from "react";
import FontAwesome from "react-fontawesome";
import { Soprano } from "../Library/Soprano";
import { htmlDecode } from "../Utilities/Tools";
import BarSpinner from "../Utilities/Spinner";

const SearchModule = () => {
    const [term, setTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    // TODO I don't like this, but I am not sure
    //      what to do about no results coming back from
    //      API. We need a flag when the term != '' and
    //      results.length > 0, but it can only be displayed
    //      when the button is pressed ???
    const [noResults, setNoResults] = useState(false);
    const handleInput = (e) => {
        setTerm(e.currentTarget.value);
    };

    const handleSubmit = (e) => {
        setLoading(true);
        Soprano.search(term)
            .then((res) => {
                if (res.length) {
                    setNoResults(false);
                    setResults(res);
                } else {
                    setNoResults(true);
                    setResults([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    };

    const handleClear = (e) => {
        setResults([]);
        setTerm("");
    };

    return (
        <>
            <div id="search-cont">
                <SearchInput
                    inputValue={term}
                    handleInput={handleInput}
                    handleSubmit={handleSubmit}
                    handleClear={handleClear}
                />
            </div>
            <div id="results-cont" className="mt-2">
                {noResults && (
                    <div className="alert alert-secondary my-2" role="alert">
                        <strong>
                            <FontAwesome name="info-circle" className="mr-2" />
                        </strong>
                        No results, try searching for an artist, album, title,
                        or genre!
                    </div>
                )}
                {loading && (
                    <BarSpinner
                        loading={loading}
                        size={50}
                        color={"#38c172"}
                        width={"80%"}
                    />
                )}
                <SearchResults results={results} />
            </div>
        </>
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
                    className="btn btn-success"
                    type="button"
                    onClick={handleSubmit}
                >
                    <FontAwesome name="search" className="mr-2" /> Search
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
                    return (
                        <div key={i} className="row resultRow">
                            <div className="col">
                                <div className="d-flex">
                                    <div className="search-row-cover">
                                        <img
                                            className="search-album-cover"
                                            src="/img/no-album.png"
                                            alt="cover"
                                        />
                                    </div>
                                    <div className="search-row-title truncate w-100">
                                        {htmlDecode(result.artist)} -{" "}
                                        {htmlDecode(result.title)}
                                    </div>
                                    <div className="search-row-playtime-string">
                                        {result.playtime_string}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
        </>
    );
};

export default SearchModule;
