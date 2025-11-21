import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'black' | 'danger';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'black', 
  isLoading, 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-base transition-all duration-200 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black";
  
  const variants = {
    primary: "bg-[#FF5A5F] text-white hard-shadow hover:bg-[#FF4046]", // Radical Red
    black: "bg-black text-white hard-shadow hover:bg-stone-800",
    secondary: "bg-white text-black hard-shadow hover:bg-stone-50",
    danger: "bg-white text-red-500 border-red-500 hover:bg-red-50", // No shadow for danger usually, or keep it
    ghost: "bg-transparent text-stone-500 border-transparent shadow-none hover:bg-stone-100",
  };

  // Ghost variant shouldn't have the hard border or shadow usually, override base if needed
  const finalClass = variant === 'ghost' 
    ? "inline-flex items-center justify-center px-4 py-2 rounded-lg font-bold text-sm text-stone-500 hover:text-black hover:bg-stone-100 transition-colors"
    : `${baseStyles} ${variants[variant]}`;

  return (
    <button 
      className={`${finalClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};