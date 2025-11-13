import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getSucursales = async () => {
  const response = await axios.get(`${API_URL}/suc`);
  return response.data;
};

export const getSucursalId = async (id) => {
  const response = await axios.get(`${API_URL}/suc/${id}`);
  return response.data;
};

export const postSucursal = async (sucursal) => {
  const response = await axios.post(`${API_URL}/suc`, sucursal);
  return response.data;
};
