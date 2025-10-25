import { API_URL } from '../constants/ApiUrl';

export const descargarComprobantePDF = async (movimientoId) => {
  try {
    const response = await fetch(`${API_URL}/caja/${movimientoId}/comprobante-pdf`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Crear elemento temporal para descarga
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprobante-${movimientoId.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();

    // Limpiar
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error al descargar comprobante:', error);
    throw error;
  }
};
