import PropTypes from 'prop-types';

const ComisionHeader = ({ comision }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm mb-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-3 principal">{comision.name}</h2>
      <div className="flex flex-wrap gap-4 text-gray-700">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-calendar-days text-blue-600"></i>
          <span className="font-medium">{comision.day}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-clock text-blue-600"></i>
          <span className="font-medium">
            {comision.hour?.start} - {comision.hour?.end}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-chalkboard-user text-blue-600"></i>
          <span className="font-medium">
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
