import type { ReactNode } from 'react';

export default function AppShell({ children }: { children: ReactNode }) {
  return (

        

   
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-2 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search boards..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="text-gray-700">👤 Admin</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-2 bg-gray-50">
          {children}
        </main>
      </div>
   
  );
}
