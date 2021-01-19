import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { SopranoContext } from "../Context/SopranoContext";
import { Soprano } from "../Library/Soprano";
import Errors from "../Utilities/Errors";

const SavePlaylistModal = ({ tracks }) => {
    const { state, dispatch } = useContext(SopranoContext);
    const [name, setName] = useState("");
    const history = useHistory();
    const errorState = {
        message: "",
        errors: [],
    };
    const [errors, setErrors] = useState(errorState);
    const resetErrors = () => {
        setErrors(errorState);
    };

    const savePlaylist = async (playlist_id) => {
        let insert_tracks = [];
        tracks.map((track) => insert_tracks.push(track.id));
        await Soprano.savePlaylist(playlist_id, insert_tracks);
        await Soprano.loadPlaylist(playlist_id).then((res) => {
            dispatch({ type: "copyPlaylist", payload: res });
            history.push("/home");
        });
    };

    const handleSavePlaylist = (e) => {
        e.preventDefault();
        if (name) {
            Soprano.addPlaylist(name)
                .then((res) => {
                    dispatch({ type: "addPlaylist", payload: res });
                    savePlaylist(res.id);
                    document.getElementById("savePlaylistModalClose").click();
                    setName("");
                })
                .catch((err) => {
                    if (err.response && err.response.status === 422) {
                        setErrors(err.response.data);
                    }
                });
        } else {
            resetErrors();
        }
    };

    return (
        <div
            className="modal"
            id="savePlaylistModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="modalTitle"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalTitle">
                            Save Playlist
                        </h5>
                    </div>
                    <div className="modal-body">
                        <Errors
                            message={errors.message}
                            errors={errors.errors["name"]}
                        />
                        <div className="form-group text-left">
                            <label htmlFor="modal-name">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                className="form-control"
                                id="modal-name"
                                placeholder="Mix 2004..."
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            id="savePlaylistModalClose"
                            className="btn btn-sm btn-secondary"
                            data-dismiss="modal"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={handleSavePlaylist}
                            className="btn btn-sm btn-success"
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavePlaylistModal;
