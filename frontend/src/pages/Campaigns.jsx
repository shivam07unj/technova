import { Link } from 'react-router-dom';

export default function Campaigns() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-purple-50 p-6 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Campaigns Coming Soon</h2>
      <p className="text-text-secondary max-w-md mb-8">
        Create and manage multi-channel marketing campaigns directly from this dashboard.
      </p>
      <Link to="/" className="px-6 py-2 bg-white border border-border text-text-primary font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm">
        Back to Dashboard
      </Link>
    </div>
  );
}
