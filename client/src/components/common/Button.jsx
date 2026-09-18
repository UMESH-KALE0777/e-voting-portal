const Button = ({
  text,
  onClick,
  type = "button",
  bgColor = "bg-blue-600",
  hoverColor = "hover:bg-blue-700",
  width = "w-auto",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${bgColor} ${hoverColor} ${width} text-white px-6 py-3 rounded-xl font-semibold transition duration-300`}
    >
      {text}
    </button>
  );
};

export default Button;