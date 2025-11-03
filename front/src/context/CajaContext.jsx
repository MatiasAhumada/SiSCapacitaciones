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

  const registrarDescargarExcel = (fn) => {
    setDescargarExcelFn(() => fn);
  };

  return (
    <CajaContext.Provider value={{ descargarExcelFn, registrarDescargarExcel }}>
      {children}
    </CajaContext.Provider>
  );
};
