export const SectionTitle = ({ children, subtitle, centered = true, className = '' }) => {
    return (
      <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          <span className="text-gradient">{children}</span>
        </h2>
        {subtitle && (
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    );
  };