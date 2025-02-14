import React from 'react';
import { useParams } from 'react-router-dom';

const DashVendedor = () => {
    const {id}=useParams()
    const profesores = [
        { nombre: "Juan", apellido: "Pérez", comisiones: 3, curso: "Matemáticas" },
        { nombre: "Ana", apellido: "Gómez", comisiones: 5, curso: "Historia" },
        { nombre: "Luis", apellido: "Martínez", comisiones: 2, curso: "Física" },
      ];
    
      return (
        <div className="px-4 py-6">
   
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-semibold">Vendedores</h2>
           
            <button className="btnAz text-white px-4 py-2 rounded">
              Agregar Vendedor
            </button>
          </div>
    

          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Apellido</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Sucursal</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Cursos Vendidos</th>
                </tr>
              </thead>
              <tbody>
                {profesores.map((profesor, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{profesor.nombre}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{profesor.apellido}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{profesor.comisiones}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{profesor.curso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
};

export default DashVendedor;