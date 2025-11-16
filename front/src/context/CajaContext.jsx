import { createContext, useContext, useState } from 'react';

const CajaContext = createContext();

export const useCaja = () => {
  const context = useContext(CajaContext);
  if (!context) {
    throw new Error('useCaja debe ser usado dentro de un CajaProvider');
  }
  return context;
};

export const CajaProvider = ({ children }) => {
  const [descargarExcelFn, setDescargarExcelFn] = useState(null);
  const [abrirCajaFn, setAbrirCajaFn] = useState(null);
  const [cerrarCajaFn, setCerrarCajaFn] = useState(null);

  const registrarDescargarExcel = (fn) => {
    setDescargarExcelFn(() => fn);
  };

  const registrarAbrirCaja = (fn) => {
    setAbrirCajaFn(() => fn);
  };

  const registrarCerrarCaja = (fn) => {
    setCerrarCajaFn(() => fn);
  };

  return (
    <CajaContext.Provider value={{ 
      descargarExcelFn, 
      registrarDescargarExcel,
      abrirCajaFn,
      registrarAbrirCaja,
      cerrarCajaFn,
      registrarCerrarCaja
    }}>
      {children}
    </CajaContext.Provider>
  );
};
