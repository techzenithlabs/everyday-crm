import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { createWorkspace } from "@/services/workspaceService";
import { fetchWorkspaces, setCurrentWorkspace } from "@/redux/slices/workspaceSlice";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateWorkspaceModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Workspace name is required");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create the workspace
      const newWorkspace = await createWorkspace({ name });
      toast.success("Workspace created");

      // Step 2: Set current workspace (auto-select)
      dispatch(setCurrentWorkspace(newWorkspace));
      console.log("✅ Auto-selected workspace:", newWorkspace);

      // Step 3: Refresh list in Redux
      await dispatch(fetchWorkspaces());

      setName("");
      onClose();
    } catch (error) {
      console.error("❌ Workspace creation failed:", error);
      toast.error("Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded shadow w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Create Workspace</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workspace Name"
          className="w-full border p-2 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-300 rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-1 bg-blue-600 text-white rounded text-sm"
          >
            {loading ? "Saving..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
