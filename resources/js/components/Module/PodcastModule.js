import React, { useState, useContext } from "react";
import { Soprano } from "../Library/Soprano";
import SearchInput from "./SearchInput";
import FontAwesome from "react-fontawesome";
import { ListenNotes } from "../Library/Soprano";
import { SopranoContext } from "../Context/SopranoContext";
import { BarSpinner } from "../Utilities/Spinner";
import { htmlDecode } from "../Utilities/Tools";
import { Info } from "../Utilities/Alerts";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

const PodcastModule = () => {
    const { state, dispatch } = useContext(SopranoContext);
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
                        episode_id: result.id,
                        cover: result.image,
                        podcast: result.podcast.title_original,
                        publisher: result.podcast.publisher_original,
                        created: result.pub_date_ms,
                        title: result.title_original,
                        description: result.description_original,
                        link: result.link,
                        podcast_url: result.audio,
                        playtime_seconds: result.audio_length_sec,
                        podcast_id: result.podcast.id,
                        podcast_image: result.podcast.image,
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
                {!results.length &&
                    state.podcasts.length > 0 &&
                    term === "" && <PodcastFavorites />}
                {noResults && <Info msg="No podcasts found." />}
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

const PodcastFavorites = () => {
    const { state, dispatch } = useContext(SopranoContext);
    return (
        <>
            <h3 className="mt-2">Favorites</h3>
            {state.podcasts.length > 0 &&
                state.podcasts.map((result, i) => {
                    return (
                        <div key={i} className="media my-4 p-2">
                            <img
                                onClick={() => {}}
                                title={htmlDecode(result.title)}
                                className="d-flex podcast-cover mr-3"
                                src={result.image}
                                alt="podcast cover"
                            />
                            <div className="media-body">
                                <div
                                    onClick={() => {}}
                                    className="podcast-name"
                                >
                                    <h4 className="mt-0">
                                        <strong>
                                            {htmlDecode(result.title)}
                                        </strong>
                                    </h4>
                                </div>
                                <div className="podcast-publisher">
                                    <h5 className="mt-1">
                                        {htmlDecode(result.publisher)}
                                    </h5>
                                </div>
                                <div className="podcast-favorite-actions">
                                    <button className="btn btn-sm btn-outline-danger mt-2">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
        </>
    );
};

const SearchResults = ({ results, hasMore, loadMore }) => {
    const { state, dispatch } = useContext(SopranoContext);
    const timeAgo = new TimeAgo("en-US");
    const podcast_ids = [];
    state.podcasts.map((podcast) => podcast_ids.push(podcast.podcast_id));

    const handleTogglePodcast = async (
        e,
        podcastId,
        title,
        image,
        publisher
    ) => {
        e.preventDefault();
        const target = e.currentTarget;
        await Soprano.togglePodcast(podcastId, title, image, publisher).then(
            (res) => {
                if (res.toggle) {
                    target.classList.remove("text-secondary");
                    target.classList.add("text-danger");
                } else {
                    target.classList.add("text-secondary");
                    target.classList.remove("text-danger");
                }
            }
        );
        await Soprano.getPodcasts().then((res) =>
            dispatch({ type: "getPodcasts", payload: res })
        );
    };

    return (
        <>
            {results.length > 0 &&
                results.map((result, i) => {
                    const favorite_icon =
                        podcast_ids.indexOf(result.podcast_id) !== -1 ? (
                            <FontAwesome
                                name="heart"
                                className="text-danger ml-2"
                                onClick={(e) =>
                                    handleTogglePodcast(
                                        e,
                                        result.podcast_id,
                                        result.podcast,
                                        result.podcast_image,
                                        result.publisher
                                    )
                                }
                            />
                        ) : (
                            <FontAwesome
                                name="heart"
                                className="text-secondary ml-2"
                                onClick={(e) =>
                                    handleTogglePodcast(
                                        e,
                                        result.podcast_id,
                                        result.podcast,
                                        result.podcast_image,
                                        result.publisher
                                    )
                                }
                            />
                        );
                    const publish_date = timeAgo.format(result.created);
                    const playtime = new Date(result.playtime_seconds * 1000)
                        .toISOString()
                        .substr(11, 8);
                    return (
                        <div key={i} className="media my-4 p-2">
                            <img
                                onClick={() => {
                                    dispatch({
                                        type: "playTrack",
                                        payload: result,
                                    });
                                }}
                                title={htmlDecode(result.description)}
                                className="d-flex podcast-cover mr-3"
                                src={result.cover}
                                alt="podcast cover"
                            />
                            <div className="media-body podcast-details">
                                <div className="podcast-name">
                                    <h4 className="mt-0">
                                        <strong
                                            onClick={() => {
                                                dispatch({
                                                    type: "playTrack",
                                                    payload: result,
                                                });
                                            }}
                                        >
                                            {htmlDecode(result.podcast)}
                                        </strong>
                                        {favorite_icon}
                                    </h4>
                                </div>
                                <div
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const target =
                                            e.currentTarget.nextElementSibling;
                                        if (target.style.display === "none") {
                                            target.style.display = "block";
                                        } else {
                                            target.style.display = "none";
                                        }
                                    }}
                                    className="podcast-title"
                                >
                                    <h5 className="mt-1 cursor">
                                        {htmlDecode(result.title)}
                                    </h5>
                                </div>
                                <div
                                    className="podcast-description"
                                    style={{ display: "none" }}
                                >
                                    <p>{htmlDecode(result.description)}</p>
                                </div>
                                <div>
                                    <p>
                                        <small>
                                            {publish_date}
                                            {playtime !== "00:00:00"
                                                ? " | " + playtime
                                                : ""}
                                        </small>
                                    </p>
                                </div>
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
