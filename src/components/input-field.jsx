import React from 'react';

const InputField = ({ name, type, id, className, placeholder, required, onChange, value, autoComplete, disabled }) => {
  return (
    <>      
        <input
          placeholder={placeholder}
          required={required}
          type={type}
          name={name}
          id={id}
          value={value}   
          autoComplete={autoComplete}       
          disabled={disabled}       
          className={`block py-2 sm:py-3 px-5 placeholder:black_textcolor black_textcolor shadow-sm outline-0 ${className}`}
          onChange={onChange}
        />
      
    </>
  )
};
export default InputField;