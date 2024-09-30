interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const Button = ({
  label,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
}: ButtonProps) => {
  const baseStyles =
    "font-bold rounded focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeStyles = {
    small: "py-1 px-3 text-sm",
    medium: "py-2 px-4 text-base",
    large: "py-3 px-6 text-lg",
  };
  const variantStyles = {
    primary: "bg-neonBlue text-white hover:bg-chefchaouenBlue",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    outline:
      "border border-neonBlue text-neonBlue hover:bg-neonBlue hover:text-white",
  };
  const disabledStyles = "opacity-50 cursor-not-allowed";

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${
    variantStyles[variant]
  } ${disabled ? disabledStyles : ""}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={combinedStyles}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
