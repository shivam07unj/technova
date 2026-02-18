import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TransactionTable from '../components/TransactionTable';
import OfferTable from '../components/OfferTable';
import { getUserDetail, getUserTransactions, getUserOffers, triggerAnalysis } from '../api/analyze';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [newOffer, setNewOffer] = useState(null);

  const fetchData = async () => {
    try {
      const [userData, txData, offerData] = await Promise.all([
        getUserDetail(id),
        getUserTransactions(id),
        getUserOffers(id),
      ]);
      setUser(userData);
      setTransactions(txData);
      setOffers(offerData);
    } catch (err) {
      console.error('UserDetail fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setNewOffer(null);
    try {
      const result = await triggerAnalysis(id);
      setNewOffer(result);
      // Refresh offers list to show the saved one
      const updatedOffers = await getUserOffers(id);
      setOffers(updatedOffers);
    } catch (err) {
      console.error('Analysis error:', err);
      alert('Failed to run AI analysis. Check console for details.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-text-muted text-sm">Loading user…</div>;
  }

  if (!user) {
    return (
      <div className="py-16 text-center">
        <p className="text-text-muted text-sm">User not found.</p>
        <Link to="/users" className="text-primary text-sm mt-2 inline-block hover:underline">
          ← Back to Users
        </Link>
      </div>
    );
  }

  const profileFields = [
    { label: 'Age', value: user.age },
    { label: 'Income', value: formatCurrency(user.income || 0) },
    { label: 'Credit Score', value: user.credit_score },
    { label: 'Risk Category', value: user.risk_category },
    { label: 'Marital Status', value: user.marital_status },
    { label: 'Preferred Channel', value: user.preferred_channel },
  ];

  return (
    <div>
      {/* Breadcrumb & Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <nav className="flex items-center gap-2 text-sm text-text-muted">
          <Link to="/users" className="hover:text-text-primary transition-colors">Users</Link>
          <span>/</span>
          <span className="text-text-primary font-medium">{user.name}</span>
        </nav>

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {analyzing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analying…
            </>
          ) : (
            <>
              <span>✨</span> Generate Offer
            </>
          )}
        </button>
      </div>

      {newOffer && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-8 animate-fade-in relative">
          <button 
            onClick={() => setNewOffer(null)}
            className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
          >
            ×
          </button>
          <div className="flex items-start gap-4">
            <div className="text-2xl">✨</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-text-primary mb-2">AI Recommendation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Detected Life Event</p>
                  <p className="text-sm font-medium text-text-primary capitalize bg-white inline-block px-2 py-1 rounded border border-blue-100">
                    {newOffer.life_event?.event_type?.replace(/_/g, ' ') || 'None'}
                    <span className="ml-2 text-xs text-text-muted font-normal">
                      ({(newOffer.life_event?.confidence * 100).toFixed(0)}% confidence)
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-1">Recommended Product</p>
                  <p className="text-sm font-medium text-text-primary">{newOffer.recommended_product?.name}</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded border border-blue-100">
                <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mb-2">Generated Message</p>
                <p className="text-sm text-text-primary italic">"{newOffer.personalized_message}"</p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                <span>Compliance Check:</span>
                <span className={newOffer.compliance?.status === 'approved' ? 'text-success font-medium' : 'text-danger font-medium'}>
                  {newOffer.compliance?.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Profile Summary */}
      <section className="bg-white border border-border rounded-lg p-6 mb-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Profile Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {profileFields.map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-text-muted mb-1">{label}</p>
              <p className="text-sm font-medium text-text-primary capitalize">{value ?? '—'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Transaction History */}
      <section className="mb-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">
          Transaction History
          <span className="ml-2 text-sm font-normal text-text-muted">({transactions.length})</span>
        </h3>
        <TransactionTable transactions={transactions} />
      </section>

      {/* Section 3: Offers Sent History */}
      <section className="mb-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">
          Offers Sent
          <span className="ml-2 text-sm font-normal text-text-muted">({offers.length})</span>
        </h3>
        <OfferTable offers={offers} />
      </section>
    </div>
  );
}
