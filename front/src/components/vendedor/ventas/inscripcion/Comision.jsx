import React from 'react';

const Comision = ({ nextStep, prevStep }) => {
    return (
        <div className="p-4 border rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Step 3: comision</h2>
        <p>Introduce tu información de contacto.</p>
        <div className="flex justify-between mt-4">
            <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">
                Anterior
            </button>
            <button onClick={nextStep} className="px-4 py-2 bg-blue-500 text-white rounded">
                Siguiente
            </button>
        </div>
    </div>
    );
};

export default Comision;