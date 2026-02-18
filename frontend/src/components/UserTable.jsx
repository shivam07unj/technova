import { useNavigate } from 'react-router-dom';

export default function UserTable({ users }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-text-muted">Name</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Credit Score</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Risk Category</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Preferred Channel</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Offers Sent</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                className="border-b border-border last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-text-primary">{user.name}</td>
                <td className="px-4 py-3 text-text-secondary">{user.credit_score}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                    user.risk_category === 'Low' ? 'bg-green-50 text-green-700' :
                    user.risk_category === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {user.risk_category}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary capitalize">{user.preferred_channel}</td>
                <td className="px-4 py-3 text-text-secondary">{user.offers_sent ?? 0}</td>
                <td className="px-4 py-3 text-text-secondary">{user.conversion_rate ?? '0%'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
