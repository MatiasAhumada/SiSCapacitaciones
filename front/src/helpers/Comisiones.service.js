import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getComisiones = async () => {
  try {
    const response = await axios.get(`${API_URL}/comision`);
    return response.data;
  } catch (error) {
    throw error('Error al obtener vendedor', error.response?.data);
  }
};
export const getComisionId = async (id, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/comision/${id}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteComision = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/comision/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getComisionBySucursal = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/comision/suc/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const postComision = async (comision) => {
  try {
    const response = await axios.post(`${API_URL}/comision`, comision);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const putComision = async (id, comision) => {
  try {
    const response = await axios.put(`${API_URL}/comision/${id}`, comision);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAluCom = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/comision/aluCom/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editStateComision = async (change) => {
  try {
    const response = await axios.put(`${API_URL}/comision/estado`, change);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postAsistenciaComision = async (asistenciaComision) => {
  try {
    const response = await axios.post(`${API_URL}/comision/asistencia`, asistenciaComision);
    return response.data;
  } catch (error) {
    throw error;
  }
};
