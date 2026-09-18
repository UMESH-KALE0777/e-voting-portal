const InputField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:border-blue-600"
    />
  );
};

export default InputField;