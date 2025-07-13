import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import type { Project } from "@/types/project";
import { getProjects } from "@/services/projectService";
import CreateProjectModal from "@/components/projects/CreateProjectModal";
import ProjectCard from "@/components/kanban/ProjectCard";
import WorkspaceSelector from "@/components/workspaces/WorkspaceSelector";
import CreateWorkspaceModal from "@/components/workspaces/CreateWorkspaceModal";
import { fetchWorkspaces, clearWorkspace,setCurrentWorkspace } from "@/redux/slices/workspaceSlice";
import { toast } from "react-toastify";

const Projects = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { all: allWorkspaces, current: currentWorkspace } = useSelector((state: RootState) => state.workspace);
  //const allWorkspaces = useSelector((state: RootState) => state.workspace.all);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!currentWorkspace?.id) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      const response = await getProjects({ workspace_id: String(currentWorkspace.id) });
      setProjects(response);
    } catch {
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, [currentWorkspace]);

  // ✅ Initial load: fetch workspaces and validate current workspace
 useEffect(() => {
  dispatch(fetchWorkspaces()).then((res) => {
    const list = res.payload || [];

    // ✅ Auto-select the first workspace if none selected
    if (!currentWorkspace && list.length > 0) {
      dispatch(setCurrentWorkspace(list[0]));
      console.log("✅ Auto-selected first workspace:", list[0]);
    }
  });
}, []);

  // ✅ Fetch projects when workspace changes
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Projects</h1>
          <WorkspaceSelector />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setWorkspaceModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm"
          >
            + New Workspace
          </button>

          {currentWorkspace?.id && (
            <button
              onClick={() => setProjectModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              + New Project
            </button>
          )}
        </div>
      </div>

      {!currentWorkspace?.id ? (
        <p className="text-gray-500 italic">No workspaces available</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No projects found for this workspace.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onProjectCreated={fetchProjects}
      />

      <CreateWorkspaceModal
        isOpen={workspaceModalOpen}
        onClose={() => setWorkspaceModalOpen(false)}
      />
    </div>
  );
};

export default Projects;
