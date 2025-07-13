// EditUserModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

/* ─── Types ─────────────────────────────────────────────── */
export type UserFields = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  status: 'active' | 'inactive';
};

type EditUserModalProps = {
  isOpen: boolean;
  user: Partial<UserFields> | null;
  onClose: () => void;
  onSave: (updated: UserFields) => void;
};

/* ─── Component ─────────────────────────────────────────── */
export default function EditUserModal({
  isOpen,
  user,
  onClose,
  onSave,
}: EditUserModalProps) {
  /* Initial state */
  const [formData, setFormData] = useState<UserFields>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    status: 'active',
  });

  /* Populate when `user` changes */
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        ...user, // merges any provided fields
      }));
    }
  }, [user]);

  /* Generic change handler */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* Save handler with validation */
  const handleSave = () => {
    console.log('clicked');

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

    // basic validation
    if (!cleaned.first_name || !cleaned.last_name) {
      toast.error('First & last name are required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleaned.email)) {
      toast.error('Enter a valid email address');
      return;
    }
    if (cleaned.phone && cleaned.phone.length < 7) {
      toast.error('Phone number is too short');
      return;
    }

    // pass to parent; parent should close modal when save succeeds
    onSave(cleaned);
  };

  /* ─── Render ──────────────────────────────────────────── */
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
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
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-4 mb-6">
                  <Dialog.Title className="text-xl font-semibold">
                    Edit Team Member
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Inputs in two‑column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'First Name', name: 'first_name' },
                    { label: 'Last Name', name: 'last_name' },
                    { label: 'Email', name: 'email' },
                    { label: 'Phone', name: 'phone' },
                    { label: 'City', name: 'city' },
                    { label: 'State', name: 'state' },
                    { label: 'Postal Code', name: 'postal_code', type: 'number' },
                  ].map(({ label, name, type = 'text' }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={(formData as any)[name]}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  ))}

                  {/* Address (span 2) */}
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

                  {/* Status dropdown (span 2) */}
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
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Footer buttons */}
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
}
