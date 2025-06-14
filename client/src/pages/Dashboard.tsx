
import DashboardCards from "../components/DashboardCards";
import KanbanBoard from "../components/KanbanBoard";


const Dashboard = () => { 
    

  return (
    <div className="flex">    

      <div className="flex-1 p-8 bg-gray-50 min-h-screen"> 
        <p className="text-gray-600 mb-6 ">
          Welcome to your Everyday CRM Dashboard!
        </p>
        <DashboardCards />
        <KanbanBoard />
      </div>
    </div>
  );
};
export default Dashboard;