import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Scale,
  Users,
  Calendar,
  DollarSign,
  FileText,
  UserCog,
  X,
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
  {
    to: '/financeiro',
    icon: DollarSign,
    label: 'Financeiro',
    roles: [UserRole.SOCIO, UserRole.FINANCEIRO],
  },
  { to: '/documentos', icon: FileText, label: 'Documentos' },
  {
    to: '/usuarios',
    icon: UserCog,
    label: 'Usuários',
    roles: [UserRole.SOCIO],
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role as UserRole),
  );

  const initials = user?.nome
    ? user.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-60 flex-col transition-transform duration-300 lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-soft)',
        }}
      >
        {/* Right edge gradient line */}
        <div
          className="absolute inset-y-0 right-0 w-px pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.25) 30%, rgba(201,168,76,0.15) 70%, transparent 100%)',
          }}
        />

        {/* Logo */}
        <div
          className="flex h-16 items-center justify-between px-5"
          style={{ borderBottom: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center gap-2.5">
            <SidebarLogo />
            <span className="font-display text-base font-semibold text-gold-shimmer select-none">
              LexManager
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 transition-colors lg:hidden"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <p
            className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
          >
            Menu
          </p>
          <ul className="space-y-0.5">
            {visibleItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative',
                      isActive
                        ? 'nav-active'
                        : 'hover:bg-white/5',
                    )
                  }
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--gold-400)' : 'var(--text-secondary)',
                  })}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info */}
        <div
          className="p-4"
          style={{ borderTop: '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            {/* Avatar */}
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.1))',
                border: '1px solid rgba(201,168,76,0.4)',
                color: 'var(--gold-400)',
                boxShadow: '0 0 10px rgba(201,168,76,0.15)',
              }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {user?.nome}
              </p>
              <p className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="13" stroke="url(#sg)" strokeWidth="1.5" />
      <path d="M10 16h12M16 10v12" stroke="url(#sg)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 13l10 6M21 13l-10 6" stroke="url(#sg)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <defs>
        <linearGradient id="sg" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e8c64a" />
          <stop offset="1" stopColor="#a8893c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
