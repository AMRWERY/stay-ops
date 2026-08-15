<template>
  <!-- Backdrop, small screens only -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-40 bg-black/50 lg:hidden"
    aria-hidden="true"
    @click="close"
  />

  <aside
    id="app-sidebar"
    :class="[
      'w-64 bg-[#09101d] text-slate-400 flex flex-col shrink-0',
      // Below lg the sidebar is an off-canvas drawer; from lg up these
      // max-lg: utilities drop out and it is a normal flex column again.
      'max-lg:fixed max-lg:inset-y-0 max-lg:start-0 max-lg:z-50 max-lg:transition-transform max-lg:duration-300',
      isOpen
        ? 'max-lg:translate-x-0'
        : 'max-lg:-translate-x-full max-lg:rtl:translate-x-full',
    ]"
  >
    <div class="p-6 mb-4 flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 bg-[#c5a35e] rounded-sm"></div>
        <h1 class="text-white text-xl font-serif font-bold">StayOps</h1>
      </div>
      
      <LazyVButton
        variant="plain"
        icon="lucide:x"
        icon-class="w-5 h-5"
        class="lg:hidden text-slate-500 hover:text-white"
        aria-label="Close navigation"
        @click="close"
      />
    </div>

    <nav class="flex-1">
      <nuxt-link-locale
        v-for="item in navItems"
        :key="item.name"
        :to="item.route"
        :class="[
          'flex items-center gap-3 px-6 py-3 text-sm transition-colors',
          isActive(item.route)
            ? 'bg-[#151d2c] text-[#c5a35e] border-s-4 border-[#c5a35e]'
            : 'hover:text-white',
        ]"
      >
        <Icon :name="item.icon" class="w-5 h-5" />
        {{ item.name }}
      </nuxt-link-locale>
    </nav>

    <!-- Sign out -->
    <div class="p-4 border-t border-white/5">
      <LazyVButton
        variant="plain"
        block
        icon="material-symbols:logout"
        icon-class="w-5 h-5"
        label="Sign out"
        loading-text="Signing out…"
        :loading="isSigningOut"
        class="gap-3 px-2 py-2.5 text-sm rounded-md hover:bg-[#151d2c] hover:text-white"
        @click="signOut"
      />
    </div>
  </aside>
</template>

<script lang="ts" setup>
// Icon names are Iconify identifiers from https://icones.js.org (lucide set).
const navItems = [
  { name: "Dashboard", icon: "lucide:layout-dashboard", route: "/" },
  {
    name: "Room Service",
    icon: "lucide:utensils-crossed",
    route: "/room-service",
  },
  { name: "Inventory", icon: "lucide:package", route: "/inventory" },
  { name: "Rooms", icon: "lucide:door-open", route: "/rooms" },
  { name: "Staff", icon: "lucide:users", route: "/staff" },
  { name: "Suppliers", icon: "lucide:truck", route: "/suppliers" },
  {
    name: "Purchase Orders",
    icon: "lucide:file-text",
    route: "/purchase-orders",
  },
  { name: "Reports", icon: "lucide:trending-down", route: "/reports" },
  { name: "Settings", icon: "lucide:settings", route: "/settings" },
];

const supabase = useSupabaseClient();
const localePath = useLocalePath();
const route = useRoute();

const { isOpen, close } = useSidebar();

// The drawer overlays the page on small screens, so dismiss it once the user
// has navigated or pressed Escape.
watch(() => route.fullPath, close);
onKeyStroke("Escape", close);

/**
 * Highlights the section the current route belongs to. Compared against the
 * localised path, since route.path carries the locale prefix ("/en/inventory").
 * Child routes keep their section active, so /inventory/42 still lights up
 * Inventory — but "/" has to match exactly or it would match everything.
 */
const isActive = (target: string) => {
  const path = localePath(target);
  if (target === "/") return route.path === path;
  return route.path === path || route.path.startsWith(`${path}/`);
};

const isSigningOut = ref(false);

const signOut = async () => {
  if (isSigningOut.value) return;
  isSigningOut.value = true;
  try {
    await supabase.auth.signOut();
    // localePath keeps the locale prefix, which the i18n "prefix" strategy
    // requires — a bare "/auth" matches no route.
    await navigateTo(localePath("/auth"));
  } finally {
    isSigningOut.value = false;
  }
};
</script>
