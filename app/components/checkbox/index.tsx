import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState, useEffect } from "react";

type CheckboxProps = {
  id: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
};

export default function Checkbox({ id, checked = false, onChange, label }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
    if (onChange) onChange(!isChecked);
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        id={id}
        checked={isChecked}
        onChange={toggleCheckbox}
        className="hidden"
      />
      <motion.div
        className="w-5 h-5 flex-shrink-0 rounded-md border border-gray-400 flex items-center justify-center cursor-pointer"
        initial={{ backgroundColor: "#fff" }}
        animate={{ backgroundColor: isChecked ? "#2E5266" : "#fff" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={toggleCheckbox}
      >
        {isChecked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Check className="text-white w-4 h-4" />
          </motion.div>
        )}
      </motion.div>
      {label && (
        <label htmlFor={id} className="text-gray-700 select-none cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
}