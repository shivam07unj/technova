export default function Header() {
  return (
    <header className="w-full border-b border-border/50 bg-surface/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary tracking-tight">
                TechNova <span className="text-gradient">AI Cross-Sell</span>
              </h1>
              <p className="text-[10px] text-text-muted -mt-0.5 tracking-wider uppercase">Intelligent Banking Agent</p>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {['Dashboard', 'Analytics', 'Campaigns'].map((item, i) => (
              <button
                key={item}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  i === 0
                    ? 'bg-primary/15 text-primary-light'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-lighter/50'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-surface-lighter/50 transition-colors cursor-pointer">
              <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
              RS
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
