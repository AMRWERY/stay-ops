<template>
  <!-- A lone root crumb is just the dashboard telling you you're on the
       dashboard, so the trail only renders once there's somewhere to go back to. -->
  <nav v-if="crumbs.length > 1" aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-1.5 text-xs">
      <li
        v-for="(crumb, index) in crumbs"
        :key="`${crumb.label}-${index}`"
        class="flex items-center gap-1.5"
      >
        <Icon
          v-if="index > 0"
          name="lucide:chevron-right"
          class="h-3.5 w-3.5 shrink-0 text-slate-light rtl:rotate-180"
          aria-hidden="true"
        />

        <nuxt-link-locale
          v-if="crumb.to && index < crumbs.length - 1"
          :to="crumb.to"
          class="text-slate transition-colors hover:text-brass rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-light"
        >
          {{ crumb.label }}
        </nuxt-link-locale>

        <span v-else class="font-medium text-ink" aria-current="page">
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import type { BreadcrumbItem } from "@/types/shared/VBreadcrumb";

const props = defineProps<{
  /** Replaces the route-derived trail entirely. */
  items?: BreadcrumbItem[];
  /**
   * Label for the last crumb, for pages whose final segment is an id. Pages
   * can also set it statically with definePageMeta({ breadcrumb: "…" }).
   */
  current?: string;
  /** Drop the leading "Dashboard" crumb. */
  hideRoot?: boolean;
}>();

const { t, locales } = useI18n();
const route = useRoute();

/**
 * Segments that map onto an existing meta key. Anything unlisted (an id, or a
 * new section added later) falls back to a title-cased segment, so the trail
 * never renders blank.
 */
const SEGMENT_KEYS: Record<string, string> = {
  inventory: "meta.inventory",
  notifications: "meta.notifications",
  orders: "meta.orders",
  "purchase-orders": "meta.purchase_orders",
  reports: "meta.reports",
  "room-service": "meta.room_service",
  rooms: "meta.rooms",
  settings: "meta.settings",
  staff: "meta.staff",
  suppliers: "meta.suppliers",
};

const titleCase = (segment: string) =>
  decodeURIComponent(segment)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

// The i18n "prefix" strategy puts the locale in every path, and it isn't part
// of the trail.
const localeCodes = computed(() =>
  (locales.value as { code: string }[]).map((locale) => locale.code),
);

const segments = computed(() => {
  const parts = route.path.split("/").filter(Boolean);
  if (parts[0] && localeCodes.value.includes(parts[0])) parts.shift();
  return parts;
});

/** Segment values that came from a route param, e.g. the "402" in /rooms/402. */
const paramValues = computed(
  () => new Set(Object.values(route.params).flat().map(String)),
);

const labelFor = (segment: string) => {
  const key = SEGMENT_KEYS[segment];
  if (key) return t(key);
  if (paramValues.value.has(segment)) return decodeURIComponent(segment);
  return titleCase(segment);
};

const crumbs = computed<BreadcrumbItem[]>(() => {
  if (props.items) return props.items;

  const trail: BreadcrumbItem[] = props.hideRoot
    ? []
    : [{ label: t("meta.dashboard"), to: "/" }];

  let path = "";
  segments.value.forEach((segment, index) => {
    path += `/${segment}`;
    const isLast = index === segments.value.length - 1;
    trail.push({
      label:
        isLast && currentLabel.value ? currentLabel.value : labelFor(segment),
      to: path,
    });
  });

  return trail;
});

const currentLabel = computed(
  () => props.current ?? (route.meta.breadcrumb as string | undefined),
);
</script>
