import type { ReactNode } from 'react';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Removed Topbar */}
      <main className="flex-1 overflow-y-auto p-0 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
