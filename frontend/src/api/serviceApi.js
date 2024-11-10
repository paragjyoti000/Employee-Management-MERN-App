import axios from "axios";
import config from "../config";

class ServiceApi {
    apiCall;

    constructor() {
        this.apiCall = axios.create({
            baseURL: config.baseURL + "/api/v1/employee",
            withCredentials: true,
        });
    }

    async getAllEmployeesEnums() {
        return await this.apiCall
            .get("/get-employee-enums")
            .then((res) => res.data.data);
    }

    async getAllEmployees(page = 1, limit = 10) {
        return await this.apiCall
            .get(`/get-all-employees?page=${page}&limit=${limit}`)
            .then((res) => res.data.data);
    }

    async createEmployee(formData) {
        return await this.apiCall
            .post("/create-employee", formData)
            .then((res) => res.data.data);
    }

    async updateEmployee(id, formData) {
        return await this.apiCall
            .patch(`/edit-employee/${id}`, formData)
            .then((res) => res.data.data);
    }

    async deleteEmployee(id) {
        return await this.apiCall
            .delete(`/delete-employee/${id}`)
            .then((res) => res.data.data);
    }

    async getEmployeeById(id) {
        return await this.apiCall
            .get(`/get-employee/${id}`)
            .then((res) => res.data.data);
    }

    async searchEmployees(query, page = 1, limit = 10) {
        return await this.apiCall
            .get(`/search-employee?query=${query}&page=${page}&limit=${limit}`)
            .then((res) => res.data.data);
    }
}

const serviceApi = new ServiceApi();

export default serviceApi;
