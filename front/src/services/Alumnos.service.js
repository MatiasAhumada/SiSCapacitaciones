import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getAluSucID = async (id, page = 1, limit = 10, filtros = {}) => {
  const params = { page, limit };
  Object.keys(filtros).forEach((key) => {
    if (filtros[key] && filtros[key] !== '') {
      params[key] = filtros[key];
    }
  });
  const response = await axios.get(`${API_URL}/alumno/sucursal/${id}`, {
    params,
  });
  return response.data;
};

export const getAluID = async (dni) => {
  const response = await axios.get(`${API_URL}/alumno/search/${dni}`);
  return response.data;
};

export const getAluByDNI = async (dni) => {
  const response = await axios.get(`${API_URL}/alumno/buscar?dni=${dni}`);
  return response.data;
};

export const getAlu = async () => {
  const response = await axios.get(`${API_URL}/alumno`);
  return response.data;
};

export const postAlu = async (alumno) => {
  const response = await axios.post(`${API_URL}/alumno`, alumno);
  return response.data;
};

export const postAluSimple = async (alumno) => {
  const response = await axios.post(`${API_URL}/alumno/simple`, alumno);
  return response.data;
};

export const deleteAlumnoId = async (id) => {
  const response = await axios.delete(`${API_URL}/alumno/remove/${id}`);
  return response.data;
};

export const editAlumnoId = async (id, dataAlu) => {
  const response = await axios.put(`${API_URL}/alumno/edit/${id}`, dataAlu);
  return response.data;
};
