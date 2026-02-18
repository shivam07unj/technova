import { useState } from 'react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { analyzeTransaction } from '../api/analyze';
import { transactions as mockTransactions, customer as mockCustomer } from '../data/mockData';

export default function AIAnalysis({ onAnalysisComplete }) {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runAnalysis = async () => {
    setStatus('loading');
    setResult(null);
    setError(null);

    try {
      // Build the request payload matching the backend's AnalysisRequest schema
      const payload = {
        user_id: mockCustomer.customerId,
        transactions: mockTransactions.map((tx) => ({
          amount: tx.amount,
          category: tx.category,
          date: `${tx.date}T00:00:00`,
          merchant: tx.description,
          description: tx.description,
        })),
        annual_income: 75000,
        current_balance: 100000,
      };

      const data = await analyzeTransaction(payload);

      // Map backend response to UI-friendly format
      const mapped = {
        detectedLifeEvent: data.life_event?.description || 'Unknown',
        recommendedProduct: data.recommended_product?.name || 'N/A',
        confidenceScore: Math.round((data.life_event?.confidence || 0) * 100),
        eligibility: data.credit_eligibility?.is_eligible ? 'Pre-approved' : 'Not Eligible',
      };

      setResult(mapped);
      setStatus('done');
      onAnalysisComplete?.(data); // pass full backend response up
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.response?.data?.detail || err.message || 'Analysis failed');
      setStatus('error');
    }
  };

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">AI Analysis</h2>
        {status === 'done' && <Badge variant="success">Complete</Badge>}
        {status === 'error' && <Badge variant="danger">Error</Badge>}
      </div>

      {/* Idle State */}
      {status === 'idle' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <p className="text-sm text-text-secondary mb-1">Analyze customer behavior</p>
          <p className="text-xs text-text-muted mb-6">AI will detect life events and recommend products</p>
          <Button onClick={runAnalysis}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
            </svg>
            Run AI Analysis
          </Button>
        </div>
      )}

      {/* Loading State */}
      {status === 'loading' && (
        <div className="text-center py-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin-slow"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-accent animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-text-secondary animate-pulse">Analyzing transaction patterns...</p>
          <p className="text-xs text-text-muted mt-1">Calling AI engine on the backend</p>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-danger/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm text-danger font-medium mb-1">Analysis Failed</p>
          <p className="text-xs text-text-muted mb-4">{error}</p>
          <p className="text-xs text-text-muted mb-4">Make sure the backend is running on port 8000</p>
          <Button onClick={runAnalysis}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Retry
          </Button>
        </div>
      )}

      {/* Results */}
      {status === 'done' && result && (
        <div className="space-y-4 animate-slide-up">
          <ResultItem
            icon="🌍"
            label="Detected Life Event"
            value={result.detectedLifeEvent}
            badge={<Badge variant="accent">Detected</Badge>}
          />
          <ResultItem
            icon="💳"
            label="Recommended Product"
            value={result.recommendedProduct}
            badge={<Badge variant="primary">Best Match</Badge>}
          />
          <div className="flex gap-3">
            <div className="flex-1 p-4 rounded-xl bg-surface-lighter/50">
              <p className="text-xs text-text-muted mb-1">Confidence Score</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-gradient">{result.confidenceScore}%</span>
              </div>
              <div className="mt-2 h-1.5 bg-surface-lighter rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                  style={{ width: `${result.confidenceScore}%` }}
                ></div>
              </div>
            </div>
            <div className={`flex-1 p-4 rounded-xl border ${result.eligibility === 'Pre-approved' ? 'bg-success/10 border-success/20' : 'bg-warning/10 border-warning/20'}`}>
              <p className="text-xs text-text-muted mb-1">Eligibility</p>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${result.eligibility === 'Pre-approved' ? 'text-success' : 'text-warning'}`}>
                  {result.eligibility === 'Pre-approved' ? '✓' : '⚠'}
                </span>
                <span className={`text-sm font-semibold ${result.eligibility === 'Pre-approved' ? 'text-success' : 'text-warning'}`}>
                  {result.eligibility}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function ResultItem({ icon, label, value, badge }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-surface-lighter/50">
      <div className="w-10 h-10 rounded-xl bg-surface-lighter flex items-center justify-center text-lg">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-sm font-semibold text-text-primary">{value}</p>
      </div>
      {badge}
    </div>
  );
}
