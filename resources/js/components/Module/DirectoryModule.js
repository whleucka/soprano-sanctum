import React, { useContext, useState, useEffect } from "react";
import FontAwesome from "react-fontawesome";
import { SopranoContext } from "../Context/SopranoContext";
import { Soprano } from "../Library/Soprano";
import Errors from "../Utilities/Errors";

const DirectoryModule = () => {
    const { state, dispatch } = useContext(SopranoContext);
    const [progress, setProgress] = useState(0);
    const [scanning, setScanning] = useState(false);
    const [showAddDirectory, setShowAddDirectory] = useState(false);

    useEffect(() => {
        Soprano.getDirectories().then((res) => {
            dispatch({ type: "getDirectories", payload: res });
        });
    }, []);

    return (
        <div id="directories">
            <button
                className="btn btn-sm float-right mr-2 btn-success"
                onClick={() => {
                    setShowAddDirectory(!showAddDirectory);
                }}
            >
                Add
            </button>
            <h4>Directories</h4>
            {showAddDirectory && (
                <div className="container py-2">
                    <AddDirectory
                        hideAddDirectory={() => {
                            setShowAddDirectory(false);
                        }}
                    />
                </div>
            )}
            {state.directories &&
                state.directories.length > 0 &&
                state.directories.map((directory, i) => {
                    return <Directory key={i} directory={directory} />;
                })}
            {scanning && (
                <div className="progress scan-progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
};

const Directory = ({ directory }) => {
    const { state, dispatch } = useContext(SopranoContext);

    const handleRemoveDirectory = (e) => {
        const id = parseInt(e.currentTarget.id);
        Soprano.removeDirectory(id).then((res) => {
            dispatch({ type: "removeDirectory", payload: id });
        });
    };

    return (
        <div>
            <div className="truncate dir-path w-100 pt-1">
                {directory.path}
                <div className="directory-actions d-inline">
                    <button
                        id={directory.id}
                        className="btn btn-sm btn-primary float-right"
                    >
                        <FontAwesome name="retweet" />
                    </button>
                    <button
                        id={directory.id}
                        className="btn btn-sm btn-danger float-right"
                        onClick={handleRemoveDirectory}
                    >
                        <FontAwesome name="trash" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const AddDirectory = ({ hideAddDirectory }) => {
    const { state, dispatch } = useContext(SopranoContext);
    const [path, setPath] = useState("");
    const errorState = {
        message: "",
        errors: [],
    };
    const [errors, setErrors] = useState(errorState);
    const resetErrors = () => {
        setErrors(errorState);
    };

    const handleAddDirectory = (e) => {
        if (path) {
            Soprano.addDirectory(path)
                .then((res) => {
                    dispatch({ type: "addDirectory", payload: res });
                    hideAddDirectory();
                    resetErrors();
                })
                .catch((err) => {
                    if (err.response && err.response.status === 422) {
                        setErrors(err.response.data);
                    }
                });
        } else {
            hideAddDirectory();
            resetErrors();
        }
    };

    return (
        <div>
            <Errors message={errors.message} errors={errors.errors["path"]} />
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">Path</span>
                </div>
                <input
                    type="text"
                    className="form-control"
                    value={path}
                    placeholder="/"
                    onChange={(e) => {
                        setPath(e.currentTarget.value);
                    }}
                />
                <div className="input-group-append">
                    <button
                        onClick={handleAddDirectory}
                        className="btn btn-sm btn-secondary"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DirectoryModule;
