import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchSalesByMonth = async (year, vendedorIds) => {
  try {
    const params = {};
    if (year) params.year = year;
    if (vendedorIds && vendedorIds.length > 0) params.vendedorIds = vendedorIds.join(',');
    const response = await api.get('/metrics/sales-by-month', { params });
    return response.data;
  } catch (error) {
    console.error('Fallo en la llamada a la API de ventas:', error);
    return [];
  }
};

export const fetchAvailableYears = async () => {
  try {
    const response = await api.get('/metrics/available-years');
    return response.data;
  } catch (error) {
    console.error('Fallo en la llamada a la API de años disponibles:', error);
    return [];
  }
};

export const fetchEnrollmentsByMonth = async (vendedorIds, months, year, cursoId) => {
  try {
    const params = {};
    if (vendedorIds && vendedorIds.length > 0) params.vendedorIds = vendedorIds.join(',');
    if (months && months.length > 0) params.months = months.join(',');
    if (year) params.year = year;
    if (cursoId) params.cursoId = cursoId;
    const response = await api.get('/metrics/enrollments-by-month', { params });
    return response.data;
  } catch (error) {
    console.error('Fallo en la llamada a la API de inscripciones:', error);
    return [];
  }
};

export const fetchPaymentMethods = async (month, vendedorIds) => {
  try {
    const params = {};
    if (month) params.month = month;
    if (vendedorIds && vendedorIds.length > 0) params.vendedorIds = vendedorIds.join(',');
    const response = await api.get('/metrics/payment-methods', { params });
    return response.data;
  } catch (error) {
    console.error('Fallo en la llamada a la API de métodos de pago:', error);
    return [];
  }
};

export const fetchSalesBySeller = async (vendedorIds, month) => {
  try {
    const params = {};
    if (vendedorIds && vendedorIds.length > 0) params.vendedorIds = vendedorIds.join(',');
    if (month) params.month = month;
    const response = await api.get('/metrics/sales-by-seller', { params });
    return response.data;
  } catch (error) {
    console.error('Fallo en la llamada a la API de ventas por vendedor:', error);
    return [];
  }
};

export const fetchAvailableSellers = async () => {
  try {
    const response = await api.get('/metrics/available-sellers');
    return response.data;
  } catch (error) {
    console.error('Fallo en la llamada a la API de vendedores disponibles:', error);
    return [];
  }
};

export const fetchAvailableCourses = async () => {
  try {
    const response = await api.get('/metrics/available-courses');
    return response.data;
  } catch (error) {
    console.error('Fallo en la llamada a la API de cursos disponibles:', error);
    return [];
  }
};
