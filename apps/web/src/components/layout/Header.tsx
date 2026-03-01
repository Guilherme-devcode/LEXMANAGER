import { Menu, Bell, Sun, Moon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

const routeLabels: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/processos':  'Processos',
  '/clientes':   'Clientes',
  '/prazos':     'Prazos',
  '/financeiro': 'Financeiro',
  '/documentos': 'Documentos',
  '/usuarios':   'Usuários',
};

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    // Use setTimeout to avoid closing immediately on the same click that opened it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handler);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handler);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    try { await logout(); } catch {}
    navigate('/login');
  };

  const pageLabel = Object.entries(routeLabels).find(([path]) =>
    location.pathname.startsWith(path),
  )?.[1] ?? '';

  const initials = user?.nome
    ? user.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header
      className="h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0"
      style={{
        background: 'var(--bg-header)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        zIndex: 30,
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="icon-btn lg:hidden"
          aria-label="Menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        {pageLabel && (
          <h1 className="font-display font-bold text-base sm:text-lg" style={{ color: 'var(--text-primary)' }}>
            {pageLabel}
          </h1>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="icon-btn"
          aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
        >
          {theme === 'dark'
            ? <Sun className="h-4 w-4" />
            : <Moon className="h-4 w-4" />
          }
        </button>

        {/* Notifications */}
        <button className="icon-btn relative" aria-label="Notificações">
          <Bell className="h-4 w-4" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all duration-150"
            style={{ color: 'var(--text-primary)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                border: '1.5px solid var(--accent)',
              }}
            >
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {user?.nome?.split(' ')[0]}
            </span>
            <ChevronDown
              className="h-3.5 w-3.5 hidden sm:block transition-transform duration-200"
              style={{
                color: 'var(--text-muted)',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-2xl py-1.5 animate-scale-in"
              style={{
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-dropdown)',
                border: '1px solid var(--border)',
                zIndex: 9999,
              }}
            >
              {/* User info */}
              <div
                className="px-4 py-3 mb-1"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {user?.nome}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                  {user?.email}
                </p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors rounded-xl mx-auto"
                style={{ color: 'var(--danger)', width: 'calc(100% - 8px)', marginLeft: '4px' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--danger-bg)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <LogOut className="h-4 w-4" />
                Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
