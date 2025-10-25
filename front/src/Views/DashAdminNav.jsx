import { useState, useEffect } from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import simplificado from '../assets/simplificado_a_color.png';
import { useNavigate, useParams } from 'react-router-dom';
import { getSucursales } from '../services/Sucursales.service';
import { useAuth } from '../context/AuthContext';
import { navigationAdmin } from '../constants/navigations';

const DashAdminNav = () => {
  const { logout, user } = useAuth();
  const [sucs, setSucs] = useState([]);
  const [sucursalActual, setSucursalActual] = useState(null);

  const navigate = useNavigate();

  const clickBtn = (name) => {
    const routeMap = {
      'vendedores': '/admin/vendedores',
      'profesores': '/admin/profesores',
      'alumnos': '/admin/alumnos',
      'cursos': '/admin/cursos',
      'comisiones': '/admin/comisiones',
      'cajas': '/admin/cajas',
      'nuevo': '/admin/listado-cajas',
      'certificados': '/admin/certificados'
    };
    navigate(routeMap[name.toLowerCase()] || `/admin/${name.toLowerCase()}`);
  };

  useEffect(() => {
    const selectSuc = async () => {
      const data = await getSucursales();
      const nombresYIds = data.map(({ id, name }) => ({ id, name }));
      setSucs(nombresYIds);
      const encontrada = nombresYIds.find((suc) => suc.id === user?.sucursalId);
      setSucursalActual(encontrada || null);
    };
    if (user?.sucursalId) {
      selectSuc();
    }
  }, [user?.sucursalId]);

  const handleChange = (e) => {
    // Funcionalidad de cambio de sucursal se manejará a través del contexto
    console.log('Cambio de sucursal:', e.target.value);
  };

  return (
    <Disclosure as="nav" className="bg-blue-50 principal">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              alt="Your Company"
              src={simplificado}
              className="size-8 cursor-pointer"
              onClick={() => navigate('/admin')}
            />
            <select
              name="sucId"
              value={navigationAdmin.id}
              onChange={handleChange}
              className="border p-1 rounded"
            >
              <option value={sucursalActual?.id}>
                {sucursalActual?.name || 'Seleccionar sucursal'}
              </option>
              {sucs
                .filter((suc) => suc.id !== sucursalActual?.id)
                .map((suc) => (
                  <option key={suc.id} value={suc.id}>
                    {suc.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationAdmin.map((item) => (
                <button
                  key={item.name}
                  onClick={() => clickBtn(item.name)}
                  className="btnAz rounded px-4 py-2 text-sm font-medium"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <button
              onClick={logout}
              className="text-gray-50 bg-red-600 hover:bg-red-700 rounded px-4 py-2 text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>

          <div className="mr-2 flex lg:hidden rounded">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded p-2 btnAz">
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="lg:hidden">
        <div className="flex flex-col items-center px-2 pt-2 pb-3">
          {navigationAdmin.map((item) => (
            <button
              key={item.name}
              onClick={() => clickBtn(item.name)}
              className="btnAz rounded px-3 py-2 mt-2 font-medium"
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={logout}
            className="text-gray-50 bg-red-600 hover:bg-red-700 rounded px-4 py-2 mt-4 text-sm font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
};

export default DashAdminNav;
