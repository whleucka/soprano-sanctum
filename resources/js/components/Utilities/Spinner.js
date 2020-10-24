import React from "react";
import BarLoader from "react-spinners/BarLoader";

const BarSpinner = ({ loading, size, width, color }) => {
    return (
        <div className="sweet-loading">
            <BarLoader
                width={width ?? 100}
                size={size}
                color={color}
                loading={loading}
            />
        </div>
    );
};

export default BarSpinner;
