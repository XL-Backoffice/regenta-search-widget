import React from 'react';

const Label = ({ text, className }) => {
  return (
    <>     
       
              
              <label htmlFor="12" className={`block gray_color text-base mb-2 ${className}`}>
                {text}
              </label>
                       
      
    </>
  )
};
export default Label;