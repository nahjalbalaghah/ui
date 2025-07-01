import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  icon?: any;
}

const Input: React.FC<InputProps> = ({ label, error, className, icon, ...props }) => {
  return (
    <div className="w-full text-sm">
      {label && <label className="block font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative" >
        <input
          className={`
            w-full p-3 text-sm placeholder:text-[#5A5D72] border border-[#D7DEE9] rounded-xl outline-none transition 
            focus:ring-2 focus:ring-[#43896B] focus:border-[#43896B]
            ${error ? "border-red-500" : "border-gray-300"} 
            ${className}
          `}
          {...props}
        />
        <div className="absolute top-1/2 -translate-y-1/2 right-4" >{icon}</div>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;