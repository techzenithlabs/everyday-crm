import { useState } from "react";
import { createProject } from "@/services/projectService";
import { useDispatch } from "react-redux";
import { fetchAllProjects } from "@/redux/slices/projectSlice";
import { toast } from "react-toastify";

const CreateProjectModal = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Project name is required");
    try {
      setLoading(true);
      await createProject({ name, description });
      toast.success("Project created successfully");
      dispatch(fetchAllProjects() as any);
      setName("");
      setDescription("");
      setShow(false);
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
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShow(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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

// ✅ THIS IS THE IMPORTANT LINE!
export default CreateProjectModal;
