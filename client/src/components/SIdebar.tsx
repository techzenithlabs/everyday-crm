const Sidebar = () => {
  return (
    <div className="bg-slate-800 text-white h-screen w-64 flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">Everyday CRM</h2>
      <nav className="flex flex-col space-y-4">
        {["Dashboard", "Calendar", "Clients", "Leads", "Projects", "Invoices"].map((item) => (
          <a key={item} href="#" className="hover:bg-slate-700 rounded px-3 py-2">{item}</a>
        ))}
      </nav>
    </div>
  );
};
export default Sidebar;
