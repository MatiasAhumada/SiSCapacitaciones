import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  AcademicCapIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';
import simplificado from '../../assets/simplificado_a_color.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import { aperturaCaja, cerrarCaja, GetCajaByVendedor, descargarExcelCaja } from '../../services/Cajas.service';
import { clientErrorHandler, clientSuccessHandler } from '../../utils/notificationHandler';
import { SUCCESS_MESSAGES } from '../../constants/messages';

const UnifiedNav = () => {
  const { logout, user } = useAuth();
  const { sucursales, sucursalSeleccionada, cambiarSucursal } = useApp();
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin;
  const [sesionCaja, setSesionCaja] = useState(null);
  const [loadingCaja, setLoadingCaja] = useState(false);

  useEffect(() => {
    const cargarSesionCaja = async () => {
      if (!user?.id) return;
      try {
        const data = await GetCajaByVendedor(user.id, 1, 1);
        const ultimaSesion = data.length > 0 ? data[0] : null;
        setSesionCaja(ultimaSesion);
      } catch (error) {
        // Silencioso
      }
    };
    cargarSesionCaja();
  }, [user?.id]);

  const handleAperturaCaja = async () => {
    setLoadingCaja(true);
    try {
      await aperturaCaja(user.id);
      clientSuccessHandler(SUCCESS_MESSAGES.CAJA_ABIERTA);
      const data = await GetCajaByVendedor(user.id, 1, 1);
      setSesionCaja(data.length > 0 ? data[0] : null);
    } catch (error) {
      clientErrorHandler(error?.response?.data?.message || error?.message);
    } finally {
      setLoadingCaja(false);
    }
  };

  const handleCerrarCaja = async () => {
    setLoadingCaja(true);
    try {
      await cerrarCaja(user.id);
      clientSuccessHandler(SUCCESS_MESSAGES.CAJA_CERRADA);
      setSesionCaja(null);
    } catch (error) {
      clientErrorHandler(error?.response?.data?.message || error?.message);
    } finally {
      setLoadingCaja(false);
    }
  };

  const handleDescargarExcel = async () => {
    if (!sesionCaja?.id) return;
    try {
      const blob = await descargarExcelCaja(sesionCaja.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `caja-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      clientSuccessHandler(SUCCESS_MESSAGES.EXCEL_DESCARGADO);
    } catch (error) {
      clientErrorHandler(error?.response?.data?.message || error?.message);
    }
  };

  const navigationConfig = isAdmin
    ? {
        personas: {
          name: 'Personas',
          icon: UsersIcon,
          items: [
            { name: 'Vendedores', path: '/admin/vendedores' },
            { name: 'Crear Vendedor', path: '/admin/vendedores/crear' },
            { name: 'Profesores', path: '/admin/profesores' },
            { name: 'Crear Profesor', path: '/admin/profesores/crear' },
            { name: 'Alumnos', path: '/admin/alumnos' },
            { name: 'Crear Alumno', path: '/admin/alumnos/crear' },
          ],
        },
        academico: {
          name: 'Académico',
          icon: AcademicCapIcon,
          items: [
            { name: 'Cursos', path: '/admin/cursos' },
            { name: 'Crear Curso', path: '/admin/cursos/crear' },
            { name: 'Comisiones', path: '/admin/comisiones' },
            { name: 'Crear Comisión', path: '/admin/comisiones/crear' },
            { name: 'Certificados', path: '/admin/certificados' },
          ],
        },
        cajas: {
          name: 'Cajas',
          icon: CurrencyDollarIcon,
          items: [
            { name: 'Cajas', path: '/admin/cajas' },
            { name: 'Cobrar', path: '/admin/cobrar' },
            { name: 'Egreso', path: '/admin/egreso' },
            { name: 'Listado Cajas', path: '/admin/listado-cajas' },
          ],
        },
      }
    : {
        academico: {
          name: 'Académico',
          icon: AcademicCapIcon,
          items: [
            { name: 'Inscribir', path: '/vendedor/inscribir' },
            { name: 'Cursos', path: '/vendedor/cursos' },
            { name: 'Comisiones', path: '/vendedor/comisiones' },
          ],
        },
        cajas: {
          name: 'Cajas',
          icon: CurrencyDollarIcon,
          items: [
            { name: 'Caja', path: '/vendedor/caja' },
            { name: 'Cobrar', path: '/vendedor/cobrar' },
            { name: 'Egreso', path: '/vendedor/egreso' },
            { name: 'Transferencia', path: '/vendedor/transferencia' },
            { name: 'Listado Cajas', path: '/vendedor/listado-cajas' },
            { name: 'divider' },
            ...(sesionCaja?.fechaCierre ? [
              { name: 'Abrir Caja', action: handleAperturaCaja, loading: loadingCaja }
            ] : [
              { name: 'Cerrar Caja', action: handleCerrarCaja, loading: loadingCaja }
            ]),
            { name: 'Descargar Excel', action: handleDescargarExcel, disabled: !sesionCaja?.id },
          ],
        },
        alumnos: {
          name: 'Alumnos',
          icon: UsersIcon,
          items: [{ name: 'Crear Alumno', path: '/vendedor/alumnos/crear' }],
        },
      };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSucursalChange = (e) => {
    cambiarSucursal(e.target.value);
  };

  const DropdownMenu = ({ config, isMobile = false }) => (
    <Menu as="div" className="relative">
      <MenuButton
        className={`group flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ${isMobile ? 'w-full justify-center' : 'min-w-[120px] justify-center'}`}
      >
        <config.icon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
        {config.name}
        <ChevronDownIcon className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
      </MenuButton>
      <MenuItems
        className={`absolute ${isMobile ? 'left-0 right-0' : 'right-0'} z-20 mt-3 w-56 bg-white rounded-3xl shadow-2xl ring-1 ring-gray-200 focus:outline-none backdrop-blur-sm`}
      >
        <div className="p-3">
          {config.items.map((item, index) => {
            if (item.name === 'divider') {
              return <div key={`divider-${index}`} className="border-t border-gray-200 my-2"></div>;
            }
            return (
              <MenuItem key={item.name}>
                {({ active }) => (
                  <button
                    onClick={() => item.action ? item.action() : handleNavigation(item.path)}
                    disabled={item.disabled || item.loading}
                    className={`${active ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-md' : 'text-gray-700 hover:bg-gray-50'} flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-full transition-all duration-150 ${index === 0 ? 'mt-0' : 'mt-1'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {item.loading ? (
                      <svg className="animate-spin h-4 w-4 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <div
                        className={`w-2 h-2 rounded-full mr-3 ${active ? 'bg-blue-500' : 'bg-gray-300'} transition-colors duration-150`}
                      ></div>
                    )}
                    {item.name}
                  </button>
                )}
              </MenuItem>
            );
          })}
        </div>
      </MenuItems>
    </Menu>
  );

  DropdownMenu.propTypes = {
    config: PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          path: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
    isMobile: PropTypes.bool,
  };

  return (
    <Disclosure
      as="nav"
      className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-2xl border-b border-blue-500/20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo and Branch Selector */}
          <div className="flex items-center gap-6">
            <div
              className="relative group cursor-pointer"
              onClick={() => navigate(isAdmin ? '/admin' : '/vendedor')}
            >
              <img
                alt="SiS Capacitaciones"
                src={simplificado}
                className="h-12 w-12 hover:scale-110 transition-all duration-300 drop-shadow-lg group-hover:drop-shadow-2xl"
              />
              <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
            {isAdmin && sucursales.length > 0 && (
              <div className="relative group">
                <select
                  name="sucId"
                  value={sucursalSeleccionada?.id || ''}
                  onChange={handleSucursalChange}
                  className="appearance-none bg-gradient-to-r from-white/95 to-white/90 backdrop-blur-sm text-gray-800 px-4 py-2.5 pr-10 rounded-full text-sm font-semibold shadow-xl border-2 border-white/30 focus:ring-4 focus:ring-white/50 focus:border-white hover:bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer w-48"
                >
                  <option value="" className="text-gray-600">
                    🏢 Seleccionar sucursal
                  </option>
                  {sucursales.map((suc) => (
                    <option key={suc.id} value={suc.id} className="text-gray-800 font-medium">
                      📍 {suc.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none group-hover:text-blue-600 transition-colors duration-200" />
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-center space-x-4">
            {Object.values(navigationConfig).map((config) => (
              <DropdownMenu key={config.name} config={config} />
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/20">
              {user?.img ? (
                <img
                  src={user.img}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-white text-sm font-semibold">{user?.name || 'Usuario'}</span>
            </div>
            <button
              onClick={logout}
              className="group flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              Cerrar Sesión
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <DisclosureButton className="group inline-flex items-center justify-center w-12 h-12 rounded text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <Bars3Icon className="block h-6 w-6 group-data-[open]:hidden group-hover:scale-110 transition-transform duration-200" />
              <XMarkIcon className="hidden h-6 w-6 group-data-[open]:block group-hover:rotate-90 transition-transform duration-200" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <DisclosurePanel className="lg:hidden bg-gradient-to-b from-blue-700 to-blue-800 border-t border-blue-500/30">
        <div className="px-4 pt-4 pb-6 space-y-4">
          {Object.values(navigationConfig).map((config) => (
            <DropdownMenu key={config.name} config={config} isMobile />
          ))}
          <div className="border-t border-blue-500/30 pt-4 mt-4">
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20 mb-4">
              {user?.img ? (
                <img
                  src={user.img}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-white text-sm font-semibold">{user?.name || 'Usuario'}</span>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default UnifiedNav;
