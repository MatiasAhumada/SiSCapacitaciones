import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getCursos = async (page = 1, limit = 10, area = '') => {
  const params = { page, limit };
  if (area && area !== '') {
    params.area = area;
  }
  const response = await axios.get(`${API_URL}/curso`, { params });
  return response.data;
};

export const getAllCursos = async () => {
  const response = await axios.get(`${API_URL}/curso`, { params: { all: 'true' } });
  return response.data;
};

export const deleteCurso = async (id) => {
  const response = await axios.delete(`${API_URL}/curso/${id}`);
  return response.data;
};

export const postCurso = async (curso) => {
  const response = await axios.post(`${API_URL}/curso`, curso);
  return response.data;
};
