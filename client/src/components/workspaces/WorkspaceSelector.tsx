import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/api";
import { toast } from "react-toastify";
import type { RootState } from "@/redux/store";
import { setCurrentWorkspace } from "@/redux/slices/workspaceSlice";

// ✅ Workspace type
type Workspace = {
  id: number;
  name: string;
};

const WorkspaceSelector = () => {
  const dispatch = useDispatch();
  const current = useSelector((state: RootState) => state.workspace.current);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await api.get("/workspaces");

        if (res.data.status) {
          const all: Workspace[] = res.data.data; // ✅ typed properly
          setWorkspaces(all);

          if (!current && all.length > 0) {
            const savedId = localStorage.getItem("currentWorkspaceId");
            const fallback: Workspace =
              all.find((w) => w.id === Number(savedId)) || all[0];

            dispatch(setCurrentWorkspace(fallback));
            localStorage.setItem("currentWorkspaceId", fallback.id.toString());
          }
        } else {
          toast.warn("No workspaces found.");
        }
      } catch {
        toast.error("Failed to load workspaces.");
      }
    };

    fetchWorkspaces();
  }, [dispatch, current]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = workspaces.find(
      (w: Workspace) => w.id === Number(e.target.value)
    );
    if (selected) {
      dispatch(setCurrentWorkspace(selected));
      localStorage.setItem("currentWorkspaceId", selected.id.toString());
      toast.success(`Switched to workspace: ${selected.name}`);
    }
  };

  if (!workspaces.length) {
    return <p className="text-gray-400 italic">No workspaces available</p>;
  }

  return (
    <select
      value={current?.id ?? ""}
      onChange={handleChange}
      className="bg-[#1d2939] border border-white rounded px-2 py-1 text-white"
    >
      {workspaces.map((ws: Workspace) => (
        <option key={ws.id} value={ws.id}>
          {ws.name}
        </option>
      ))}
    </select>
  );
};

export default WorkspaceSelector;
