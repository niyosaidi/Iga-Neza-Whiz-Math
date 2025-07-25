
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`flex items-center justify-center text-lg font-bold py-3 px-6 rounded-xl shadow-md transform hover:scale-105 active:scale-100 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
