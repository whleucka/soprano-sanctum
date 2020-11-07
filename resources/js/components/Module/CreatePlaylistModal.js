import React, { useState, useContext } from "react";
import { SopranoContext } from "../Context/SopranoContext";
import { Soprano } from "../Library/Soprano";
import Errors from "../Utilities/Errors";

const CreatePlaylistModal = () => {
    const { state, dispatch } = useContext(SopranoContext);
    const [name, setName] = useState("");
    const errorState = {
        message: "",
        errors: [],
    };
    const [errors, setErrors] = useState(errorState);
    const resetErrors = () => {
        setErrors(errorState);
    };

    const handleAddPlaylist = (e) => {
        e.preventDefault();
        if (name) {
            Soprano.addPlaylist(name)
                .then((res) => {
                    dispatch({ type: "addPlaylist", payload: res });
                    document.getElementById("addPlaylistModalClose").click();
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
            id="createPlaylistModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="modalTitle"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modalTitle">
                            Create Playlist
                        </h5>
                    </div>
                    <div className="modal-body">
                        <Errors
                            message={errors.message}
                            errors={errors.errors["name"]}
                        />
                        <div className="form-group text-left">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                                className="form-control"
                                id="name"
                                placeholder="Mix 2004..."
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            id="addPlaylistModalClose"
                            className="btn btn-sm btn-secondary"
                            data-dismiss="modal"
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={handleAddPlaylist}
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

export default CreatePlaylistModal;
