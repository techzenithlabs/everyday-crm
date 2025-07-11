// src/pages/projects/Projects.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProjects } from "@/redux/slices/projectSlice";
import type { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "@/components/projects/CreateProjectModal"; // ✅ You already created this

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading } = useSelector(
    (state: RootState) => state.projects
  );

  useEffect(() => {
    dispatch(fetchAllProjects() as any);
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Projects</h2>
        <CreateProjectModal />
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects found. Create one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                localStorage.setItem("currentProjectId", project.id.toString());
                navigate(`/projects/${project.id}`);
              }}
              className="cursor-pointer border p-4 rounded shadow hover:bg-gray-100"
            >
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-600">
                {project.description || "No description"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
