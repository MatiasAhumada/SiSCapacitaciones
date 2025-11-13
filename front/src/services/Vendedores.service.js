import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getVendedores = async () => {
  const response = await axios.get(`${API_URL}/vendedor`);
  return response.data;
};

export const getVendID = async (id, fechaDesde, fechaHasta) => {
  const params = new URLSearchParams();
  if (fechaDesde) params.append('fechaDesde', fechaDesde);
  if (fechaHasta) params.append('fechaHasta', fechaHasta);

  const url = `${API_URL}/vendedor/${id}${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await axios.get(url);
  return response.data;
};

export const getVendSucID = async (id, page = 1, limit = 10) => {
  const response = await axios.get(
    `${API_URL}/vendedor/sucursal/${id}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const postVend = async (vendedor) => {
  const response = await axios.post(`${API_URL}/vendedor`, vendedor);
  return response.data;
};

export const deleteVend = async (id) => {
  const response = await axios.delete(`${API_URL}/vendedor/${id}`);
  return response.data;
};

export const updateVend = async (id, vendedor) => {
  const response = await axios.patch(`${API_URL}/vendedor/${id}`, vendedor);
  return response.data;
};
