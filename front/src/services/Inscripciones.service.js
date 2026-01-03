import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const postInscripcion = async (inscripcion) => {
  try {
    const response = await axios.post(`${API_URL}/inscripcion`, inscripcion);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getInscripcionesByVendedor = async (vendedorId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/inscripcion/vendedor/${vendedorId}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
