import { useState } from "react";
import { createProject } from "@/services/projectService";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }: Props) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const workspaceId = localStorage.getItem("currentWorkspaceId");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspaceId || !formData.title.trim()) {
      toast.error("Workspace ID or Project title missing");
      return;
    }

    setLoading(true);
    try {
      await createProject({
        workspace_id: workspaceId,
        title: formData.title,
        description: formData.description,
      });

      toast.success("Project created successfully");
      setFormData({ title: "", description: "" });
      onProjectCreated();
      onClose();
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err?.response?.data?.message || "Error creating project");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Project Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
