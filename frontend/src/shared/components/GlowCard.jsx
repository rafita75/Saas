export const GlowCard = ({ children, className = '', hover = true, onClick, ...props }) => {
  return (
    <div 
      className={`
        glass rounded-2xl p-6 transition-all duration-300
        ${hover ? 'hover:glow-effect hover:-translate-y-1' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};