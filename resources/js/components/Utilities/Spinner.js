import React from "react";
import BarLoader from "react-spinners/BarLoader";
import GridLoader from "react-spinners/GridLoader";

const BarSpinner = ({ loading, size, width, color }) => {
    if (loading === null) loading = true;
    return (
        <div className="sweet-loading">
            <BarLoader
                width={width ?? "100%"}
                size={size ?? 50}
                color={color ?? "#38c172"}
                loading={loading}
            />
        </div>
    );
};

const GridSpinner = ({ loading, size, margin, color }) => {
    if (loading === null) loading = true;
    return (
        <div className="sweet-loading">
            <GridLoader
                margin={margin ?? 2}
                size={size ?? 50}
                color={color ?? "#38c172"}
                loading={loading}
            />
        </div>
    );
};

export { BarSpinner, GridSpinner };
