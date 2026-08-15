<template>
  <LazyVTable
    :columns="columns"
    :rows="orders"
    :row-to="(order) => `/room-service/${order.id}`"
    :loading="loading"
    item-label="orders"
    caption="Room service orders. Select a row to open the order."
    empty-icon="lucide:utensils-crossed"
    empty-label="No orders here"
    empty-hint="New guest requests will show up on this board."
  >
    <template #cell:room="{ row }">
      <span class="flex items-center gap-2">
        <span class="font-display text-base font-semibold text-ink"
          >Room {{ row.room }}</span
        >
        <Icon
          v-if="row.isUrgent"
          name="lucide:triangle-alert"
          class="h-4 w-4 shrink-0 text-status-urgent"
          aria-label="Urgent"
        />
      </span>
    </template>

    <template #cell:items="{ row }">
      <!-- Full list in the title attribute; the cell keeps to one line so rows
           stay scannable at a glance. -->
      <span class="line-clamp-1 text-slate" :title="itemsSummary(row.items)">
        {{ itemsSummary(row.items) }}
      </span>
    </template>

    <template #cell:assignee="{ row }">
      <span v-if="row.assignee" class="flex items-center gap-2">
        <img
          v-if="row.assignee.avatar"
          :src="row.assignee.avatar"
          alt=""
          class="h-6 w-6 shrink-0 rounded-full object-cover"
        />
        <span
          v-else
          class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[9px] font-bold text-white"
          aria-hidden="true"
        >
          {{ initialsOf(row.assignee) }}
        </span>
        <span class="text-ink">{{ row.assignee.name }}</span>
      </span>
      <span v-else class="text-slate-light italic">Unassigned</span>
    </template>

    <template #cell:status="{ row }">
      <OrderStatusBadge :status="row.status" />
    </template>

    <template #cell:timeAgo="{ row }">
      <span class="font-mono text-xs text-slate-light whitespace-nowrap">{{
        row.timeAgo
      }}</span>
    </template>
  </LazyVTable>
</template>

<script lang="ts" setup>
import type { Order, OrderAssignee, OrderItem } from "@/types/room-service";
import type { TableColumn } from "@/types/shared/VTable";

withDefaults(
  defineProps<{
    orders: Order[];
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const columns: TableColumn<Order>[] = [
  { key: "room", label: "Room", width: "10rem" },
  { key: "items", label: "Items" },
  { key: "assignee", label: "Assignee", hideBelow: "md", width: "12rem" },
  { key: "status", label: "Status", width: "10rem" },
  { key: "timeAgo", label: "Placed", align: "end", hideBelow: "sm", width: "8rem" },
];

const itemsSummary = (items: OrderItem[]) =>
  items
    .map((item) => `${item.qty}x ${item.name}${item.note ? ` (${item.note})` : ""}`)
    .join(", ");

const initialsOf = (assignee: OrderAssignee) =>
  assignee.initials ??
  assignee.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
</script>
