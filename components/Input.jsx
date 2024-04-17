import { useState } from "react";

const Input = ({ text, type, required, value, onChange, disabled = false }) => {
  return (
    <div className="mb-2 sm:mb-6 text-left">
      <label className="block text-xs font-medium uppercase">{text}</label>
      {type === "file" && <img src={value} className="rounded-full w-10 h-10 cursor-pointer" />}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`mt-1 p-2 w-full bg-background rounded-md border-transparent outline-none ${disabled && "opacity-40 cursor-not-allowed"}`}
      />
    </div>
  );
};

export default Input;
