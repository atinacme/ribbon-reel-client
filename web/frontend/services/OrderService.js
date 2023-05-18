import HttpRequest from "./HttpRequest";

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://ribbon-reel-backend.herokuapp.com/api' : 'http://localhost:8080/api';

const OrderCreateService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/orders/create`, data);
};

const OrderGetService = async (data) => {
    return await HttpRequest("GET", `${baseUrl}/orders/findAll`, null);
};

export { OrderCreateService, OrderGetService };