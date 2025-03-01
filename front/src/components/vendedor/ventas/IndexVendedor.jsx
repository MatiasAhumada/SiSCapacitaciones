import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import simplificado from "../../assets/simplificado_a_color.png";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const IndexVendedor = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-blue-50 principal">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">
                <img alt="Your Company" src={simplificado} className="size-8" onClick={() => navigate(`/inicioVendedor`)} />
              </div>
            </div>
            <div>
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
          </div>
        </div>
      </Disclosure>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default IndexVendedor;
