import React from "react";
import { Link, useNavigate } from "react-router-dom";

const InfoIndexVend = () => {
  const links = [{ name: "Inscribir" }, { name: "Abono" }, { name: "Caja" }, { name: "Comisiones" }];
  const stats = [
    { name: "Inscripciones realizadas", value: "12" },
    { name: "Alumnos registrados", value: "300+" },
    { name: "Hours per week", value: "40" },
    { name: "Paid time off", value: "Unlimited" },
  ];
  const navigate = useNavigate();
  const click = (name) => {
    navigate(`/inicioVendedor/${name.toLowerCase()}`);
  };
  return (
    <div className="relative isolate overflow-hidden  py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div>
          <h2 className="principal text-5xl mb-3  sm:text-7xl">{"Nombre vendedor"}</h2>
          <p className="mt-8 sm:text-xl/8">Nombre: {"Tadeo"}</p>
          <p className="mt-8 sm:text-xl/8">Sucursal: {"Centro"}</p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 mb-5 gap-x-8 gap-y-6 text-base/7 font-semibold sm:grid-cols-4 md:flex lg:gap-x-40 ">
            {links.map((link) => (
              <button key={link.name} onClick={()=>click(link.name)} className="btnAz">
                {link.name} <span aria-hidden="true">&rarr;</span>
              </button>
            ))}
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="flex flex-col-reverse gap-1">
                <dt className="text-base/7 ">{stat.name}</dt>
                <dd className="text-4xl font-semibold tracking-tight ">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default InfoIndexVend;
