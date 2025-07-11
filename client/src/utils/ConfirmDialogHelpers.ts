import Swal from "sweetalert2";

// 🔹 Basic Confirmation Box
export const showConfirm = async (
  title = "Are you sure?",
  text = "This action cannot be undone.",
  confirmButtonText = "Yes, proceed"
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#d33",
    confirmButtonText,
  });

  return result.isConfirmed;
};

export const showSuccess = (title = "Success!", text = "") => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: "#16a34a",
  });
};

export const showError = (title = "Error!", text = "") => {
  return Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: "#ef4444",
  });
};

export const showInfo = (title: string, text = "") => {
  return Swal.fire({
    title,
    text,
    icon: "info",
    confirmButtonColor: "#3b82f6",
  });
};

export const showPrompt = async (
  title = "Enter a value",
  inputLabel = "Your input"
): Promise<string | null> => {
  const result = await Swal.fire({
    title,
    input: "text",
    inputLabel,
    showCancelButton: true,
    confirmButtonText: "Submit",
  });

  return result.isConfirmed ? result.value : null;
};