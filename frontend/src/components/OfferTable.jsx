function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function OfferTable({ offers }) {
  if (!offers || offers.length === 0) {
    return (
      <div className="bg-white border border-border rounded-lg p-8 text-center text-text-muted text-sm">
        No offers sent yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-text-muted">Product</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Life Event</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Channel</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted max-w-xs">Message Preview</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Sent</th>
              <th className="text-center px-4 py-3 font-medium text-text-muted">Clicked</th>
              <th className="text-center px-4 py-3 font-medium text-text-muted">Converted</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer, idx) => (
              <tr key={idx} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-text-primary">{offer.product_name || '—'}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-purple-50 text-purple-700 capitalize">
                    {(offer.life_events || '').replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary capitalize">{offer.channel || '—'}</td>
                <td className="px-4 py-3 text-text-secondary max-w-xs truncate" title={offer.generated_message}>
                  {offer.generated_message
                    ? offer.generated_message.substring(0, 80) + (offer.generated_message.length > 80 ? '…' : '')
                    : '—'}
                </td>
                <td className="px-4 py-3 text-text-secondary">{formatDate(offer.sent_at || offer.created_at)}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block w-5 h-5 leading-5 text-xs font-medium rounded-full ${
                    offer.clicked ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {offer.clicked ? '✓' : '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block w-5 h-5 leading-5 text-xs font-medium rounded-full ${
                    offer.converted ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {offer.converted ? '✓' : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
