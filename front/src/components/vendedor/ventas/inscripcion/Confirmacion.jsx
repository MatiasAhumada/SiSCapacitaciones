import React from 'react';

const Confirmacion = ({ nextStep, prevStep }) => {
    return (
        <div className="p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Step 4: conformacion</h2>
            <p>Verifica tu identidad.</p>
            <div className="flex justify-start mt-4">
                <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">
                    Anterior
                </button>
            </div>
        </div>
    );
};

export default Confirmacion;