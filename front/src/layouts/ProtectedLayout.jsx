import PropTypes from 'prop-types';
import UnifiedNav from '../components/Navigation/UnifiedNav';

const ProtectedLayout = ({ children }) => {
  return (
    <div className="min-h-full">
      <UnifiedNav />
      <main className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

ProtectedLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedLayout;
