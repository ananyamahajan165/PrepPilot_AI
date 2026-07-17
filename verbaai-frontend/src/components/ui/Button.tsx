import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
}: ButtonProps) => {
  const variantStyles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline:
      "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-base",
    lg: "px-7 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        rounded-xl
        font-semibold
        transition-all
        duration-300
        flex
        items-center
        justify-center
        gap-2
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {loading && (
        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}

      {children}
    </button>
  );
};

export default Button;