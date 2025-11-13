import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const GetCajaByVendedor = async (vendedorId, page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}/caja/sesionDiariaVendedor/${vendedorId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const GetMovsByVendedor = async (vendedorId, page, limit) => {
  const response = await axios.get(`${API_URL}/caja/vendedor/${vendedorId}`, {
    params: { limit, page },
  });
  return response.data;
};

export const GetByVendedorMock = async (
  vendedorId,
  currentPage = 1,
  limit = 10,
  filterDate = ''
) => {
  const params = { limit, page: currentPage, useCustom: true };
  if (filterDate) {
    params.filterDate = filterDate;
  }
  const response = await axios.get(`${API_URL}/caja/vendedor/${vendedorId}`, {
    params,
  });
  return response.data;
};

export const deleteMovCaja = async (id) => {
  const response = await axios.delete(`${API_URL}/caja/${id}`);
  return response.data;
};

export const editMovCaja = async (id, mov) => {
  const response = await axios.put(`${API_URL}/caja/${id}`, mov);
  return response.data;
};

export const postCaja = async (movimiento) => {
  const response = await axios.post(`${API_URL}/caja`, movimiento);
  return response.data;
};

export const getCajas = async (page = 1, limit = 10, vendedorId = null) => {
  const params = { page, limit };
  if (vendedorId) {
    params.vendedorId = vendedorId;
  }
  const response = await axios.get(`${API_URL}/caja`, { params });
  return response.data;
};

export const getMovimientosPorDia = async (fecha) => {
  const response = await axios.get(`${API_URL}/caja/movimientos/${fecha}`);
  return response.data;
};

export const getResumenPorDia = async (fecha) => {
  const response = await axios.get(`${API_URL}/caja/resumen/${fecha}`);
  return response.data;
};

export const getResumenTotal = async () => {
  const response = await axios.get(`${API_URL}/caja/resumen-total`);
  return response.data;
};

export const getCategorias = async () => {
  const response = await axios.get(`${API_URL}/caja/con-subcategorias`);
  return response.data;
};

export const postEgresoProfesor = async (dataProfe) => {
  const response = await axios.post(`${API_URL}/caja/egreso/profesor`, dataProfe);
  return response.data;
};

export const postEgresoVendedor = async (dataVendedor) => {
  const response = await axios.post(`${API_URL}/caja/egreso/vendedor`, dataVendedor);
  return response.data;
};

export const postEgresoSiemple = async (data) => {
  const response = await axios.post(`${API_URL}/caja/egreso`, data);
  return response.data;
};

export const postTransferencia = async (data) => {
  const response = await axios.post(`${API_URL}/caja/transferencia`, data);
  return response.data;
};

export const aperturaCaja = async (idVend) => {
  const response = await axios.post(`${API_URL}/caja/aperturaCaja/${idVend}`);
  return response.data;
};

export const cerrarCaja = async (idVend) => {
  const response = await axios.patch(`${API_URL}/caja/cerrarCaja/${idVend}`);
  return response.data;
};

export const descargarExcelCaja = async (vendedorId) => {
  const response = await axios.get(`${API_URL}/caja/export-excel/${vendedorId}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const descargarExcelAdmin = async (adminId) => {
  const response = await axios.get(`${API_URL}/caja/export-excel-perpetua/${adminId}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const getMockVendedores = async () => {
  const response = await axios.get(`${API_URL}/caja/totales-vendedores`, {});
  return response.data;
};
