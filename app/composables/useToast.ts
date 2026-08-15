import type { ToastMessage } from "@/types/shared/VToast";

const toasts = ref<ToastMessage[]>([]);
let counter = 0;

/** Simple global toast queue consumed by <ToastContainer />. */
export const useToast = () => {
  const push = (message: string, type: ToastMessage["type"] = "info") => {
    const id = counter++;
    toasts.value.push({ id, type, message });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 4000);
  };

  return {
    toasts,
    success: (m: string) => push(m, "success"),
    error: (m: string) => push(m, "error"),
    info: (m: string) => push(m, "info"),
  };
};
