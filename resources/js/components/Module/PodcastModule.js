import React, { useState, useContext } from "react";
import SearchInput from "./SearchInput";
import { ListenNotes } from "../Library/Soprano";
import { SopranoContext } from "../Context/SopranoContext";
import { BarSpinner } from "../Utilities/Spinner";
import { htmlDecode } from "../Utilities/Tools";
import FontAwesome from "react-fontawesome";

const PodcastModule = () => {
    const [term, setTerm] = useState("");
    const [offset, setOffset] = useState(0);
    const [sortByDate, setSortByDate] = useState(1);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(0);

    const handleInput = (e) => {
        const input = e.currentTarget.value;
        if (input.trim() !== "") setNoResults(false);
        setTerm(input);
    };

    const searchEpisode = (searchTerm, append = true) => {
        if (searchTerm.trim() !== "") {
            setLoading(true);
            ListenNotes.searchEpisode(term, offset, sortByDate).then((res) => {
                if (!res.count) setNoResults(true);
                const podcast_results = res.results;
                let podcasts = [];
                podcast_results.map((result) => {
                    const podcast = {
                        cover: result.image,
                        podcast: result.podcast.title_original,
                        publisher: result.podcast.publisher_original,
                        created: result.pub_date_ms,
                        title: result.title_original,
                        description: result.description_original,
                        link: result.link,
                        podcast_url: result.audio,
                        playtime_seconds: result.audio_length_sec,
                    };
                    podcasts.push(podcast);
                });
                if (append) setResults([...results, ...podcasts]);
                else setResults(podcasts);
                setOffset(res.next_offset);
                setTotal(res.total);
                setCount(res.count);
                setLoading(false);
            });
        } else {
            setTerm("");
        }
    };

    const resetPodcasts = () => {
        setResults([]);
        setOffset(0);
        setTotal(0);
        setNoResults(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        resetPodcasts();
        searchEpisode(term, false);
    };

    const handleClear = (e) => {
        e.preventDefault();
        resetPodcasts();
        setTerm("");
    };
    return (
        <>
            <div id="search-cont" className="pt-2">
                <SearchInput
                    placeholder="Podcasts or episodes"
                    inputValue={term}
                    handleInput={handleInput}
                    handleSubmit={handleSubmit}
                    handleClear={handleClear}
                />
                <div id="promo-powered" className="text-right">
                    <img
                        src="/img/listennote.png"
                        alt="listen note"
                        id="listennote"
                    />
                </div>
                {loading && <BarSpinner width={"80%"} />}
                <SearchResults
                    hasMore={offset < Math.floor(total / 10)}
                    results={results}
                    loadMore={() => {
                        searchEpisode(term);
                    }}
                />
            </div>
        </>
    );
};

const SearchResults = ({ results, hasMore, loadMore }) => {
    const { state, dispatch } = useContext(SopranoContext);
    return (
        <>
            {results.length > 0 &&
                results.map((result, i) => {
                    const publish_date = new Date(result.created);
                    const playtime = new Date(result.playtime_seconds * 1000)
                        .toISOString()
                        .substr(11, 8);
                    return (
                        <div key={i} className="media cursor my-4 p-2">
                            <img
                                title={htmlDecode(result.description)}
                                className="d-flex podcast-cover mr-3"
                                src={result.cover}
                                alt="podcast cover"
                            />
                            <div className="media-body podcast-details">
                                <button
                                    className="btn btn-sm btn-success podcast-play"
                                    onClick={() => {
                                        dispatch({
                                            type: "playTrack",
                                            payload: result,
                                        });
                                    }}
                                >
                                    <FontAwesome name="play" />
                                </button>
                                <h4 className="mt-0">
                                    {htmlDecode(result.podcast)}
                                </h4>
                                <h5
                                    className="mt-1"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const self = e.currentTarget;
                                        const target =
                                            self.childNodes[1].childNodes[3];
                                        if (target.style.display === "none") {
                                            target.style.display = "block";
                                        } else {
                                            target.style.display = "none";
                                        }
                                    }}
                                >
                                    {htmlDecode(result.title)}
                                </h5>
                                <div
                                    className="podcast-description"
                                    style={{ display: "none" }}
                                >
                                    <p>{htmlDecode(result.description)}</p>
                                </div>
                                <small>
                                    {publish_date.toLocaleDateString()}{" "}
                                    {publish_date.toLocaleTimeString()}{" "}
                                    {playtime !== "00:00:00"
                                        ? "| " + playtime
                                        : ""}
                                </small>
                            </div>
                        </div>
                    );
                })}
            {hasMore && (
                <div className="text-center">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            loadMore();
                            document
                                .getElementsByClassName("content")[0]
                                .scrollBy(0, window.scrollY - 100);
                        }}
                        className="btn btn-success"
                    >
                        Load More
                    </button>
                </div>
            )}
        </>
    );
};

export default PodcastModule;
