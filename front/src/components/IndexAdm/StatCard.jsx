import PropTypes from 'prop-types';

const StatCard = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className={`bg-gradient-to-r ${colorClasses[color]} p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium opacity-90">{title}</p>
            <p className="text-white text-3xl font-bold mt-2">{value || 0}</p>
          </div>
          {icon && (
            <div className="text-white text-4xl opacity-80">
              <i className={icon}></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
  icon: PropTypes.string,
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange']),
};

export default StatCard;
