import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/campaigns', label: 'Campaigns' },
];

export default function Navbar() {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-base font-semibold text-text-primary leading-tight">
              FinSight
            </h1>
            <p className="text-[11px] text-text-muted leading-tight">
              Cross-Sell Platform
            </p>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'text-primary bg-blue-50'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-md hover:bg-gray-50 transition-colors">
            Log in
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
}
