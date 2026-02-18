import { useState, useEffect } from 'react';
import StatsCard from '../components/StatsCard';
import { getStats, getUsers, getUserOffers } from '../api/analyze';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOffers, setRecentOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, usersData] = await Promise.all([
          getStats(),
          getUsers(),
        ]);
        setStats(statsData);

        // Get recent offers across all users
        const offerPromises = usersData.slice(0, 10).map(async (user) => {
          const offers = await getUserOffers(user.id);
          return offers.map(o => ({ ...o, userName: user.name }));
        });
        const allOffers = (await Promise.all(offerPromises)).flat();
        allOffers.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        setRecentOffers(allOffers.slice(0, 8));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-text-muted text-sm">Loading dashboard…</div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-text-primary">Dashboard</h2>
        <p className="text-sm text-text-muted mt-1">Platform overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard label="Total Users" value={stats?.total_users ?? 0} />
        <StatsCard label="Offers Sent" value={stats?.total_offers ?? 0} />
        <StatsCard label="Conversion Rate" value={stats?.conversion_rate ?? '0%'} />
        <StatsCard label="Avg Propensity" value={stats?.avg_propensity ?? '0.00'} subtitle="AI confidence score" />
        <StatsCard label="Revenue Impact" value="₹12.4L" subtitle="Estimated incremental" />
      </div>

      {/* Recent Offers */}
      <div className="mt-8">
        <h3 className="text-base font-medium text-text-primary mb-4">Recent Offers</h3>
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          {recentOffers.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-text-muted">No offers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-text-muted">User</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Product</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Life Event</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Channel</th>
                    <th className="text-center px-4 py-3 font-medium text-text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOffers.map((offer, idx) => (
                    <tr key={idx} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium text-text-primary">{offer.userName}</td>
                      <td className="px-4 py-3 text-text-secondary">{offer.product_name || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-purple-50 text-purple-700 capitalize">
                          {(offer.life_events || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary capitalize">{offer.channel}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                          offer.converted
                            ? 'bg-green-50 text-green-700'
                            : offer.clicked
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {offer.converted ? 'Converted' : offer.clicked ? 'Clicked' : 'Sent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
