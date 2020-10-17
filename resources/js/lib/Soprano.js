import axios from "axios";

export const Soprano = {
    getUser: async function () {
        const response = await axios.get("/api/user", {
            withCredentials: true,
        });
        return response.data;
    },
};
