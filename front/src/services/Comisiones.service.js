import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getComisiones = async (page = 1, limit = 10, name = '', day = '', all = false) => {
  try {
    const params = { page, limit };
    if (name && name !== '') {
      params.name = name;
    }
    if (day && day !== '') {
      params.day = day;
    }
    if (all) {
      params.all = 'true';
    }
    const response = await axios.get(`${API_URL}/comision`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getComisionId = async (id, page = 1, limit = 10, dni = '') => {
  try {
    const params = { page, limit };
    if (dni) {
      params.dni = dni;
    }
    const response = await axios.get(`${API_URL}/comision/${id}`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteComision = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/comision/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAluComID = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/comision/aluCom/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getComisionBySucursal = async (id, page = 1, limit = 10, name = '', day = '', all = false) => {
  try {
    const params = { page, limit };
    if (name && name !== '') {
      params.name = name;
    }
    if (day && day !== '') {
      params.day = day;
    }
    if (all) {
      params.all = 'true';
    }
    const response = await axios.get(`${API_URL}/comision/suc/${id}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postComision = async (comision) => {
  try {
    const response = await axios.post(`${API_URL}/comision`, comision);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const putComision = async (id, comision) => {
  try {
    const response = await axios.put(`${API_URL}/comision/${id}`, comision);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAluCom = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/comision/aluCom/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const editStateComision = async (change) => {
  try {
    const response = await axios.put(`${API_URL}/comision/estado`, change);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postAsistenciaComision = async (asistenciaComision) => {
  try {
    const response = await axios.post(`${API_URL}/comision/asistencia`, asistenciaComision);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const transferirAlumno = async (alumnoComisionId, nuevaComisionId) => {
  try {
    const response = await axios.put(`${API_URL}/comision/transferir`, {
      alumnoComisionId,
      nuevaComisionId,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
