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

export const getAllInscripciones = async (page = 1, limit = 10, vendedorId = '', fecha = '') => {
  try {
    const params = { page, limit };
    if (vendedorId) params.vendedorId = vendedorId;
    if (fecha) params.fecha = fecha;

    const response = await axios.get(`${API_URL}/inscripcion`, { params });
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

export const descargarPDFInscripcion = async (inscripcionId) => {
  try {
    const response = await axios.get(`${API_URL}/inscripcion/${inscripcionId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getInscripcionById = async (inscripcionId) => {
  try {
    const response = await axios.get(`${API_URL}/inscripcion/${inscripcionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const firmarContrato = async (inscripcionId, firmaBase64) => {
  try {
    const response = await axios.post(`${API_URL}/inscripcion/${inscripcionId}/firmar`, {
      firmaBase64,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteInscripcion = async (inscripcionId) => {
  try {
    const response = await axios.delete(`${API_URL}/inscripcion/${inscripcionId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
