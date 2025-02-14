import React from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import simplificado from "../assets/simplificado_a_color.png";
const DashAdmin = () => {
  const navigation = [{ name: "Vendedores" }, { name: "Profesores" }, { name: "Alumnos" }, { name: "Comisiones" }, { name: "Metricas" }];

  return (
    <div className="min-h-full principal">
      <Disclosure as="nav" className="bg-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <img alt="Your Company" src={simplificado}className="size-8" />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      aria-current="page"
                      className="btnAz
                          rounded px-4 py-2 me-2  text-sm font-medium"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  className="text-gray-50 bg-red-600 hover:bg-red-700 
                          rounded px-4 py-2 me-2  text-sm font-medium"
                >
                  Cerrar Sesion
                </button>
              </div>
            </div>
            <div className="mr-2 flex md:hidden rounded">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="md:hidden">
          <div className="flex flex-col items-center  space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navigation.map((item) => (
              <button
                key={item.name}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className="text-gray-300 bg-gray-700 rounded
                 px-3 py-2 mt-2 font-medium"
              >
                {item.name}
              </button>
            ))}
            <button
              className="text-gray-300 bg-red-500
                          rounded px-4 py-2 mt-4  text-sm font-medium"
            >
              Cerrar Sesion
            </button>
          </div>
        </DisclosurePanel>
      </Disclosure>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"></div>
      </main>
    </div>
  );
};

export default DashAdmin;
