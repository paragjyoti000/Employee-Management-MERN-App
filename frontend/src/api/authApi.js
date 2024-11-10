import axios from "axios";
import config from "../config";

class AuthApi {
    apiCall;

    constructor() {
        this.apiCall = axios.create({
            baseURL: config.baseURL + "/api/v1/user",
            withCredentials: true,
        });
    }

    async login(username, password) {
        return await this.apiCall
            .post("/login", { username, password })
            .then((res) => res.data.data);
    }

    async logout() {
        return await this.apiCall.get("/logout").then((res) => res.data.data);
    }

    async getCurrentUser() {
        return await this.apiCall
            .get("/get-current-user")
            .then((res) => res.data.data);
    }
}

const authApi = new AuthApi();

export default authApi;
