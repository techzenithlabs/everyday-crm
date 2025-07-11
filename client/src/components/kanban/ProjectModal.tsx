import { useState, useEffect } from "react";
import { createProject, updateProject }  from "@/services/projectService";
import { toast } from "react-toastify";

const ProjectModal = ({ isOpen, onClose, onSuccess, initialData }: any) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [initialData, isOpen]);

  const handleSubmit = async () => {
    try {
      const payload = { name, description };
      if (initialData?.id) {
        await updateProject(initialData.id, payload);
        toast.success("Project updated");
      } else {
        await createProject(payload);
        toast.success("Project created");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save project");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          {initialData ? "Edit Project" : "New Project"}
        </h2>
        <input
          type="text"
          className="w-full border rounded p-2 mb-3"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            {initialData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
