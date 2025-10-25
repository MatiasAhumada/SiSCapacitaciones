import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getCursos = async (page = 1, limit = 10, area = '') => {
  try {
    const params = { page, limit };
    if (area && area !== '') {
      params.area = area;
    }
    const response = await axios.get(`${API_URL}/curso`, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};



export const deleteCurso = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/curso/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postCurso = async (curso) => {
  try {
    const response = await axios.post(`${API_URL}/curso`, curso);
    return response.data;
  } catch (error) {
    throw error;
  }
};
