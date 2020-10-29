import React, { useState, useContext } from "react";
import SearchInput from "./SearchInput";
import { Soprano } from "../Library/Soprano";
import { SopranoContext } from "../Context/SopranoContext";
import { htmlDecode } from "../Utilities/Tools";

const PodcastModule = () => {
    const { state, dispatch } = useContext(SopranoContext);
    const [term, setTerm] = useState("");
    const [results, setResults] = useState([]);
    const [noResults, setNoResults] = useState(false);

    const handleInput = (e) => {
        const input = e.currentTarget.value;
        if (input.trim() !== "") setNoResults(false);
        setTerm(input);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Soprano.searchPodcastEpisode(term).then((res) => {
            if (!res.count) setNoResults(true);
            const podcast_results = res.results;
            let podcasts = [];
            podcast_results.map((result) => {
                const podcast = {
                    cover: result.image,
                    podcast: result.podcast.title_original,
                    publisher: result.podcast.publisher_original,
                    title: result.title_original,
                    description: result.description_original,
                    link: result.link,
                    podcast_url: result.audio,
                    playtime_seconds: result.audio_length_sec,
                };
                podcasts.push(podcast);
            });
            setResults(podcasts);
        });
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
                {results.length > 0 &&
                    results.map((result) => {
                        return (
                            <>
                                <div
                                    className="media cursor my-4"
                                    onClick={() => {
                                        dispatch({
                                            type: "playTrack",
                                            payload: result,
                                        });
                                    }}
                                >
                                    <img
                                        className="d-flex podcast-cover mr-3"
                                        src={result.cover}
                                        alt="podcast cover"
                                    />
                                    <div className="media-body">
                                        <h4 className="mt-0">
                                            {htmlDecode(result.podcast)}
                                        </h4>
                                        <h5 className="mt-1">
                                            {htmlDecode(result.title)}
                                        </h5>
                                        {htmlDecode(result.description)}
                                    </div>
                                </div>
                            </>
                        );
                    })}
            </div>
        </>
    );
};

export default PodcastModule;
