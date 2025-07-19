import { useState, useEffect } from "react";
import { createProject, updateProject } from "@/services/projectService";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { showSuccessToast , showErrorToast } from "@/utils/toastHelpers";
import type { ProjectModalProps } from "@/types/project";

const ProjectModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: ProjectModalProps) => {
  const currentWorkspace = useSelector(
    (state: RootState) => state.workspace.current
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData?.title) {
      setTitle(initialData.title);
      setDescription(initialData.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async () => {
    try {
      const isUpdate = !!initialData?.id;

      if (isUpdate) {
        // Ensure ID exists
        const projectId = initialData.id!;
        const payload = { title, description };
        await updateProject(projectId, payload);
         showSuccessToast("Project updated");
      } else {
        if (!currentWorkspace?.id) {
         showErrorToast("Workspace not selected.");
          return;
        }
        const payload = {
          title,
          description,
          workspace_id: currentWorkspace.id.toString(),
        };
        await createProject(payload);
        showSuccessToast("Project created");
      }

      onSuccess();
      onClose();
    } catch (err) {
      showErrorToast(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          {initialData?.id ? "Edit Project" : "New Project"}
        </h2>
        <input
          type="text"
          className="w-full border rounded p-2 mb-3"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border rounded p-2 mb-3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {initialData?.id ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
