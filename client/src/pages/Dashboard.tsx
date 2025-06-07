import Sidebar from "../components/SIdebar";
import DashboardCards from "../components/DashboardCards";
import KanbanBoard from "../components/KanbanBoard";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to your Everyday CRM Dashboard!</p>
        <DashboardCards />
        <KanbanBoard />
      </div>
    </div>
  );
};
export default Dashboard;