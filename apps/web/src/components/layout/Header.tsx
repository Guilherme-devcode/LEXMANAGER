import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

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
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
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
      className="flex h-16 items-center justify-between px-4 lg:px-6 relative"
      style={{
        background: 'rgba(13, 13, 26, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-soft)',
      }}
    >
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 transition-colors lg:hidden"
          style={{ color: 'var(--text-muted)' }}
        >
          <Menu className="h-5 w-5" />
        </button>

        {pageLabel && (
          <div className="hidden sm:flex items-center gap-2">
            <span
              className="font-display text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {pageLabel}
            </span>
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button
          className="relative rounded-lg p-2 transition-all duration-200"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--gold-400)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Separator */}
        <div className="w-px h-5 mx-1" style={{ background: 'var(--border-soft)' }} />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition-all duration-200"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            {/* Avatar */}
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.08))',
                border: '1px solid rgba(201,168,76,0.35)',
                color: 'var(--gold-400)',
              }}
            >
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {user?.nome?.split(' ')[0]}
            </span>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />

              <div
                className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl py-1 animate-scale-in"
                style={{
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border-mid)',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  className="px-4 py-3"
                  style={{ borderBottom: '1px solid var(--border-soft)' }}
                >
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {user?.nome}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                    {user?.email}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                  style={{ color: '#f87171' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sair da conta
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
