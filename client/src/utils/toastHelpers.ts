import { toast } from "react-toastify";

// Type guard to check if msg has a message
function hasMessage(obj: unknown): obj is { message: string } {
  return typeof obj === "object" && obj !== null && "message" in obj && typeof (obj as any).message === "string";
}

// ✅ Success Toast
export const showSuccessToast = (message: string = "Success") => {
  toast.success(message);
};

// ✅ Error Toast — no any
export const showErrorToast = (msg: unknown) => {
  const message =
    typeof msg === "string"
      ? msg
      : hasMessage(msg)
      ? msg.message
      : "Something went wrong";

  toast.error(message);
};

// ✅ Info Toast
export const showInfoToast = (message: string = "Notice") => {
  toast.info(message);
};
