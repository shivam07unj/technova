function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white border border-border rounded-lg p-8 text-center text-text-muted text-sm">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-text-muted">Date</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Category</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Merchant</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => (
              <tr key={idx} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-text-secondary">{formatDate(tx.timestamp || tx.date)}</td>
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700 capitalize">
                    {tx.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-primary">{tx.merchant || tx.description || '—'}</td>
                <td className="px-4 py-3 text-right font-medium text-text-primary">{formatCurrency(tx.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
