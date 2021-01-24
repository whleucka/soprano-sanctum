import React from "react";
import FontAwesome from "react-fontawesome";

const SearchInput = ({
    inputValue,
    handleInput,
    handleSubmit,
    handleClear,
    placeholder,
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
                placeholder={placeholder}
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
                    id="search-reset"
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

export default SearchInput;
