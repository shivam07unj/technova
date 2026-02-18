import Card from './ui/Card';
import Badge from './ui/Badge';
import ProgressRing from './ui/ProgressRing';
import { customer } from '../data/mockData';

export default function CustomerProfile() {
  return (
    <Card className="animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Customer Profile</h2>
        <Badge variant="primary">ID: {customer.customerId}</Badge>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/20">
            {customer.avatar}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-surface"></div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-text-primary">{customer.name}</h3>
          <p className="text-sm text-text-muted mt-0.5">Member since {customer.memberSince}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
            <Badge variant="success">
              <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
              Risk: {customer.riskCategory}
            </Badge>
            {customer.activeProducts.map((p) => (
              <Badge key={p} variant="accent">{p}</Badge>
            ))}
          </div>
        </div>

        {/* Credit Score */}
        <div className="flex flex-col items-center">
          <ProgressRing value={customer.creditScore} max={customer.maxCreditScore} size={100} strokeWidth={7} />
          <span className="text-xs text-text-muted mt-2 font-medium">Credit Score</span>
        </div>
      </div>
    </Card>
  );
}
