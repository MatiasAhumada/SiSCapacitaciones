import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getSucursales = async () => {
  const response = await axios.get(`${API_URL}/sucursal`);
  return response.data;
};

export const getSucursalId = async (id) => {
  const response = await axios.get(`${API_URL}/sucursal/${id}`);
  return response.data;
};

export const postSucursal = async (sucursal) => {
  const response = await axios.post(`${API_URL}/sucursal`, sucursal);
  return response.data;
};
