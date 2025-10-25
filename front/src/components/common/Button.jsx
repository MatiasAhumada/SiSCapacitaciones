const Button = ({ children, onClick, className = '', ...props }) => {
  return (
    <button
      className={className}
      style={{ borderRadius: '8px' }}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
