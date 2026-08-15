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
                <p class="text-sm font-semibold text-orange-800">
                  Inventory Alert
                </p>
                <p class="text-sm text-orange-700">
                  4 inventory items are below threshold. Reorder recommended.
                </p>
              </div>
            </div>
            <VButton
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
                <p
                  class="text-[10px] font-bold tracking-widest text-slate-400 mb-1"
                >
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
            <VButton
              variant="secondary"
              size="sm"
              rounded="lg"
              icon="lucide:filter"
              label="Filter"
            />
          </div>

          <!-- Kanban Board -->
          <div class="grid grid-cols-4 gap-6 h-full min-h-[600px]">
            <div
              v-for="col in columns"
              :key="col.id"
              class="bg-[#efeee9] rounded-xl p-4 flex flex-col gap-4"
            >
              <!-- Column Header -->
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-slate-600">{{
                  col.title
                }}</span>
                <span
                  class="px-2 py-0.5 bg-slate-200 rounded text-[10px] font-bold text-slate-500"
                  >{{ col.count }}</span
                >
              </div>

              <!-- Cards -->
              <template
                v-for="order in orders.filter((o) => o.status === col.id)"
                :key="order.id"
              >
                <div
                  :class="[
                    'bg-white p-4 rounded-lg shadow-sm border-s-4 transition-all hover:shadow-md',
                    order.isUrgent ? 'border-orange-500' : 'border-transparent',
                  ]"
                >
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-serif font-bold text-sm"
                      >Room {{ order.room }}</span
                    >
                    <span class="text-[10px] text-slate-400 font-medium">{{
                      order.time
                    }}</span>
                  </div>
                  <p class="text-xs text-slate-500 leading-relaxed mb-4">
                    {{ order.items }}
                  </p>

                  <div
                    class="flex items-center gap-2 pt-3 border-t border-slate-50"
                  >
                    <div
                      class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden"
                    >
                      <Icon
                        v-if="!order.assignee"
                        name="lucide:users"
                        class="w-3 h-3 text-slate-400"
                      />
                      <img
                        v-else
                        src="https://i.pravatar.cc/100?u=staff"
                        alt="Staff"
                      />
                    </div>
                    <span
                      :class="[
                        'text-[11px]',
                        order.assignee
                          ? 'text-slate-700'
                          : 'text-slate-400 italic',
                      ]"
                    >
                      {{ order.assignee || "Unassigned" }}
                    </span>
                  </div>
                </div>
              </template>
            </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const orders = ref([
  {
    id: 1,
    room: "402",
    time: "12m ago",
    items: "2x Club Sandwich, 1x Coke",
    assignee: "Maria G.",
    status: "pending",
  },
  {
    id: 2,
    room: "215",
    time: "28m ago",
    items: "1x Caesar Salad, 2x Sparkling Water",
    assignee: null,
    status: "pending",
    isUrgent: true,
  },
  {
    id: 3,
    room: "510",
    time: "4m ago",
    items: "1x Steak Frites, 1x Red Wine Glass",
    assignee: "Chef Thomas",
    status: "preparing",
  },
  {
    id: 4,
    room: "102",
    time: "2m ago",
    items: "3x Continental Breakfast, 3x Coffee",
    assignee: "Alex D.",
    status: "on-the-way",
  },
  {
    id: 5,
    room: "305",
    time: "45m ago",
    items: "1x Omelette",
    assignee: null,
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

const columns = [
  { id: "pending", title: "Pending", count: 3 },
  { id: "preparing", title: "Preparing", count: 2 },
  { id: "on-the-way", title: "On the way", count: 1 },
  { id: "delivered", title: "Delivered", count: 12 },
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