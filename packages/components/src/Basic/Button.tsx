import React, { useState } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyles = 'font-semibold rounded transition-colors duration-200';
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];
  const disabledStyle = disabled || loading ? 'opacity-50 cursor-not-allowed' : '';

  const finalClassName = `${baseStyles} ${variantStyle} ${sizeStyle} ${disabledStyle} ${className}`;

  return (
    <button
      className={finalClassName}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center">
          <span className="animate-spin mr-2">⟳</span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
