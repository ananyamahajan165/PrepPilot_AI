import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  hover?: boolean;
  className?: string;
}

const Card = ({
  children,
  title,
  subtitle,
  footer,
  hover = true,
  className = "",
}: CardProps) => {
  return (
    <div
      className={`
        bg-white
        rounded-2xl
        shadow-md
        border
        border-gray-100
        p-6
        transition-all
        duration-300
        ${
          hover
            ? "hover:-translate-y-1 hover:shadow-xl"
            : ""
        }
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="mb-6">

          {title && (
            <h2 className="text-xl font-bold text-gray-900">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="text-gray-500 mt-1">
              {subtitle}
            </p>
          )}

        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div className="mt-6 pt-5 border-t">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;