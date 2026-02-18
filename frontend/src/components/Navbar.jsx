import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Modal from './Modal';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/analytics', label: 'Analytics' },
  { to: '/campaigns', label: 'Campaigns' },
];

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', body: '' });

  const handleAuthClick = (type) => {
    setModalContent({
      title: `${type} Coming Soon`,
      body: (
        <div className="space-y-3">
          <p>
            Secure authentication and role-based access control are currently under development.
          </p>
          <div className="bg-green-50 text-green-800 p-3 rounded-md border border-green-100 flex items-start gap-2">
            <span className="text-lg">🛡️</span>
            <div>
              <p className="font-medium text-sm">Admin Access Granted</p>
              <p className="text-xs opacity-90">
                For this demo session, you have automatically been granted full <strong>Admin Privileges</strong> to explore all features.
              </p>
            </div>
          </div>
        </div>
      )
    });
    setIsModalOpen(true);
  };

  return (
    <>
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
            <button 
              onClick={() => handleAuthClick('Log In')}
              className="px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-md hover:bg-gray-50 transition-colors"
            >
              Log in
            </button>
            <button 
              onClick={() => handleAuthClick('Sign Up')}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        {modalContent.body}
      </Modal>
    </>
  );
}

