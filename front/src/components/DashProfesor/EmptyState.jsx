import React from 'react';

const EmptyState = ({ hasSearchTerm }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
      <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
        <i className="fa-solid fa-user-slash text-6xl text-gray-400"></i>
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {hasSearchTerm ? 'No se encontraron profesores' : 'No hay profesores registrados'}
      </h3>
      <p className="text-gray-500">
        {hasSearchTerm
          ? 'Intenta con otro término de búsqueda'
          : 'Comienza agregando profesores a esta sucursal'}
      </p>
    </div>
  );
};

export default EmptyState;
