<template>
  <div class="min-h-screen bg-[#f8f7f4] p-8 font-sans text-slate-700">
    <!-- Kanban Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      <!-- Columns -->
      <div v-for="col in columns" :key="col.id" class="flex flex-col gap-4">
        <!-- Column Header -->
        <div class="flex items-center justify-between px-2 mb-2">
          <h3
            class="text-[11px] font-bold tracking-[0.15em] text-slate-500 uppercase"
          >
            {{ col.title }}
          </h3>
          <span
            class="bg-[#e9e8e2] text-[#93928d] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full"
          >
            {{ getOrdersByStatus(col.id).length }}
          </span>
        </div>

        <!-- Cards Container -->
        <div class="space-y-4">
          <!-- Order Card -->
          <div
            v-for="order in getOrdersByStatus(col.id)"
            :key="order.id"
            class="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative"
          >
            <!-- Status Dot -->
            <div
              :class="[
                order.dotColor,
                'absolute top-5 right-5 w-2 h-2 rounded-full',
              ]"
            ></div>

            <!-- Room Number -->
            <h4 class="font-serif text-xl font-semibold text-[#1a202c] mb-3">
              Room {{ order.room }}
            </h4>

            <!-- Item List -->
            <ul class="space-y-1.5 mb-6">
              <li
                v-for="(item, idx) in order.items"
                :key="idx"
                class="text-[13px] text-slate-500 flex gap-1.5"
              >
                <span class="font-medium text-slate-600 whitespace-nowrap"
                  >{{ item.qty }}x</span
                >
                <span>
                  {{ item.name }}
                  <span v-if="item.note" class="text-slate-400"
                    >({{ item.note }})</span
                  >
                </span>
              </li>
            </ul>

            <!-- Footer -->
            <div
              class="flex items-center justify-between pt-4 border-t border-slate-50"
            >
              <div class="flex items-center gap-2 text-[#94a3b8]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span class="text-[11px] font-medium">{{ order.timeAgo }}</span>
              </div>

              <!-- Assignee -->
              <div class="flex items-center gap-2">
                <div v-if="order.assignee" class="flex items-center gap-1.5">
                  <div
                    class="w-5 h-5 rounded-full bg-[#09101d] flex items-center justify-center overflow-hidden"
                  >
                    <span class="text-[8px] text-white font-bold">MC</span>
                  </div>
                  <span class="text-[11px] font-bold text-slate-700">{{
                    order.assignee.name
                  }}</span>
                </div>
                <span v-else class="text-[11px] font-medium text-[#94a3b8]"
                  >Unassigned</span
                >
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="getOrdersByStatus(col.id).length === 0"
            class="bg-white/40 border-2 border-dashed border-slate-200 rounded-xl py-12 flex flex-col items-center justify-center"
          >
            <div class="bg-slate-100 p-3 rounded-full mb-3 text-slate-400">
              <!-- Cloche Icon -->
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M2 18h20" />
                <path d="M5 18a7 7 0 0 1 14 0" />
                <path d="M12 11V7" />
                <path d="M12 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
              </svg>
            </div>
            <p class="text-sm font-medium text-slate-400">No orders here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { OrderItem, Order } from "@/types/room-service"

const columns = [
  { id: "pending", title: "PENDING", dotColor: "bg-red-500" },
  { id: "preparing", title: "PREPARING", dotColor: "bg-orange-400" },
  { id: "on-the-way", title: "ON THE WAY", dotColor: "bg-gray-300" },
];

const orders = ref<Order[]>([
  {
    id: "1",
    room: "402",
    status: "pending",
    dotColor: "bg-[#cc5c44]",
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
    dotColor: "bg-[#94a3b8]",
    items: [{ name: "Continental Breakfast", qty: 1 }],
    timeAgo: "2m ago",
  },
  {
    id: "3",
    room: "510",
    status: "preparing",
    dotColor: "bg-[#e68a4d]",
    items: [
      { name: "Steak Frites", note: "Med Rare", qty: 1 },
      { name: "Caesar Salad", qty: 1 },
      { name: "Pinot Noir", note: "Glass", qty: 1 },
    ],
    timeAgo: "8m ago",
    assignee: { name: "M. Chef" },
  },
]);

const getOrdersByStatus = (status: string) =>
  orders.value.filter((o) => o.status === status);

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