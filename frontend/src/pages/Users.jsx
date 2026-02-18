import { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import { getUsers } from '../api/analyze';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Users fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-text-muted text-sm">Loading users…</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Users</h2>
          <p className="text-sm text-text-muted mt-1">{users.length} registered users</p>
        </div>
      </div>

      <UserTable users={users} />
    </div>
  );
}
