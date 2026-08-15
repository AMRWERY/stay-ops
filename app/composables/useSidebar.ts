/**
 * Off-canvas sidebar state.
 *
 * The sidebar is pinned open from the `lg` breakpoint up, so this only drives
 * the small-screen drawer opened from the header's menu button.
 */
export const useSidebar = () => {
  const isOpen = useState("sidebar-open", () => false);

  const open = () => (isOpen.value = true);
  const close = () => (isOpen.value = false);
  const toggle = () => (isOpen.value = !isOpen.value);

  return { isOpen, open, close, toggle };
};
