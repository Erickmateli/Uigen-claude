import React from 'react'

interface CardProps {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  footer?: React.ReactNode
  children?: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
  className?: string
  onClick?: () => void
}

function Card({
  title,
  description,
  image,
  imageAlt = 'card image',
  footer,
  children,
  variant = 'default',
  className = '',
  onClick,
}: CardProps) {
  const baseStyles = 'rounded-2xl overflow-hidden transition-all duration-200'

  const variantStyles = {
    default: 'bg-white shadow-md',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-xl hover:shadow-2xl',
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {image && (
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        {title && (
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        )}
        {description && (
          <p className="text-gray-500 text-sm">{description}</p>
        )}
        {children && <div className="mt-3">{children}</div>}
      </div>

      {footer && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card