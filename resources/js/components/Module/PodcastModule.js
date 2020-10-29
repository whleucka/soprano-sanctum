import React, { useState } from "react";
import SearchInput from "./SearchInput";

const PodcastModule = () => {
    const [term, setTerm] = useState("");
    const [noResults, setNoResults] = useState(false);

    const handleInput = (e) => {
        const input = e.currentTarget.value;
        if (input.trim() !== "") setNoResults(false);
        setTerm(input);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleClear = (e) => {
        e.preventDefault();
        setResults([]);
        setTerm("");
        setNoResults(false);
    };
    return (
        <>
            <div id="search-cont" className="pt-2">
                <SearchInput
                    placeholder="Search for podcasts or episodes"
                    inputValue={term}
                    handleInput={handleInput}
                    handleSubmit={handleSubmit}
                    handleClear={handleClear}
                />
            </div>
        </>
    );
};

export default PodcastModule;
