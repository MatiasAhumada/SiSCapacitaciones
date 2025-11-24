import React from 'react';
import { Spinner } from '../Spinner/Spinner';

const LoadingState = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
      <div className="inline-flex p-6 bg-indigo-100 rounded-full mb-4">
        <Spinner color="#4f46e5" />
      </div>
      <p className="text-gray-600 font-medium text-lg">Cargando profesores...</p>
    </div>
  );
};

export default LoadingState;
