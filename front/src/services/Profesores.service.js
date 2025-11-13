import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getProfes = async () => {
  const response = await axios.get(`${API_URL}/profesor`);
  return response.data;
};

export const getProfesId = async (id) => {
  const response = await axios.get(`${API_URL}/profesor/${id}`);
  return response.data;
};

export const getProfesSucId = async (id, page = 1, limit = 10) => {
  const response = await axios.get(
    `${API_URL}/profesor/sucursal/${id}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const postProfes = async (profesor) => {
  const response = await axios.post(`${API_URL}/profesor`, profesor);
  return response.data;
};

export const deleteProfesId = async (id) => {
  const response = await axios.delete(`${API_URL}/profesor/deleted/${id}`);
  return response.data;
};
