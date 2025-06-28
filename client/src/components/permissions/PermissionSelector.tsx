import React from "react";
import type { Module } from "../../types";

interface Props {
  modules: Module[];
  selectedModules: number[];
  onChange: (ids: number[]) => void;
}

const PermissionSelector = ({ modules, selectedModules, onChange }: Props) => {
  const toggleModule = (id: number) => {
    if (selectedModules.includes(id)) {
      onChange(selectedModules.filter((mid) => mid !== id));
    } else {
      onChange([...selectedModules, id]);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Module Access</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.isArray(modules) &&
          modules.map((module) => (
            <label
              key={module.id}
              className="flex items-center space-x-2 bg-gray-100 rounded p-3 cursor-pointer hover:bg-gray-200 transition"
            >
              <input
                type="checkbox"
                checked={selectedModules.includes(module.id)}
                onChange={() => toggleModule(module.id)}
                className="form-checkbox text-blue-600"
              />
              <span>{module.name}</span>
            </label>
          ))}
      </div>
    </div>
  );
};

export default PermissionSelector;
