import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "outlined" | "outlined-white" | 'solid' | "danger" | 'disabled';
  className?: string;
  isLoading?: boolean;
  icon?: any;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "outlined",
  className = "",
  isLoading = false,
  disabled,
  icon,
  ...props
}) => {
  const baseStyles = "cursor-pointer flex items-center gap-2 justify-center px-8 py-3 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0";
  const variantStyles = {
    outlined: "border border-[#43896B] text-[#43896B] hover:bg-[#43896B] hover:text-white",
    "outlined-white": "border border-white text-white hover:bg-white hover:text-[#43896B]",
    solid: "text-white bg-[#43896B] hover:bg-white border border-[#43896B] hover:text-[#43896B]",
    danger: "border border-[#DE3131] text-[#DE3131] hover:bg-[#DE3131] hover:text-white",
    disabled: 'border border-[#C6C8D2] text-[#C6C8D2]'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        (isLoading || disabled) ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isLoading || disabled}
      {...props}
    >
      {icon && <div>{icon}</div>}
      <div>{isLoading ? "Loading..." : children}</div>
    </button>
  );
};

export default Button;
