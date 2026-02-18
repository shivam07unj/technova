export default function Card({ children, className = '', animate = false }) {
  return (
    <div
      className={`glass-card p-6 ${animate ? 'animate-fade-in' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
