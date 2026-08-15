<template>
  <aside class="w-64 bg-[#09101d] text-slate-400 flex flex-col shrink-0">
    <div class="p-6 mb-4">
      <h1 class="text-white text-xl font-serif font-bold">StayOps</h1>
      <p class="text-xs text-slate-500">Back-of-House</p>
    </div>

    <nav class="flex-1">
      <nuxt-link-locale
        v-for="item in navItems"
        :key="item.name"
        :to="item.route"
        :class="[
          'flex items-center gap-3 px-6 py-3 text-sm transition-colors',
          item.active
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
      <button
        type="button"
        :disabled="isSigningOut"
        class="w-full flex items-center gap-3 px-2 py-2.5 text-sm rounded-md transition-colors hover:bg-[#151d2c] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
        @click="signOut"
      >
        <Icon
          :name="isSigningOut ? 'lucide:loader-circle' : 'material-symbols:logout'"
          :class="['w-5 h-5', isSigningOut && 'animate-spin']"
        />
        {{ isSigningOut ? "Signing out…" : "Sign out" }}
      </button>
    </div>
  </aside>
</template>

<script lang="ts" setup>
// Icon names are Iconify identifiers from https://icones.js.org (lucide set).
const navItems = [
  { name: "Dashboard", icon: "lucide:layout-dashboard", active: true, route: "/" },
  { name: "Room Service", icon: "lucide:utensils-crossed", route: "/room-service" },
  { name: "Inventory", icon: "lucide:package", route: "/inventory" },
  { name: "Rooms", icon: "lucide:door-open", route: "/rooms" },
  { name: "Staff", icon: "lucide:users", route: "/staff" },
  { name: "Suppliers", icon: "lucide:truck", route: "/suppliers" },
  { name: "Purchase Orders", icon: "lucide:file-text", route: "/purchase-orders" },
  { name: "Reports", icon: "lucide:trending-down", route: "/reports" },
  { name: "Settings", icon: "lucide:settings", route: "/settings" },
];

const supabase = useSupabaseClient();
const localePath = useLocalePath();

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