import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const postCert = async (cert) => {
  const response = await axios.post(`${API_URL}/certificado`, cert);
  return response.data;
};

export const getCertId = async (numero) => {
  const response = await axios.get(`${API_URL}/certificado/${numero}`);
  return response.data;
};
