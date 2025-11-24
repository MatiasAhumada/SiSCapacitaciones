import PropTypes from 'prop-types';

const ComisionHeader = ({ comision }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg mb-6 border border-indigo-100 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-4 principal">{comision.name}</h2>
      <div className="flex flex-wrap gap-4 text-gray-700">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
          <i className="fa-solid fa-calendar-days text-blue-600"></i>
          <span className="font-semibold">{comision.day}</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
          <i className="fa-solid fa-clock text-blue-600"></i>
          <span className="font-semibold">
            {comision.hour?.start} - {comision.hour?.end}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
          <i className="fa-solid fa-chalkboard-user text-blue-600"></i>
          <span className="font-semibold">
            {comision.profesor?.name} {comision.profesor?.apellido}
          </span>
        </div>
      </div>
    </div>
  );
};

ComisionHeader.propTypes = {
  comision: PropTypes.object.isRequired,
};

export default ComisionHeader;
