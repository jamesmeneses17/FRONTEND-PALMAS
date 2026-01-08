import api from './axios';

export const loginRequest = async (credentials) => {
    return await api.post('/auth/login', credentials);
};

export const verifyTokenRequest = async () => {
    return await api.get('/auth/verify');
};
