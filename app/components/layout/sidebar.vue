<template>
  <aside class="w-64 bg-[#09101d] text-slate-400 flex flex-col shrink-0">
    <div class="p-6 mb-4">
      <h1 class="text-white text-xl font-serif font-bold">StayOps</h1>
      <p class="text-xs text-slate-500">Back-of-House</p>
    </div>

    <nav class="flex-1">
      <a
        v-for="item in navItems"
        :key="item.name"
        href="#"
        :class="[
          'flex items-center gap-3 px-6 py-3 text-sm transition-colors',
          item.active
            ? 'bg-[#151d2c] text-[#c5a35e] border-s-4 border-[#c5a35e]'
            : 'hover:text-white',
        ]"
      >
        <Icon :name="item.icon" class="w-5 h-5" />
        {{ item.name }}
      </a>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
// Icon names are Iconify identifiers from https://icones.js.org (lucide set).
const navItems = [
  { name: "Dashboard", icon: "lucide:layout-dashboard", active: true },
  { name: "Room Service", icon: "lucide:utensils-crossed" },
  { name: "Inventory", icon: "lucide:package" },
  { name: "Rooms", icon: "lucide:door-open" },
  { name: "Staff", icon: "lucide:users" },
  { name: "Suppliers", icon: "lucide:truck" },
  { name: "Purchase Orders", icon: "lucide:file-text" },
  { name: "Reports", icon: "lucide:trending-down" },
  { name: "Settings", icon: "lucide:settings" },
];
</script>