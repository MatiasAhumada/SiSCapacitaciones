import PropTypes from 'prop-types';

const Button = ({ children, onClick, className = '', ...props }) => {
  return (
    <button className={className} style={{ borderRadius: '8px' }} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
