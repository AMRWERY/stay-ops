<template>
  <div>
    <!-- Top Navigation & Actions -->
    <div class="max-w-6xl mx-auto mb-8 flex justify-between items-end">
      <div>
        <LazyVBackButton
          to="/room-service"
          label="Back to Room Service"
          class="mb-4"
        />
        <h1 class="text-4xl font-serif font-bold">Order Details</h1>
      </div>

      <!-- Requested: Create Task Button -->
      <LazyVButton
        size="sm"
        rounded="lg"
        label="Create Task"
        class="text-xs font-bold shadow-md"
        @click="handleCreateTask"
      />
    </div>

    <LazyVDialog
      v-model="isTaskDialogOpen"
      title="Create task"
      description="Assign a follow-up for this order."
      confirm-label="Create task"
      cancel-label="Cancel"
      :loading="isCreatingTask"
      @confirm="submitTask"
    >
      <div class="space-y-4">
        <LazyVInput
          v-model="taskTitle"
          label="Task"
          placeholder="Deliver cutlery to 402"
          standalone
          autofocus
        />
        <LazyVInput
          v-model="taskNotes"
          type="textarea"
          label="Notes"
          placeholder="Anything the runner should know"
          standalone
          :rows="3"
        />
      </div>
    </LazyVDialog>

    <!-- Main Grid -->
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- LEFT: Order Card -->
      <div
        class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div class="p-8">
          <!-- Card Header -->
          <div class="flex justify-between items-start mb-8">
            <div>
              <h2 class="text-2xl font-serif font-bold mb-1">Room 402</h2>
              <p
                class="text-[11px] font-mono text-slate-400 uppercase tracking-tight"
              >
                Order #RS-9024 • Placed at 18:42
              </p>
            </div>
            <span
              class="flex items-center gap-1.5 px-3 py-1 bg-[#fff2ed] text-[#f97316] rounded-full text-[10px] font-bold tracking-widest border border-[#fde1d3]"
            >
              <span class="w-1.5 h-1.5 bg-[#f97316] rounded-full"></span>
              PREPARING
            </span>
          </div>

          <!-- Items Section -->
          <div class="mb-10">
            <h3
              class="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4"
            >
              Items
            </h3>
            <div class="space-y-6">
              <!-- Item 1 -->
              <div class="flex items-start justify-between">
                <div class="flex gap-4">
                  <div
                    class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500"
                  >
                    1x
                  </div>
                  <div>
                    <p class="font-bold text-sm">Club Sandwich</p>
                    <p
                      class="flex items-center text-[13px] text-slate-400 mt-0.5"
                    >
                      <Icon
                        name="lucide:triangle-alert"
                        class="me-1 w-3 h-3 shrink-0"
                      />
                      No mayo
                    </p>
                  </div>
                </div>
                <p class="font-mono text-sm font-bold text-slate-600">$24.00</p>
              </div>
              <!-- Item 2 -->
              <div class="flex items-start justify-between">
                <div class="flex gap-4">
                  <div
                    class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500"
                  >
                    2x
                  </div>
                  <div>
                    <p class="font-bold text-sm">Sparkling Water (Large)</p>
                  </div>
                </div>
                <p class="font-mono text-sm font-bold text-slate-600">$16.00</p>
              </div>
            </div>
          </div>

          <!-- Guest Notes -->
          <div class="bg-[#f8f7f4] rounded-xl p-5 border border-slate-100 mb-8">
            <div class="flex items-center gap-2 text-slate-500 mb-2">
              <Icon name="lucide:flag" class="w-3.5 h-3.5 shrink-0" />
              <span class="text-[11px] font-bold uppercase tracking-wider"
                >Guest Notes</span
              >
            </div>
            <p class="text-sm italic text-slate-600">
              "Please leave on the cart outside the door."
            </p>
          </div>

          <!-- Card Footer Actions -->
          <div class="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <LazyVButton
              variant="outline"
              size="sm"
              rounded="lg"
              label="Cancel order"
              class="text-xs font-bold"
            />
            <LazyVButton
              size="sm"
              rounded="lg"
              icon="lucide:utensils-crossed"
              label="Mark as on the way"
              class="text-xs font-bold shadow-md"
            />
          </div>
        </div>
      </div>

      <!-- RIGHT: Assign Section -->
      <div
        class="bg-white rounded-xl shadow-sm border border-slate-100 p-8 h-fit"
      >
        <h3 class="text-xl font-serif font-bold mb-6">Assign to</h3>
        <div class="space-y-3">
          <div
            v-for="staff in staffList"
            :key="staff.id"
            @click="selectedStaffId = staff.id"
            :class="[
              'flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer',
              selectedStaffId === staff.id
                ? 'border-[#c5a35e] bg-amber-50/30'
                : 'border-transparent hover:bg-slate-50',
            ]"
          >
            <div class="flex items-center gap-4">
              <!-- Avatar Logic -->
              <div class="relative">
                <div
                  v-if="staff.avatar"
                  class="w-10 h-10 rounded-full overflow-hidden"
                >
                  <img :src="staff.avatar" class="w-full h-full object-cover" />
                </div>
                <div
                  v-else
                  class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs"
                  :class="{
                    'bg-[#335c94] text-white': staff.initials === 'MC',
                  }"
                >
                  {{ staff.initials }}
                </div>
              </div>

              <div>
                <p class="text-sm font-bold">{{ staff.name }}</p>
                <p class="text-[11px] text-slate-400">
                  {{ staff.role }} •
                  <span
                    :class="
                      staff.status === 'Available'
                        ? 'text-green-500'
                        : 'text-slate-400'
                    "
                    >{{ staff.status }}</span
                  >
                </p>
              </div>
            </div>

            <!-- Checkmark for selection -->
            <div v-if="selectedStaffId === staff.id" class="text-[#c5a35e]">
              <Icon name="lucide:circle-check-big" class="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Staff } from "@/types/room-service";

// State
const selectedStaffId = ref(2); // Chef Thomas selected by default

const staffList = ref<Staff[]>([
  {
    id: 1,
    name: "Maria G.",
    role: "Runner",
    status: "Available",
    avatar: "https://i.pravatar.cc/100?u=maria",
  },
  {
    id: 2,
    name: "Chef Thomas",
    role: "Kitchen",
    status: "Preparing",
    avatar: "https://i.pravatar.cc/100?u=thomas",
  },
  { id: 3, name: "Alex D.", role: "Runner", status: "Busy", initials: "AD" },
  { id: 4, name: "M. Chef", role: "Kitchen", status: "Busy", initials: "MC" },
]);

const isTaskDialogOpen = ref(false);
const isCreatingTask = ref(false);
const taskTitle = ref("");
const taskNotes = ref("");

const handleCreateTask = () => {
  taskTitle.value = "";
  taskNotes.value = "";
  isTaskDialogOpen.value = true;
};

// Stands in for the real create-task call, so the dialog's loading state and
// the close-on-success path are both exercised.
const submitTask = async () => {
  isCreatingTask.value = true;
  await new Promise((resolve) => setTimeout(resolve, 800));
  isCreatingTask.value = false;
  isTaskDialogOpen.value = false;
};

definePageMeta({
  layout: "default",
  // Without this the last crumb would be the raw route id ("Room Service / 3").
  breadcrumb: "Order details",
});
</script>