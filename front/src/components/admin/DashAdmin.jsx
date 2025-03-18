import React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import simplificado from "../assets/simplificado_a_color.png";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

const DashAdmin = () => {
  const { id } = useParams();

  const navigation = [{ name: "Vendedores" }, { name: "Profesores" }, { name: "Alumnos" }, { name: "Cursos" }, { name: "Comisiones" }, { name: "Caja" }, { name: "Certificados" }];

  const navigate = useNavigate();

  const clickBtn = (name) => {
    navigate(`/adm/${id}/${name.toLowerCase()}`);
  };
  const handleClick = (e) => {
    e.preventDefault();
    navigate("/");
  };
  
  return (
    <div className="min-h-full ">
      <Disclosure as="nav" className="bg-blue-50 principal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <img alt="Your Company" src={simplificado} className="size-8" onClick={() => navigate(`/adm/${id}`)} />
              </div>
              <div className="hidden lg:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      aria-current="page"
                      onClick={() => clickBtn(item.name)}
                      className="btnAz
                          rounded px-4 py-2 me-2  text-sm font-medium"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="submit"
                  onClick={handleClick}
                  className="text-gray-50 bg-red-600 hover:bg-red-700 
                          rounded px-4 py-2 me-2  text-sm font-medium"
                >
                  Cerrar Sesion
                </button>
              </div>
            </div>
            <div className="mr-2 flex lg:hidden rounded">
              {/* Boton para mobile */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded p-2  btnAz ">
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="lg:hidden">
          <div className="flex flex-col items-center  space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => clickBtn(item.name)}
                aria-current={"page"}
                className="btnAz rounded
                 px-3 py-2 mt-2 font-medium"
              >
                {item.name}
              </button>
            ))}
            <button
              type="submit"
              onClick={handleClick}
              className="text-gray-50 bg-red-600 hover:bg-red-700 
                          rounded px-4 py-2 mt-4  text-sm font-medium"
            >
              Cerrar Sesion
            </button>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashAdmin;
