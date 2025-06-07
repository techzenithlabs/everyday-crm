import type { ReactNode } from 'react';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 text-2xl font-bold text-indigo-600">Everyday CRM</div>
        <nav className="flex flex-col gap-2 px-6">
          <a href="#" className="hover:text-indigo-500 font-medium">📋 Boards</a>
          <a href="#" className="hover:text-indigo-500 font-medium">⚙️ Settings</a>
        </nav>
        <div className="mt-auto p-6 text-sm text-gray-500">© 2025 Everyday CRM</div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search boards..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <div className="text-gray-700">👤 Admin</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
