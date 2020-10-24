import React from "react";
import BarLoader from "react-spinners/BarLoader";

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

export default BarSpinner;
