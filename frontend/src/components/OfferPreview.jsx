import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';

export default function OfferPreview({ visible, analysisResult }) {
  if (!visible || !analysisResult) return null;

  const message = analysisResult.personalized_message || 'No message generated.';
  const complianceStatus = analysisResult.compliance?.status || 'pending';
  const productName = analysisResult.recommended_product?.name || 'Product';
  const checksPassedCount = analysisResult.compliance?.checks_passed?.length || 0;

  const complianceBadge =
    complianceStatus === 'approved'
      ? '✅ Regulatory Approved'
      : complianceStatus === 'pending'
        ? '⏳ Pending Review'
        : '❌ Rejected';

  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Generated Offer</h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-success rounded-full"></span>
          <span className="text-xs text-text-muted">Ready to send</span>
        </div>
      </div>

      {/* WhatsApp-style Chat Bubble */}
      <div className="bg-surface-lighter/50 rounded-2xl p-4 mb-4">
        {/* Chat Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/30">
          <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">WhatsApp Business</p>
            <p className="text-xs text-text-muted">Channel: WhatsApp • {productName}</p>
          </div>
        </div>

        {/* Message Bubble */}
        <div className="flex justify-start mb-3">
          <div className="max-w-[85%] bg-[#005C4B] rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg relative">
            <p className="text-sm text-[#E9EDEF] leading-relaxed">{message}</p>
            <div className="flex items-center justify-end gap-1 mt-2">
              <span className="text-[10px] text-[#8696A0]">{timestamp}</span>
              <svg className="w-4 h-4 text-[#53BDEB]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.53 6.47a.75.75 0 0 1 .073.976l-.073.084-8 8a.75.75 0 0 1-.976.073l-.084-.073-4-4a.75.75 0 0 1 .976-1.133l.084.073L9 13.94l7.47-7.47a.75.75 0 0 1 1.06 0Z" />
                <path d="M12.53 6.47a.75.75 0 0 1 .073.976l-.073.084-5 5a.75.75 0 0 1-1.133-.976l.073-.084 5-5a.75.75 0 0 1 1.06 0Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={complianceStatus === 'approved' ? 'success' : complianceStatus === 'pending' ? 'accent' : 'danger'}>
            {complianceBadge}
          </Badge>
          <Badge variant="accent">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            WhatsApp
          </Badge>
          {checksPassedCount > 0 && (
            <Badge variant="primary">{checksPassedCount} checks passed</Badge>
          )}
        </div>
        <Button variant="success" className="w-full sm:w-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
          Send Offer
        </Button>
      </div>
    </Card>
  );
}
