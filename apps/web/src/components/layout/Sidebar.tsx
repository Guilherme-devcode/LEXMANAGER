import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Scale, Users, Calendar,
  DollarSign, FileText, UserCog, X, LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@lexmanager/shared';
import clsx from 'clsx';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/processos',  icon: Scale,           label: 'Processos' },
  { to: '/clientes',   icon: Users,           label: 'Clientes' },
  { to: '/prazos',     icon: Calendar,        label: 'Prazos' },
  { to: '/financeiro', icon: DollarSign,      label: 'Financeiro', roles: [UserRole.SOCIO, UserRole.FINANCEIRO] },
  { to: '/documentos', icon: FileText,        label: 'Documentos' },
  { to: '/usuarios',   icon: UserCog,         label: 'Usuários',   roles: [UserRole.SOCIO] },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role as UserRole),
  );

  const initials = user?.nome
    ? user.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleLogout = async () => {
    onClose();
    try { await logout(); } catch {}
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0',
          /* Desktop: narrow icon rail */
          'lg:w-[68px]',
          /* Mobile: full slide-in drawer */
          open ? 'translate-x-0 w-60' : '-translate-x-full w-60',
        )}
        style={{
          background: 'var(--bg-sidebar)',
          borderRight: '1.5px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center justify-between px-3 lg:justify-center"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          {/* Mobile: logo + name */}
          <div className="flex lg:hidden items-center gap-2.5">
            <LogoMark />
            <span className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              LexManager Pro
            </span>
          </div>
          {/* Desktop: logo mark only */}
          <div className="hidden lg:flex">
            <LogoMark />
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {/* Desktop: icons only */}
          <ul className="hidden lg:flex flex-col items-center gap-1">
            {visibleItems.map((item) => (
              <li key={item.to} className="flex justify-center w-full">
                <NavLink
                  to={item.to}
                  className={({ isActive }) => clsx('nav-link', isActive && 'active')}
                >
                  <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                  <span className="nav-tip">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile: icons + labels */}
          <ul className="lg:hidden flex flex-col gap-0.5">
            {visibleItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      !isActive && 'hover:bg-[var(--bg-hover)]',
                    )
                  }
                  style={({ isActive }) => ({
                    background: isActive ? 'var(--accent-light)' : undefined,
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: isActive ? '600' : undefined,
                  })}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom: avatar + logout */}
        <div
          className="flex flex-col items-center gap-2 p-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {/* Desktop: stacked icons */}
          <div className="hidden lg:flex flex-col items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                border: '1.5px solid var(--accent)',
              }}
              title={user?.nome}
            >
              {initials}
            </div>
            <button onClick={handleLogout} className="nav-link" title="Sair">
              <LogOut className="h-[18px] w-[18px]" />
              <span className="nav-tip">Sair</span>
            </button>
          </div>

          {/* Mobile: user row + logout button */}
          <div className="lg:hidden w-full space-y-1">
            <div
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
              style={{ background: 'var(--bg-hover)' }}
            >
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
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {user?.nome}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ color: 'var(--danger)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--danger-bg)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function LogoMark() {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: 'var(--accent)' }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 10h10M10 5v10" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 7.5l8 5M14 7.5l-8 5" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
}
