import { API_URL } from '../constants/ApiUrl';
import axios from 'axios';

export const GetCajaByVendedor = async (
  vendedorId,
  page = 1,
  limit = 10,
  fecha = '',
  conFiltros = false
) => {
  try {
    const params = { page, limit };
    if (fecha) params.fecha = fecha;
    if (conFiltros) params.conFiltros = 'true';
    const response = await axios.get(`${API_URL}/caja/sesionDiariaVendedor/${vendedorId}`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetMovsByVendedor = async (vendedorId, page, limit) => {
  try {
    const response = await axios.get(`${API_URL}/caja/vendedor/${vendedorId}`, {
      params: { limit, page },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const GetByVendedorMock = async (
  vendedorId,
  currentPage = 1,
  limit = 10,
  filterDate = ''
) => {
  try {
    const params = { limit, page: currentPage, useCustom: true };
    if (filterDate) {
      params.filterDate = filterDate;
    }
    const response = await axios.get(`${API_URL}/caja/vendedor/${vendedorId}`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteMovCaja = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/caja/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const editMovCaja = async (id, mov) => {
  try {
    const response = await axios.put(`${API_URL}/caja/${id}`, mov);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postCaja = async (movimiento) => {
  try {
    const response = await axios.post(`${API_URL}/caja`, movimiento);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCajas = async (page = 1, limit = 10, vendedorId = null) => {
  try {
    const params = { page, limit };
    if (vendedorId) {
      params.vendedorId = vendedorId;
    }
    const response = await axios.get(`${API_URL}/caja`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMovimientosPorDia = async (fecha) => {
  try {
    const response = await axios.get(`${API_URL}/caja/movimientos/${fecha}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getResumenPorDia = async (fecha) => {
  try {
    const response = await axios.get(`${API_URL}/caja/resumen/${fecha}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getResumenTotal = async () => {
  try {
    const response = await axios.get(`${API_URL}/caja/resumen-total`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCategorias = async () => {
  try {
    const response = await axios.get(`${API_URL}/caja/con-subcategorias`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postEgresoProfesor = async (dataProfe) => {
  try {
    const response = await axios.post(`${API_URL}/caja/egreso/profesor`, dataProfe);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postEgresoVendedor = async (dataVendedor) => {
  try {
    const response = await axios.post(`${API_URL}/caja/egreso/vendedor`, dataVendedor);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postEgresoSiemple = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/caja/egreso`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postTransferencia = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/caja/transferencia`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const aperturaCaja = async (idVend) => {
  try {
    const response = await axios.post(`${API_URL}/caja/aperturaCaja/${idVend}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const cerrarCaja = async (idVend) => {
  try {
    const response = await axios.patch(`${API_URL}/caja/cerrarCaja/${idVend}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const descargarExcelCaja = async (vendedorId) => {
  try {
    const response = await axios.get(`${API_URL}/caja/export-excel/${vendedorId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const descargarExcelAdmin = async (adminId) => {
  try {
    const response = await axios.get(`${API_URL}/caja/export-excel-perpetua/${adminId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMockVendedores = async () => {
  try {
    const response = await axios.get(`${API_URL}/caja/totales-vendedores`, {});
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postIngresoSimple = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/caja/ingreso-simple`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const descargarComprobanteEgreso = async (movimientoId) => {
  try {
    const response = await axios.get(`${API_URL}/caja/${movimientoId}/comprobante-egreso-pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
