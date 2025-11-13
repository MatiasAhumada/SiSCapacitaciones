import { createContext, useContext, useState, useEffect } from 'react';
import { getSucursales } from '../services/Sucursales.service';
import { useAuth } from './AuthContext';

const AppContext = createContext();

import PropTypes from 'prop-types';

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [sucursales, setSucursales] = useState([]);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar sucursales cuando el usuario es admin
  useEffect(() => {
    if (!user?.isAdmin) return;

    const cargarSucursales = async () => {
      setLoading(true);
      try {
        const data = await getSucursales();
        setSucursales(data);
        if (data.length > 0) {
          setSucursalSeleccionada(data[0]);
        }
      } catch (error) {
        console.error('Error al cargar sucursales:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarSucursales();
  }, [user?.isAdmin]);

  const cambiarSucursal = (sucursalId) => {
    const sucursal = sucursales.find((s) => s.id === sucursalId);
    if (sucursal) {
      setSucursalSeleccionada(sucursal);
    }
  };

  // Para vendedores, usar su sucursal directamente
  const getSucursalActiva = () => {
    if (user?.isAdmin) {
      return sucursalSeleccionada;
    }
    // Para vendedores, necesitarías cargar su sucursal o tenerla en user
    return { id: user?.sucursalId };
  };

  const value = {
    // Sucursales
    sucursales,
    sucursalSeleccionada,
    cambiarSucursal,
    getSucursalActiva,
    loading,

    // Aquí puedes agregar más datos globales como:
    // cursos, profesores, etc.
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};
