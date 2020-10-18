import React, { useContext, useState } from "react";
import DirectoryModule from "../Module/DirectoryModule";

const Admin = () => {
    return (
        <section id="admin" className="content">
            <h1>Admin</h1>
            <DirectoryModule />
        </section>
    );
};

export default Admin;
