import { useParams } from "react-router-dom";

const ProjectDetail = () => {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Project ID: {id}</h2>
      {/* Here, load Boards and Tasks dynamically */}
    </div>
  );
};

export default ProjectDetail;