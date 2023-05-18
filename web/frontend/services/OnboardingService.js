import HttpRequest from "./HttpRequest";

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://ribbon-reel-backend.herokuapp.com/api' : 'http://localhost:8080/api';

const OnboardingCreateService = async (data) => {
    return await HttpRequest("POST", `${baseUrl}/onboardings`, data);
};

const OnboardingGetParticularService = async (store_name) => {
    return await HttpRequest("GET", `${baseUrl}/onboardings?store_name=${store_name}`, null);
};

const OnboardingUpdateParticularService = async (store_name, data) => {
    return await HttpRequest("PUT", `${baseUrl}/onboardings/${store_name}`, data);
};

export { OnboardingCreateService, OnboardingGetParticularService, OnboardingUpdateParticularService }