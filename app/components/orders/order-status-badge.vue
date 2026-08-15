<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
      style.badge,
    ]"
  >
    <span :class="['h-1.5 w-1.5 rounded-full', style.dot]" aria-hidden="true" />
    {{ style.label }}
  </span>
</template>

<script lang="ts" setup>
import type { OrderStatus } from "@/types/room-service";

const props = defineProps<{
  status: OrderStatus;
}>();

/**
 * Status colours follow the housekeeping door-tag logic in docs/design.md §3:
 * the dot carries the full-strength status colour, the badge a ~15% tint of it.
 *
 * Text colour is darkened for `preparing` and `pending` — Progress (#E8813B)
 * and Idle (#8A93A0) sit around 2.5:1 on a light tint, well under the 4.5:1
 * the same doc requires (§9). The label is always present, so status never
 * depends on colour alone either way.
 */
const STATUS_STYLES: Record<
  OrderStatus,
  { label: string; dot: string; badge: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-status-idle",
    badge: "bg-status-idle/15 text-slate",
  },
  preparing: {
    label: "Preparing",
    dot: "bg-status-progress",
    badge: "bg-status-progress/15 text-[#9A5117]",
  },
  "on-the-way": {
    label: "On the way",
    dot: "bg-status-info",
    badge: "bg-status-info/15 text-status-info",
  },
  delivered: {
    label: "Delivered",
    dot: "bg-status-ready",
    badge: "bg-status-ready/15 text-status-ready",
  },
};

const style = computed(() => STATUS_STYLES[props.status] ?? STATUS_STYLES.pending);
</script>
