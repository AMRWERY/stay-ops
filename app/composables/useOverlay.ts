/**
 * App-wide blocking overlay.
 *
 * State lives in useState so any component can raise it, while a single
 * <Overlay /> in app.vue does the rendering — it sits outside <NuxtLayout>, so
 * it survives the navigations it's usually covering (a locale switch, a sign
 * out) instead of unmounting halfway through.
 */
export const useOverlay = () => {
  const isVisible = useState("overlay-visible", () => false);
  const message = useState<string | null>("overlay-message", () => null);

  const show = (text?: string) => {
    message.value = text ?? null;
    isVisible.value = true;
  };

  const hide = () => {
    isVisible.value = false;
    message.value = null;
  };

  /**
   * Cover `task` with the overlay. `minDuration` keeps it up long enough to be
   * read — without it a fast task makes the overlay flash, which looks like a
   * glitch rather than progress. The overlay is always torn down, even if the
   * task throws, so a failure can't leave the app locked behind it.
   */
  const run = async <T>(
    task: () => T | Promise<T>,
    text?: string,
    minDuration = 500,
  ): Promise<T> => {
    show(text);
    const settled = new Promise((resolve) => setTimeout(resolve, minDuration));
    try {
      const [result] = await Promise.all([task(), settled]);
      return result as T;
    } finally {
      hide();
    }
  };

  return { isVisible, message, show, hide, run };
};
