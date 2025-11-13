import PropTypes from 'prop-types';

const FilterButton = ({ color, activeFiltersCount, dropdownId, children }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
  };

  const badgeColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
  };

  return (
    <div className="relative">
      <button
        onClick={() => document.getElementById(dropdownId).classList.toggle('hidden')}
        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${colorClasses[color]} text-white rounded-lg text-sm font-medium transition-all shadow-md`}
      >
        <i className="fa-solid fa-filter"></i>
        Filtros
        {activeFiltersCount > 0 && (
          <span
            className={`bg-white ${badgeColorClasses[color]} px-2 py-0.5 rounded-full text-xs font-bold`}
          >
            {activeFiltersCount}
          </span>
        )}
      </button>
      <div
        id={dropdownId}
        className="hidden absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-10 max-h-96 overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
};

FilterButton.propTypes = {
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange']).isRequired,
  activeFiltersCount: PropTypes.number.isRequired,
  dropdownId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default FilterButton;
