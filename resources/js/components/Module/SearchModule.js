import React, { useState } from "react";
import FontAwesome from "react-fontawesome";
import { Soprano } from "../Library/Soprano";

const SearchModule = () => {
    const [term, setTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const handleInput = (e) => {
        setTerm(e.currentTarget.value);
    };

    const handleSubmit = (e) => {
        setLoading(true);
        Soprano.search(term)
            .then((res) => {
                setResults(res);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
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
            <div id="results-cont" className="mt-2">
                {!results.length && !term && (
                    <div className="alert alert-secondary my-2" role="alert">
                        <strong>
                            <FontAwesome name="info-circle" className="mr-2" />
                        </strong>
                        No results, try searching for an artist, album, title,
                        or genre!
                    </div>
                )}
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
                    <FontAwesome name="search" className="mr-2" /> Search
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
                                        {result.artist} - {result.title}
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
