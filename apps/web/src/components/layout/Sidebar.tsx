import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Scale,
  Users,
  Calendar,
  DollarSign,
  FileText,
  UserCog,
  X,
  Gavel,
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
  { to: '/processos', icon: Scale, label: 'Processos' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/prazos', icon: Calendar, label: 'Prazos' },
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

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-primary-900 transition-transform duration-300 lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-primary-800">
          <div className="flex items-center gap-2">
            <Gavel className="h-7 w-7 text-primary-300" />
            <span className="text-lg font-bold text-white">LexManager</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-primary-300 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {visibleItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-700 text-white'
                        : 'text-primary-300 hover:bg-primary-800 hover:text-white',
                    )
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info at bottom */}
        <div className="border-t border-primary-800 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-medium">
              {user?.nome?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.nome}</p>
              <p className="truncate text-xs text-primary-400">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
