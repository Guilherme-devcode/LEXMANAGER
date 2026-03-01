import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useState } from 'react';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ background: 'var(--bg-base)' }}
        >
          {/* Subtle top gradient */}
          <div
            className="pointer-events-none fixed top-16 left-60 right-0 h-32 z-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(201,168,76,0.02) 0%, transparent 100%)',
            }}
          />
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
