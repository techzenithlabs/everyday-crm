import React from "react";
import type { Module } from "../../types";

interface Props {
  modules: Module[];
  selectedModules: number[];
  onChange: (ids: number[]) => void;
}

const PermissionSelector = ({ modules, selectedModules, onChange }: Props) => {
  const groupedModules = modules.reduce((acc, module) => {
    const parentId = module.parent_id || 0;
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(module);
    return acc;
  }, {} as Record<number, Module[]>);

  const toggleModule = (module: Module) => {
    const isSelected = selectedModules.includes(module.id);
    let updated = [...selectedModules];

    if (isSelected) {
      // If unchecking parent → remove parent + children
      updated = updated.filter((id) => id !== module.id);

      if (!module.parent_id) {
        const children = groupedModules[module.id] || [];
        const childIds = children.map((child) => child.id);
        updated = updated.filter((id) => !childIds.includes(id));
      }
    } else {
      updated.push(module.id);

      // If parent selected → select all its children too
      if (!module.parent_id) {
        const children = groupedModules[module.id] || [];
        const childIds = children.map((child) => child.id);
        updated = [...updated, ...childIds];
      }

      // If child selected → make sure parent is also selected
      if (module.parent_id && !updated.includes(module.parent_id)) {
        updated.push(module.parent_id);
      }
    }

    onChange([...new Set(updated)]);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Module Access</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(groupedModules[0] || []).map((parent) => (
          <div
            key={parent.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            {/* Parent */}
            <label className="flex items-center space-x-2 font-semibold text-gray-900 mb-2">
              <input
                type="checkbox"
                checked={selectedModules.includes(parent.id)}
                onChange={() => toggleModule(parent)}
                className="form-checkbox text-blue-600"
              />
              <span>{parent.name}</span>
            </label>

            {/* Children */}
            {(groupedModules[parent.id] || []).length > 0 && (
              <div className="space-y-2 pl-6">
                {groupedModules[parent.id].map((child) => (
                  <label
                    key={child.id}
                    className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 px-2 py-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(child.id)}
                      onChange={() => toggleModule(child)}
                      className="form-checkbox text-blue-600"
                    />
                    <span>{child.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionSelector;
