import PropTypes from 'prop-types';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const StudentDemographicsChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="studentAgeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="label"
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
          interval={0}
          tickFormatter={(label) => label.replace(' a ', '-').replace(' o más', '+')}
        />
        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value) => [value, 'Alumnos']}
          labelFormatter={(label) => `Edad: ${label}`}
        />
        <Bar dataKey="total" fill="url(#studentAgeGradient)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

StudentDemographicsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      range: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default StudentDemographicsChart;
