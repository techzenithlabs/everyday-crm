import { useNavigate } from "react-router-dom";
import type { Project } from "@/types/project";

const ProjectCard = ({ project }: { project: Project }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white p-4 rounded shadow cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)} // ✅ navigate to detail
    >
      <h3 className="text-lg font-semibold">{project.title}</h3>
      <p className="text-gray-600">{project.description}</p>
    </div>
  );
};

export default ProjectCard;
