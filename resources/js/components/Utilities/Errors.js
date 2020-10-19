import React from "react";

const Errors = ({ message, errors }) => {
    return (
        <div>
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
        </div>
    );
};

export default Errors;
