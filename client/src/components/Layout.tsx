import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topnav">
        <div className="topnav-inner">
          <NavLink to="/" className="brand" end>
            <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="7" fill="var(--ink)" />
              <circle cx="9" cy="22" r="3.4" fill="var(--paper)" />
              <circle cx="23" cy="10" r="3.4" fill="var(--track-frontend)" />
              <path d="M9 22 L23 10" stroke="var(--paper)" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <span>SkillPath</span>
          </NavLink>
          <nav className="topnav-links" aria-label="Primary">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              People
            </NavLink>
            <NavLink to="/careers" className={({ isActive }) => (isActive ? "active" : "")}>
              Careers
            </NavLink>
            <NavLink to="/skills" className={({ isActive }) => (isActive ? "active" : "")}>
              Skill map
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>SkillPath · graph-backed career navigation, running on CognoDB</span>
      </footer>
    </div>
  );
}
