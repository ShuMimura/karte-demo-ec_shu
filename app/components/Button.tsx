interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = 'px-6 py-2 rounded-lg font-normal transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm border';
  
  const variantStyles = {
    primary: 'bg-[#16a085] hover:bg-[#138d75] text-white border-[#16a085] shadow-sm hover:shadow',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border-gray-300 shadow-sm',
    danger: 'bg-white hover:bg-gray-50 text-red-700 border-red-300 shadow-sm',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
    >
      {children}
    </button>
  );
}


