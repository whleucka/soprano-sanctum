import React, { useContext, useState, useEffect } from "react";
import FontAwesome from "react-fontawesome";
import { SopranoContext } from "../Context/SopranoContext";
import { Soprano } from "../Library/Soprano";
import Errors from "../Utilities/Errors";

const DirectoryModule = () => {
    const { state, dispatch } = useContext(SopranoContext);
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
                {showAddDirectory && <span>Cancel</span>}
                {!showAddDirectory && <span>Add</span>}
            </button>
            <h4>Directories</h4>
            {showAddDirectory && (
                <div className="mx-auto">
                    <div className="alert alert-info mt-4 mb-1" role="alert">
                        <strong>
                            <FontAwesome name="info-circle" className="mr-2" />
                        </strong>
                        Add a directory path that is located on the server.
                        Press the scan button when you're ready to synchronize
                        the database. Accepted formats are mp3, m4a, flac, ogg.
                    </div>
                    <div className="pb-3 pt-2">
                        <AddDirectory
                            hideAddDirectory={() => {
                                setShowAddDirectory(false);
                            }}
                        />
                    </div>
                </div>
            )}
            {state.directories &&
                state.directories.length > 0 &&
                state.directories.map((directory, i) => {
                    return <Directory key={i} directory={directory} />;
                })}
        </div>
    );
};

const Directory = ({ directory }) => {
    const { state, dispatch } = useContext(SopranoContext);
    const [progress, setProgress] = useState(0);
    const [scanning, setScanning] = useState(false);

    const handleRemoveDirectory = (e) => {
        const id = parseInt(e.currentTarget.id);
        Soprano.removeDirectory(id).then((res) => {
            dispatch({ type: "removeDirectory", payload: id });
        });
    };

    const handleScanDirectory = (e) => {
        const id = parseInt(e.currentTarget.id);
        Soprano.scanDirectory(id).then((res) => {
            setScanning(true);
            const count = res.count;
            const paths = res.paths;
            paths.map((path, i) => {
                const path_arr = path.split("/");
                const filename = path_arr[path_arr.length - 1];
                Soprano.synchTrack(path)
                    .then((_res) => {
                        console.log(`Synchronizing ${filename}`);
                        const pct = (i / count) * 100;
                        setProgress(pct);
                        if (i === paths.length - 1) setScanning(false);
                    })
                    .catch((err) => {
                        setScanning(false);
                    });
            });
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
                        onClick={handleScanDirectory}
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