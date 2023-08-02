const Button = ({ label, icons, onClick, className ,children }) => {
  return (
    <button
      onClick={onClick}
      className={`flex bg-red-200 rounded-md gap-3 w-full items-center p-2 m-2  ${className}`}
    >
      {icons}
      {label}
      {children}
    </button>
  );
};

export default Button;
