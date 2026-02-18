import { Link } from 'react-router-dom';

export default function Analytics() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-blue-50 p-6 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Analytics Coming Soon</h2>
      <p className="text-text-secondary max-w-md mb-8">
        We're building advanced reporting and deep-dive analytics to help you understand your customer base better.
      </p>
      <Link to="/" className="px-6 py-2 bg-white border border-border text-text-primary font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm">
        Back to Dashboard
      </Link>
    </div>
  );
}
