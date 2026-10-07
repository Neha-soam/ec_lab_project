import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { NAV_ITEMS } from '../data/navigation';
import { useTheme } from '../hooks/useTheme';
import { ThemeToggle } from './ThemeToggle';

export function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="shell">
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          // Don't change the URL hash: HashRouter would treat "#main" as a route.
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Skip to content
      </a>

      <header className="topbar">
        <button
          type="button"
          className="btn btn-ghost menu-button"
          aria-expanded={menuOpen}
          aria-controls="sidebar"
          onClick={() => setMenuOpen((o) => !o)}
        >
          Menu
        </button>
        <span className="brand">Ohm<span className="brand-accent">Lab</span></span>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      <nav id="sidebar" className={`sidebar${menuOpen ? ' open' : ''}`} aria-label="Main">
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                onClick={closeMenu}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
                {!item.available && <span className="nav-soon">soon</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main id="main" tabIndex={-1} className="content">
        <Outlet />
      </main>
    </div>
  );
}
