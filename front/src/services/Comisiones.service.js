import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getComisiones = async (page = 1, limit = 10, name = '', day = '') => {
  const params = { page, limit };
  if (name && name !== '') {
    params.name = name;
  }
  if (day && day !== '') {
    params.day = day;
  }
  const response = await axios.get(`${API_URL}/comision`, { params });
  return response.data;
};

export const getComisionId = async (id, page = 1, limit = 10, dni = '') => {
  const params = { page, limit };
  if (dni) {
    params.dni = dni;
  }
  const response = await axios.get(`${API_URL}/comision/${id}`, {
    params,
  });
  return response.data;
};

export const deleteComision = async (id) => {
  const response = await axios.delete(`${API_URL}/comision/${id}`);
  return response.data;
};

export const getAluComID = async (id) => {
  const response = await axios.get(`${API_URL}/comision/aluCom/${id}`);
  return response.data;
};

export const getComisionBySucursal = async (id, page = 1, limit = 10, name = '', day = '') => {
  const params = { page, limit };
  if (name && name !== '') {
    params.name = name;
  }
  if (day && day !== '') {
    params.day = day;
  }
  const response = await axios.get(`${API_URL}/comision/suc/${id}`, { params });
  return response.data;
};

export const postComision = async (comision) => {
  const response = await axios.post(`${API_URL}/comision`, comision);
  return response.data;
};

export const putComision = async (id, comision) => {
  const response = await axios.put(`${API_URL}/comision/${id}`, comision);
  return response.data;
};

export const getAluCom = async (id) => {
  const response = await axios.get(`${API_URL}/comision/aluCom/${id}`);
  return response.data;
};

export const editStateComision = async (change) => {
  const response = await axios.put(`${API_URL}/comision/estado`, change);
  return response.data;
};

export const postAsistenciaComision = async (asistenciaComision) => {
  const response = await axios.post(`${API_URL}/comision/asistencia`, asistenciaComision);
  return response.data;
};

export const transferirAlumno = async (alumnoComisionId, nuevaComisionId) => {
  const response = await axios.put(`${API_URL}/comision/transferir`, {
    alumnoComisionId,
    nuevaComisionId,
  });
  return response.data;
};
