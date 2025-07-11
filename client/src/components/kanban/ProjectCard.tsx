import { FC } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  project: {
    id: number;
    name: string;
    description?: string;
  };
};

const ProjectCard: FC<Props> = ({ project }) => {
  const navigate = useNavigate();
  return (
    <div
      className="border p-4 rounded shadow hover:shadow-md cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <h3 className="text-lg font-semibold">{project.name}</h3>
      <p className="text-sm text-gray-500">{project.description}</p>
    </div>
  );
};

export default ProjectCard;
