import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getSucursales = async () => {
  try {
    const response = await axios.get(`${API_URL}/suc`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSucursalId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/suc/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postSucursal = async (sucursal) => {
  try {
    const response = await axios.post(`${API_URL}/suc`, sucursal);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
