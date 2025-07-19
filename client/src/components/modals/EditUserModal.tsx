import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { updateUserById } from "@/services/auth";
import type { User, UserFields } from "@/types/user";
import { showSuccessToast, showErrorToast } from "@/utils/toastHelpers";

type EditUserModalProps = {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onSave: (updated: UserFields) => void;
};

const EditUserModal = ({
  isOpen,
  user,
  onClose,
  onSave,
}: EditUserModalProps) => {
  const [formData, setFormData] = useState<UserFields>({
    id: 0,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    status: 1,
  });

  useEffect(() => {
    if (user) {
      const flatUser: UserFields = {
        id: user.id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        status: user.status === 0 ? 0 : 1,
        phone: user.user_info?.phone || "",
        address: user.user_info?.address || "",
        city: user.user_info?.city || "",
        state: user.user_info?.state || "",
        postal_code: user.user_info?.postal_code || "",
      };
      setFormData(flatUser);
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === "status" ? parseInt(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSave = async () => {
    const cleaned: UserFields = {
      ...formData,
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      postal_code: formData.postal_code.trim(),
      address: formData.address.trim(),
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleaned.first_name) return showErrorToast("First name is required");
    if (!cleaned.last_name) return showErrorToast("Last name is required");
    if (!cleaned.email) return showErrorToast("Email is required");
    if (!emailRegex.test(cleaned.email))
      return showErrorToast("Invalid email format");
    if (!cleaned.phone) return showErrorToast("Phone is required");
    if (cleaned.phone.length < 7)
      return showErrorToast("Phone must be at least 7 digits");
    if (!cleaned.city) return showErrorToast("City is required");
    if (!cleaned.state) return showErrorToast("State is required");
    if (!cleaned.postal_code) return showErrorToast("Postal Code is required");
    if (!cleaned.address) return showErrorToast("Address is required");

    try {
      await updateUserById(cleaned.id, cleaned);
      showSuccessToast("User updated successfully");
      onSave(cleaned);
      onClose();
    } catch (error) {
      showErrorToast(error || "Failed to update user");
    }
  };

  const fields: {
    label: string;
    name: keyof UserFields;
    type?: string;
  }[] = [
    { label: "First Name", name: "first_name" },
    { label: "Last Name", name: "last_name" },
    { label: "Email", name: "email" },
    { label: "Phone", name: "phone" },
    { label: "City", name: "city" },
    { label: "State", name: "state" },
    { label: "Postal Code", name: "postal_code", type: "text" },
  ];

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
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl rounded-2xl bg-white px-6 py-6 text-left shadow-xl">
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <Dialog.Title className="text-xl font-semibold">
                    Edit Team Member
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map(({ label, name, type = "text" }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name] ?? ""}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  ))}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EditUserModal;
