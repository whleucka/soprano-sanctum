import React from "react";
import FontAwesome from "react-fontawesome";

const Info = ({ msg, classes }) => {
    return (
        <div className={"alert alert-info my-2 " + classes} role="alert">
            <strong>
                <FontAwesome name="info-circle" className="mr-2" />
            </strong>
            {msg}
        </div>
    );
};

const Alert = ({ msg, classes }) => {
    return (
        <div className={"alert alert-info my-2 " + classes} role="alert">
            <strong>
                <FontAwesome name="info-circle" className="mr-2" />
            </strong>
            {msg}
        </div>
    );
};

const Warning = ({ msg, classes }) => {
    return (
        <div className={"alert alert-info my-2 " + classes} role="alert">
            <strong>
                <FontAwesome name="info-circle" className="mr-2" />
            </strong>
            {msg}
        </div>
    );
};

const Danger = ({ msg, classes }) => {
    return (
        <div className={"alert alert-info my-2 " + classes} role="alert">
            <strong>
                <FontAwesome name="info-circle" className="mr-2" />
            </strong>
            {msg}
        </div>
    );
};

const Success = ({ msg, classes }) => {
    return (
        <div className={"alert alert-info my-2 " + classes} role="alert">
            <strong>
                <FontAwesome name="info-circle" className="mr-2" />
            </strong>
            {msg}
        </div>
    );
};
export { Info, Alert, Success, Danger, Warning };
