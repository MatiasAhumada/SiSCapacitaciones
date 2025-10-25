import { API_URL } from "../constants/ApiUrl";
import axios from 'axios';

export const getProfes = async () => {
  try {
    const response = await axios.get(`${API_URL}/profesor`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfesId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/profesor/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfesSucId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/profesor/sucursal/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postProfes = async (profesor) => {
  try {
    const response = await axios.post(`${API_URL}/profesor`, profesor);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProfesId = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/profesor/deleted/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
