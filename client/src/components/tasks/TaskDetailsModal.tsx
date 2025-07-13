import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import type { Task } from "@/types/task";
import { format } from "date-fns";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskDetailsModal: React.FC<Props> = ({ isOpen, onClose, task }) => {
  if (!task) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" leave="ease-in duration-200"
          enterFrom="opacity-0" enterTo="opacity-100"
          leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" leave="ease-in duration-200"
              enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <Dialog.Title className="text-xl font-semibold text-gray-800">
                    Task Details
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Title</label>
                    <p className="text-base text-gray-800">{task.title}</p>
                  </div>

                  {task.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{task.description}</p>
                    </div>
                  )}

                  {task.due_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Due Date</label>
                      <p className="text-sm text-gray-800">
                        {format(new Date(task.due_date), "dd MMM yyyy, hh:mm a")}
                      </p>
                    </div>
                  )}

                  {task.priority && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Priority</label>
                      <p className="inline-block px-3 py-1 rounded-full text-white text-sm bg-blue-500">
                        {task.priority}
                      </p>
                    </div>
                  )}

                  {task.labels && task.labels.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Labels</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {task.labels.map((label: string, idx: number) => (
                          <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.assigned_user && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Assigned To</label>
                      <p className="text-sm text-gray-800">{task.assigned_user?.first_name}</p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaskDetailsModal;
