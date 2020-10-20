import React from "react";

const Errors = ({ message, errors }) => {
    return (
        <>
            {message && (
                <div className="alert alert-danger" role="alert">
                    <strong>{message}</strong>
                    <ul style={{ paddingLeft: "20px" }}>
                        {errors.map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Errors;
