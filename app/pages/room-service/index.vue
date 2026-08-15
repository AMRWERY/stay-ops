<template>
  <div>
    <!-- Status filters. The board used to carry these as columns, so they stay
         as chips with the same counts — otherwise the table loses the
         at-a-glance split between stages. -->
    <div class="flex flex-wrap items-center gap-2 mb-6">
      <LazyVButton
        v-for="filter in filters"
        :key="filter.id"
        :variant="activeFilter === filter.id ? 'primary' : 'secondary'"
        size="sm"
        rounded="full"
        :aria-pressed="activeFilter === filter.id"
        @click="activeFilter = filter.id"
      >
        {{ filter.title }}
        <span
          :class="[
            'ms-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
            activeFilter === filter.id
              ? 'bg-white/20 text-white'
              : 'bg-linen-dark text-slate',
          ]"
        >
          {{ countFor(filter.id) }}
        </span>
      </LazyVButton>
    </div>

    <LazyOrdersTable :orders="visibleOrders" />
  </div>
</template>

<script lang="ts" setup>
import type { Order, OrderStatus } from "@/types/room-service";

type FilterId = OrderStatus | "all";

const filters: { id: FilterId; title: string }[] = [
  { id: "all", title: "All" },
  { id: "pending", title: "Pending" },
  { id: "preparing", title: "Preparing" },
  { id: "on-the-way", title: "On the way" },
  { id: "delivered", title: "Delivered" },
];

const orders = ref<Order[]>([
  {
    id: "1",
    room: "402",
    status: "pending",
    items: [
      { name: "Club Sandwich", note: "No mayo", qty: 1 },
      { name: "Sparkling Water", qty: 2 },
    ],
    timeAgo: "12m ago",
  },
  {
    id: "2",
    room: "214",
    status: "pending",
    items: [{ name: "Continental Breakfast", qty: 1 }],
    timeAgo: "2m ago",
  },
  {
    id: "3",
    room: "510",
    status: "preparing",
    items: [
      { name: "Steak Frites", note: "Med Rare", qty: 1 },
      { name: "Caesar Salad", qty: 1 },
      { name: "Pinot Noir", note: "Glass", qty: 1 },
    ],
    timeAgo: "8m ago",
    assignee: { name: "M. Chef", initials: "MC" },
  },
]);

const activeFilter = ref<FilterId>("all");

const countFor = (id: FilterId) =>
  id === "all"
    ? orders.value.length
    : orders.value.filter((order) => order.status === id).length;

const visibleOrders = computed(() =>
  activeFilter.value === "all"
    ? orders.value
    : orders.value.filter((order) => order.status === activeFilter.value),
);

const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.room_service"),
  description: () => t("meta.room_service_description"),
  private: true,
});
</script>
