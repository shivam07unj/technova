export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-surface-lighter text-text-secondary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-danger/20 text-danger',
    primary: 'bg-primary/20 text-primary-light',
    accent: 'bg-accent/20 text-accent-light',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
