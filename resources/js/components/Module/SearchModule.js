import React, { useState } from "react";
import FontAwesome from "react-fontawesome";

const SearchModule = () => {
    const [term, setTerm] = useState("");
    const [results, setResults] = useState([]);

    const handleInput = (e) => {
        setTerm(e.currentTarget.value);
    };

    const handleSubmit = (e) => {
        console.log("Pressed");
    };

    return (
        <>
            <div id="search-cont">
                <SearchInput
                    inputValue={term}
                    handleInput={handleInput}
                    handleSubmit={handleSubmit}
                />
            </div>
            <div id="results-cont">
                <SearchResults results={results} />
            </div>
        </>
    );
};

const SearchInput = ({ inputValue, handleInput, handleSubmit }) => {
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
            />
            <div className="input-group-append">
                <button
                    className="btn btn-success"
                    type="button"
                    onClick={handleSubmit}
                >
                    Search
                </button>
            </div>
        </div>
    );
};

const SearchResults = ({ results }) => {
    return (
        <>
            {!results.length && (
                <div className="alert alert-secondary my-2" role="alert">
                    <strong>
                        <FontAwesome name="info-circle" className="mr-2" />
                    </strong>
                    No results, try searching for an artist, album, title, or
                    genre!
                </div>
            )}
            {results.length > 0 && (
                <div className="row">
                    <div className="col">
                        <div className="d-flex">
                            <div className="search-row-cover"></div>
                            <div className="search-row-title"></div>
                            <div className="search-row-playtime-string"></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SearchModule;
