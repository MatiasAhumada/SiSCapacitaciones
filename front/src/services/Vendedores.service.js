import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getVendedores = async () => {
  try {
    const response = await axios.get(`${API_URL}/vendedor`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVendID = async (id, fechaDesde, fechaHasta) => {
  try {
    const params = new URLSearchParams();
    if (fechaDesde) params.append('fechaDesde', fechaDesde);
    if (fechaHasta) params.append('fechaHasta', fechaHasta);
    
    const url = `${API_URL}/vendedor/${id}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getVendSucID = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/vendedor/sucursal/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postVend = async (vendedor) => {
  try {
    const response = await axios.post(`${API_URL}/vendedor`, vendedor);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteVend = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/vendedor/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateVend = async (id, vendedor) => {
  try {
    const response = await axios.patch(`${API_URL}/vendedor/${id}`, vendedor);
    return response.data;
  } catch (error) {
    throw error;
  }
};
