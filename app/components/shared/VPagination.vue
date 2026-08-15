<template>
  <nav
    v-if="totalPages > 1 || showSummary"
    class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    :aria-label="ariaLabel"
  >
    <p v-if="showSummary" class="text-xs text-slate">
      Showing
      <span class="font-medium text-ink">{{ from }}–{{ to }}</span>
      of
      <span class="font-medium text-ink">{{ total }}</span>
      {{ itemLabel }}
    </p>

    <ul v-if="totalPages > 1" class="flex items-center gap-1">
      <li>
        <LazyVButton
          variant="plain"
          icon="lucide:chevron-left"
          icon-class="w-4 h-4 rtl:rotate-180"
          class="h-8 w-8 justify-center rounded-md text-slate hover:bg-linen hover:text-ink"
          :disabled="disabled || page <= 1"
          aria-label="Previous page"
          @click="go(page - 1)"
        />
      </li>

      <li v-for="(item, index) in items" :key="`${item}-${index}`">
        <span
          v-if="item === ELLIPSIS"
          class="flex h-8 w-8 items-center justify-center text-slate-light"
          aria-hidden="true"
          >…</span
        >
        <LazyVButton
          v-else
          variant="plain"
          :class="[
            'h-8 min-w-8 justify-center rounded-md px-2 text-sm transition-colors',
            item === page
              ? 'bg-brass font-semibold text-white'
              : 'text-slate hover:bg-linen hover:text-ink',
          ]"
          :disabled="disabled"
          :aria-current="item === page ? 'page' : undefined"
          :aria-label="`Page ${item}`"
          @click="go(item as number)"
        >
          {{ item }}
        </LazyVButton>
      </li>

      <li>
        <LazyVButton
          variant="plain"
          icon="lucide:chevron-right"
          icon-class="w-4 h-4 rtl:rotate-180"
          class="h-8 w-8 justify-center rounded-md text-slate hover:bg-linen hover:text-ink"
          :disabled="disabled || page >= totalPages"
          aria-label="Next page"
          @click="go(page + 1)"
        />
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
const ELLIPSIS = "…" as const;

const props = withDefaults(
  defineProps<{
    /** Total number of items across every page. */
    total: number;
    perPage?: number;
    /** Page numbers shown on each side of the current one. */
    siblingCount?: number;
    /** Hide the "Showing 1–10 of 42" line. */
    showSummary?: boolean;
    /** Noun for the summary line, e.g. "orders". */
    itemLabel?: string;
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    perPage: 10,
    siblingCount: 1,
    showSummary: true,
    itemLabel: "results",
    disabled: false,
    ariaLabel: "Pagination",
  },
);

/** Current page, 1-based. Usable with or without v-model:page. */
const page = defineModel<number>("page", { default: 1 });

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / Math.max(1, props.perPage))),
);

const from = computed(() =>
  props.total === 0 ? 0 : (page.value - 1) * props.perPage + 1,
);

const to = computed(() => Math.min(page.value * props.perPage, props.total));

/**
 * Page buttons around the current page, with the first and last always
 * reachable and an ellipsis wherever the run is broken.
 */
const items = computed<(number | typeof ELLIPSIS)[]>(() => {
  const last = totalPages.value;
  const start = Math.max(1, page.value - props.siblingCount);
  const end = Math.min(last, page.value + props.siblingCount);

  const result: (number | typeof ELLIPSIS)[] = [];

  if (start > 1) {
    result.push(1);
    // A single hidden page is shown outright — an ellipsis standing in for one
    // number costs the same space and one more click.
    if (start > 2) result.push(start === 3 ? 2 : ELLIPSIS);
  }

  for (let i = start; i <= end; i++) result.push(i);

  if (end < last) {
    if (end < last - 1) result.push(end === last - 2 ? last - 1 : ELLIPSIS);
    result.push(last);
  }

  return result;
});

const go = (target: number) => {
  const next = Math.min(Math.max(1, target), totalPages.value);
  if (next !== page.value) page.value = next;
};

// Keep the page in range when the result set shrinks under it, e.g. after a
// filter change — otherwise the table renders an empty slice.
watch(totalPages, (max) => {
  if (page.value > max) page.value = max;
});

defineExpose({ totalPages, from, to });
</script>
