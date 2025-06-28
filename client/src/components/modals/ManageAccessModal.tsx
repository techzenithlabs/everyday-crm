import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export type Permission = {
  id: number;
  name: string;
  children?: Permission[];
};

interface ManageAccessModalProps {
  isOpen: boolean;
  user: any;
  permissions: Permission[]; // [{ id, name, children: [...] }]
  userPermissions: number[]; // [1, 2, 3]
  onClose: () => void;
  onSave: (updatedPermissions: number[]) => void;
}

export default function ManageAccessModal({
  isOpen,
  user,
  permissions,
  userPermissions,
  onClose,
  onSave,
}: ManageAccessModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  useEffect(() => {
    setSelectedPermissions(userPermissions || []);
  }, [userPermissions]);

  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleParentAndChildren = (perm: Permission) => {
    const ids = [perm.id, ...(perm.children?.map((c) => c.id) || [])];
    const allSelected = ids.every((id) => selectedPermissions.includes(id));
    setSelectedPermissions((prev) =>
      allSelected
        ? prev.filter((id) => !ids.includes(id))
        : [...prev, ...ids.filter((id) => !prev.includes(id))]
    );
  };

  const isChecked = (id: number) => selectedPermissions.includes(id);

  const isIndeterminate = (perm: Permission) => {
    if (!perm.children || perm.children.length === 0) return false;
    const total = perm.children.length;
    const selected = perm.children.filter((child) =>
      selectedPermissions.includes(child.id)
    ).length;
    return selected > 0 && selected < total;
  };

  const getSelectedPermissionCount = (): number => {
    let count = 0;

    permissions.forEach((perm) => {
      if (perm.children && perm.children.length > 0) {
        const selectedChildren = perm.children.filter((child) =>
          selectedPermissions.includes(child.id)
        );
        count += selectedChildren.length;
      } else {
        if (selectedPermissions.includes(perm.id)) {
          count += 1;
        }
      }
    });

    return count;
  };

  const handleSubmit = () => {
    onSave(selectedPermissions);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    Manage Access for {user?.first_name} {user?.last_name}
                    <span className="text-sm text-gray-500 ml-2">
                      ({getSelectedPermissionCount()} selected)
                    </span>
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto pr-1">
                  {permissions.map((perm) => (
                    <div
                      key={perm.id}
                      className="border rounded-md p-4 shadow-sm"
                    >
                      {/* Parent Checkbox */}
                      <label className="flex items-center gap-2 font-semibold text-gray-900">
                        <input
                          type="checkbox"
                          checked={
                            isChecked(perm.id) &&
                            (perm.children || []).every((c) => isChecked(c.id))
                          }
                          ref={(el) => {
                            if (el) el.indeterminate = isIndeterminate(perm);
                          }}
                          onChange={() => toggleParentAndChildren(perm)}
                        />
                        {perm.name}
                      </label>

                      {/* Child Permissions */}
                      {perm.children && perm.children.length > 0 && (
                        <div className="mt-3 ml-5 flex flex-col gap-2 text-sm text-gray-700">
                          {perm.children.map((child) => (
                            <label
                              key={child.id}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked(child.id)}
                                onChange={() => togglePermission(child.id)}
                              />
                              {child.name}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save Access
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
