import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesBySellerChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
        <defs>
          <linearGradient id="colorSeller" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.9}/>
            <stop offset="95%" stopColor="#ea580c" stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
        <YAxis dataKey="name" type="category" stroke="#6b7280" style={{ fontSize: '12px' }} width={100} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
          formatter={(value) => [`$${value.toLocaleString()}`, 'Ventas']}
        />
        <Bar dataKey="sales" fill="url(#colorSeller)" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

SalesBySellerChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SalesBySellerChart;
