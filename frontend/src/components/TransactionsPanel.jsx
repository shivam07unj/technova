import Card from './ui/Card';
import { transactions } from '../data/mockData';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export default function TransactionsPanel() {
  return (
    <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Recent Transactions</h2>
        <span className="text-xs text-text-muted">{transactions.length} transactions</span>
      </div>

      <div className="space-y-3">
        {transactions.map((tx, i) => (
          <div
            key={tx.id}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-lighter/50 transition-all duration-200 group"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="w-11 h-11 rounded-xl bg-surface-lighter flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-200">
              {tx.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{tx.description}</p>
              <p className="text-xs text-text-muted mt-0.5">{tx.category} • {formatDate(tx.date)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-danger">
                - {formatCurrency(tx.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
