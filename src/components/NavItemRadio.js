export const NavItemRadio = ({
  id,
  name = "default",
  value,
  label,
  onChange,
  defaultChecked,
}) => {
  return (
    <>
      <input
        id={id ?? label}
        type="radio"
        name={name}
        value={value}
        onChange={onChange}
        defaultChecked={defaultChecked}
        hidden
      />
      <label htmlFor={id ?? label}>{label}</label>
    </>
  );
};
