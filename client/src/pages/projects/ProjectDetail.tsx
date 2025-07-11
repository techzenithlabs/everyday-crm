import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectById, getBoardsByProject } from "@/services/projectService";
import { toast } from "react-toastify";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<any>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [boardError, setBoardError] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Load Project
    getProjectById(Number(id))
      .then((data) => {
        setProject(data);
        if (data?.id) {
          localStorage.setItem("currentProjectId", String(data.id));
        }
      })
      .catch(() => toast.error("Failed to load project"))
      .finally(() => setLoadingProject(false));

    // Load Boards
    getBoardsByProject(Number(id))
      .then(setBoards)
      .catch(() => {
        setBoardError(true);
        toast.error("Failed to load boards");
      })
      .finally(() => setLoadingBoards(false));
  }, [id]);

  if (loadingProject) return <div className="p-6">Loading project...</div>;
  if (!project)
    return <div className="p-6 text-red-500">Project not found</div>;

  return (
    <div className="p-6">
      {/* ✅ Project Info */}
      <h1 className="text-2xl font-bold mb-1">{project.title}</h1>
      <p className="text-gray-600 mb-4">{project.description}</p>

      {/* ✅ Boards */}
      <div className="mt-6">
        {loadingBoards ? (
          <p className="text-gray-400">Loading boards...</p>
        ) : boardError ? (
          <p className="text-red-500">Failed to load boards</p>
        ) : boards.length === 0 ? (
          <p className="text-gray-400">No boards found for this project.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {boards.map((board) => (
              <div
                key={board.id}
                className="min-w-[250px] bg-white border rounded shadow p-4"
              >
                <h3 className="text-lg font-semibold mb-2">{board.title}</h3>
                {/* 🔜 Tasks will be rendered here */}
                <p className="text-sm text-gray-400">[Tasks coming next]</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
