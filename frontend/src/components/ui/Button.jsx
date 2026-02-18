export default function Button({ children, onClick, variant = 'primary', loading = false, className = '', disabled = false }) {
  const variants = {
    primary:
      'bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-accent text-white shadow-lg shadow-primary/25 hover:shadow-primary/40',
    secondary:
      'bg-surface-lighter hover:bg-surface-lighter/80 text-text-primary border border-border',
    success:
      'bg-gradient-to-r from-success to-emerald-400 hover:from-emerald-600 hover:to-emerald-300 text-white shadow-lg shadow-success/25',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
