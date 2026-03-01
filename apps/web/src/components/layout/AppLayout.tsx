import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-page)' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main
          className="flex-1 overflow-y-auto"
          style={{ background: 'var(--bg-page)', padding: '24px' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
