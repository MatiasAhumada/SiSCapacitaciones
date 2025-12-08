import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const getAppLockStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/app-lock/status`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const toggleAppLock = async (locked, message) => {
  try {
    const response = await axios.post(`${API_URL}/app-lock/toggle`, { locked, message });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
