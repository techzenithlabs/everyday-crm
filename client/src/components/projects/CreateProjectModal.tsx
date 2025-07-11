import { useEffect, useState } from "react";
import { createProject } from "@/services/projectService";
import { useDispatch } from "react-redux";
import { fetchAllProjects } from "@/redux/slices/projectSlice";
import { toast } from "react-toastify";

interface Props {
  open?: boolean;
  onClose?: () => void;
}

const CreateProjectModal = ({ open = false, onClose }: Props) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(open);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ✅ Modal close helper
  const closeModal = () => {
    setShow(false);
    onClose?.(); // trigger parent if any
    setName("");
    setDescription("");
  };

  // ✅ Form submit handler
  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Project name is required");

    try {
      setLoading(true);
      await createProject({ title:name, description });
      toast.success("✅ Project created successfully");
      dispatch(fetchAllProjects() as any); // Refresh project list
      closeModal();
    } catch (err) {
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        + Create Project
      </button>

      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">New Project</h3>

            <input
              type="text"
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                  loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateProjectModal;
