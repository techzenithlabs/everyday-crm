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
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#d33",
    confirmButtonText,
  });

  return result.isConfirmed;
};

export const showSuccess = (
  title = "Success!",
  text = "",
  timer = 2000
) => {
  return Swal.fire({
    title,
    text,
    icon: "success",
    showConfirmButton: false,
    showCloseButton: true,
    timer: timer,
    timerProgressBar: true,
    toast: true,
    position: "top-end",
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};


export const showError = (
  title = "Error!",
  text = "",
  timer = 3000
) => {
  return Swal.fire({
    title,
    text,
    icon: "error",
    showConfirmButton: false,
    showCloseButton: true,
    timer: timer,
    timerProgressBar: true,
    toast: true,
    position: "top-end",
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
};


 export const showInfo = (
  title: string,
  text = "",
  timer = 2500
) => {
  return Swal.fire({
    title,
    text,
    icon: "info",
    showConfirmButton: false,
    showCloseButton: true,
    timer,
    timerProgressBar: true,
    toast: true,
    position: "top-end",
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
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
