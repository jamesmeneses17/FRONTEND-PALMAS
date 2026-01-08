import api from './api'; // Tu instancia de Axios configurada

export const createSale = async (saleData) => {
    try {
        // Hacemos el POST al endpoint que creamos en NestJS
        const response = await api.post('/sales', saleData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};