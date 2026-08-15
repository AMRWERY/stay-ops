<template>
  <div>
    <!-- Inventory Alert -->
    <div
      class="bg-[#fdf3f0] border border-[#f5d0c5] rounded-lg p-4 mb-8 flex items-start justify-between"
    >
      <div class="flex gap-4">
        <div class="mt-1 text-orange-700">
          <Icon name="lucide:triangle-alert" class="w-5 h-5" />
        </div>
        <div>
          <p class="text-sm font-semibold text-orange-800">Inventory Alert</p>
          <p class="text-sm text-orange-700">
            4 inventory items are below threshold. Reorder recommended.
          </p>
        </div>
      </div>
      <LazyVButton
        variant="plain"
        icon="lucide:x"
        icon-class="w-4 h-4"
        class="text-orange-400 hover:text-orange-600"
        aria-label="Dismiss alert"
      />
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-4 gap-6 mb-10">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between"
      >
        <div>
          <p class="text-[10px] font-bold tracking-widest text-slate-400 mb-1">
            {{ stat.label }}
          </p>
          <p class="text-4xl font-serif">{{ stat.val }}</p>
        </div>
        <div
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center',
            stat.bg,
          ]"
        >
          <Icon :name="stat.icon" :class="['w-6 h-6', stat.color]" />
        </div>
      </div>
    </div>

    <!-- Section Title -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-serif">Room Service Orders</h3>
      <LazyVButton
        variant="secondary"
        size="sm"
        rounded="lg"
        icon="lucide:filter"
        label="Filter"
      />
    </div>

    <!-- Rows open the order at /room-service/[id]. -->
    <LazyOrdersTable :orders="orders" />
  </div>
</template>

<script lang="ts" setup>
import type { Order } from "@/types/room-service";

const { t } = useI18n();

const orders = ref<Order[]>([
  {
    id: "1",
    room: "402",
    timeAgo: "12m ago",
    items: [
      { name: "Club Sandwich", qty: 2 },
      { name: "Coke", qty: 1 },
    ],
    assignee: { name: "Maria G." },
    status: "pending",
  },
  {
    id: "2",
    room: "215",
    timeAgo: "28m ago",
    items: [
      { name: "Caesar Salad", qty: 1 },
      { name: "Sparkling Water", qty: 2 },
    ],
    status: "pending",
    isUrgent: true,
  },
  {
    id: "3",
    room: "510",
    timeAgo: "4m ago",
    items: [
      { name: "Steak Frites", qty: 1 },
      { name: "Red Wine", note: "Glass", qty: 1 },
    ],
    assignee: { name: "Chef Thomas" },
    status: "preparing",
  },
  {
    id: "4",
    room: "102",
    timeAgo: "2m ago",
    items: [
      { name: "Continental Breakfast", qty: 3 },
      { name: "Coffee", qty: 3 },
    ],
    assignee: { name: "Alex D." },
    status: "on-the-way",
  },
  {
    id: "5",
    room: "305",
    timeAgo: "45m ago",
    items: [{ name: "Omelette", qty: 1 }],
    status: "delivered",
  },
]);

// Icon names are Iconify identifiers from https://icones.js.org (lucide set).
const stats = [
  {
    label: "ACTIVE ORDERS",
    val: 24,
    icon: "lucide:info",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "PENDING",
    val: 8,
    icon: "lucide:clock",
    color: "text-slate-400",
    bg: "bg-slate-100",
  },
  {
    label: "URGENT",
    val: 3,
    icon: "lucide:triangle-alert",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    label: "LOW STOCK",
    val: 4,
    icon: "lucide:trending-down",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.dashboard"),
  description: () => t("meta.dashboard_description"),
  private: true,
});
</script>