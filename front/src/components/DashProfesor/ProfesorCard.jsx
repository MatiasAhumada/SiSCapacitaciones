import React, { useState } from 'react';
import { Spinner } from '../Spinner/Spinner';
import { ModalEditarGenerico } from '../ModalEditar/ModalEditarGenerico';

const ProfesorCard = ({ profesor, onDelete, onEdit, isDeleting }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  };

  const handleEditClick = () => {
    setEditData({
      name: profesor.name,
      apellido: profesor.apellido,
      tel: profesor.tel,
      email: profesor.email || '',
      direccion: profesor.direccion || '',
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    await onEdit(profesor.id, editData);
    setShowEditModal(false);
  };

  const editFields = [
    { name: 'name', label: 'Nombre', type: 'text', placeholder: 'Nombre' },
    { name: 'apellido', label: 'Apellido', type: 'text', placeholder: 'Apellido' },
    { name: 'tel', label: 'Teléfono', type: 'tel', placeholder: 'Teléfono' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
    { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Dirección' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-indigo-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {profesor.name[0]}{profesor.apellido[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{profesor.name} {profesor.apellido}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                <i className="fa-solid fa-users mr-1.5"></i>
                {profesor.cantidadComisiones} {profesor.cantidadComisiones === 1 ? 'comisión' : 'comisiones'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleToggle}
            className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            title="Ver comisiones activas"
          >
            <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
          <button
            onClick={handleEditClick}
            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
            title="Editar profesor"
          >
            <i className="fa-solid fa-pen"></i>
          </button>
          <button
            onClick={(e) => {
              e.target.value = profesor.id;
              onDelete(e);
            }}
            disabled={isDeleting}
            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
            title="Eliminar profesor"
          >
            {isDeleting ? (
              <Spinner color="currentColor" />
            ) : (
              <i className="fa-solid fa-trash"></i>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <i className="fa-solid fa-graduation-cap text-indigo-600"></i>
            <h4 className="font-semibold text-gray-700">Comisiones activas:</h4>
          </div>
          {profesor.comisiones && profesor.comisiones.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profesor.comisiones.map((comision) => (
                <span 
                  key={comision.id} 
                  className="inline-flex items-center px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50 text-gray-700 text-sm font-medium border border-indigo-200 shadow-sm"
                >
                  <i className="fa-solid fa-circle-check text-green-500 mr-2 text-xs"></i>
                  {comision.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-sm">No tiene comisiones activas asignadas</p>
          )}
        </div>
      )}

      {showEditModal && (
        <ModalEditarGenerico
          title="Editar Profesor"
          formData={editData}
          fields={editFields}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
          onChange={handleEditChange}
        />
      )}
    </div>
  );
};

export default ProfesorCard;
