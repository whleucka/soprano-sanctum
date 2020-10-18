import React, { useContext, useState, useEffect } from "react";
import FontAwesome from "react-fontawesome";
import { SopranoContext } from "../Context/SopranoContext";
import { Soprano } from "../Library/Soprano";

const DirectoryModule = () => {
    const { state, dispatch } = useContext(SopranoContext);
    const [progress, setProgress] = useState(0);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        Soprano.getDirectories().then((res) => {
            dispatch({ type: "getDirectories", payload: res });
        });
    }, []);

    return (
        <div id="directories">
            <button className="btn btn-sm float-right mr-2 btn-success">
                Add
            </button>
            <h4>Directories</h4>
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
                    >
                        <FontAwesome name="trash" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DirectoryModule;
