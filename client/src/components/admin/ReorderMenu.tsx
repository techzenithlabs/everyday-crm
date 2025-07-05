import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getSidebarMenus, updateMenuOrder } from "../../services/adminService";

const DraggableItem = ({ id, name, isOver }: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "10px",
    border: isDragging
      ? "2px dashed #4ade80"
      : isOver
      ? "2px solid #60a5fa"
      : "1px solid #ccc",
    borderRadius: "6px",
    background: isDragging ? "#f0fdf4" : "white",
    marginBottom: "8px",
    cursor: "move",
    boxShadow: isDragging ? "0px 4px 12px rgba(0,0,0,0.1)" : "none",
    fontWeight: 500,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {name}
    </div>
  );
};

const ReorderMenu = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [originalOrder, setOriginalOrder] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await getSidebarMenus();
        setMenus(data);
        setOriginalOrder(data);
      } catch {
        toast.error("Failed to load menus");
      }
    };
    fetchMenus();
  }, []);

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (active.id !== over?.id) {
      const oldIndex = menus.findIndex((item) => item.id === active.id);
      const newIndex = menus.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(menus, oldIndex, newIndex);

      setMenus(reordered);
      try {
        await updateMenuOrder(reordered.map((item) => item.id));
        toast.success(
          `Moved '${menus[oldIndex].name}' before '${menus[newIndex].name}'`
        );
      } catch {
        toast.error("Failed to update menu order");
      }
    }
  };

  const resetOrder = async () => {
    try {
      const ids = originalOrder.map((item) => item.id);
      setMenus(originalOrder);
      await updateMenuOrder(ids);
      toast.success("Reset to default order");
    } catch {
      toast.error("Reset failed");
    }
  };

  const activeItem = menus.find((item) => item.id === activeId);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Drag & Drop Menu Ordering</h2>
        <button
          onClick={resetOrder}
          className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
        >
          Reset
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={menus.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          {menus.map((menu) => (
            <DraggableItem
              key={menu.id}
              id={menu.id}
              name={menu.name}
              isOver={activeId !== null && activeId !== menu.id}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <div className="p-2 px-4 bg-white border-2 border-dashed border-green-400 rounded shadow-md">
              {activeItem.name}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default ReorderMenu;
