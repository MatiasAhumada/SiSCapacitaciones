import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <i className="fa-solid fa-search text-gray-400 text-lg"></i>
        </div>
        <input
          type="text"
          placeholder="Buscar profesor por nombre o apellido..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
