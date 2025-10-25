import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchSalesByMonth = async () => {
  try {
    const response = await api.get('/metrics/sales-by-month');
    return response.data;
  } catch (error) {
    console.error('Fallo en la llamada a la API de ventas:', error);
    return [];
  }
};

export const fetchEnrollmentsByMonth = async () => {
  try {
    const response = await api.get('/metrics/enrollments-by-month');
    return response.data;
  } catch (error) {
    console.error('Fallo en la llamada a la API de inscripciones:', error);
    return [];
  }
};

export const fetchPaymentMethods = async () => {
  try {
    const response = await api.get('/metrics/payment-methods');
    return response.data;
  } catch (error) {
    console.error('Fallo en la llamada a la API de métodos de pago:', error);
    return [];
  }
};

export const fetchSalesBySeller = async () => {
  try {
    const response = await api.get('/metrics/sales-by-seller');
    return response.data;
  } catch (error) {
    console.error('Fallo en la llamada a la API de ventas por vendedor:', error);
    return [];
  }
};
