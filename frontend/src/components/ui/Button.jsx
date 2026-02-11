function Button({ children, variant = 'default', size = 'default', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50'

  const variants = {
    default: 'bg-greyhound-green text-white hover:bg-greyhound-green/90 shadow-lg shadow-greyhound-green/25 hover:shadow-greyhound-green/40',
    outline: 'border-2 border-greyhound-green text-greyhound-green bg-transparent hover:bg-greyhound-green hover:text-white',
    ghost: 'text-greyhound-green hover:bg-greyhound-green/10',
    gold: 'bg-greyhound-gold text-greyhound-dark font-bold hover:bg-greyhound-gold/90 shadow-lg shadow-greyhound-gold/25',
  }

  const sizes = {
    default: 'h-11 px-5 py-2 text-sm',
    sm: 'h-9 px-4 text-xs',
    lg: 'h-12 px-8 text-base',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
