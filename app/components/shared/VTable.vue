<template>
  <div
    class="w-full overflow-hidden rounded-card border border-mist bg-white shadow-card"
  >
    <!-- Own scroll container: wide tables scroll here instead of the page, and
         the pagination footer below stays put while they do. -->
    <div class="w-full overflow-x-auto">
      <table class="w-full border-collapse text-sm">
      <caption v-if="caption" class="sr-only">
        {{
          caption
        }}
      </caption>

      <thead>
        <tr class="bg-linen">
          <th
            v-for="col in columns"
            :key="col.key"
            scope="col"
            :style="col.width ? { width: col.width } : undefined"
            :class="[
              'px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-slate whitespace-nowrap',
              alignClass(col.align),
              hideClass(col.hideBelow),
              col.headerClass,
            ]"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>

      <tbody>
        <template v-if="loading">
          <tr
            v-for="n in skeletonRows"
            :key="`skeleton-${n}`"
            class="border-t border-mist"
          >
            <td v-for="col in columns" :key="col.key" class="px-5 py-4">
              <div class="h-3 w-24 max-w-full animate-pulse rounded bg-mist" />
            </td>
          </tr>
        </template>

        <template v-else-if="visibleRows.length">
          <tr
            v-for="(row, index) in visibleRows"
            :key="keyOf(row, index)"
            :class="[
              'border-t border-mist transition-colors',
              rowTo ? 'cursor-pointer hover:bg-linen' : '',
            ]"
            @click="onRowClick(row, $event)"
          >
            <td
              v-for="(col, colIndex) in columns"
              :key="col.key"
              :class="[
                'px-5 py-4 align-middle',
                alignClass(col.align),
                hideClass(col.hideBelow),
                col.class,
              ]"
            >
              <!-- The first column carries the real link, so the row is
                   reachable by keyboard and opens in a new tab like any other
                   link — a click handler alone gives neither. -->
              <component
                :is="colIndex === 0 && rowTo ? NuxtLinkLocale : 'span'"
                v-bind="
                  colIndex === 0 && rowTo
                    ? {
                        to: rowTo(row),
                        class:
                          'block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-light rounded-sm',
                      }
                    : {}
                "
              >
                <slot
                  :name="`cell:${col.key}`"
                  :row="row"
                  :value="cellValue(col, row)"
                  :index="index"
                >
                  {{ cellValue(col, row) }}
                </slot>
              </component>
            </td>
          </tr>
        </template>

        <tr v-else>
          <td :colspan="columns.length" class="px-5 py-16">
            <slot name="empty">
              <div class="flex flex-col items-center justify-center gap-3">
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-full bg-linen text-slate-light"
                >
                  <Icon :name="emptyIcon" class="h-6 w-6" />
                </div>
                <p class="font-display text-base text-ink">{{ emptyLabel }}</p>
                <p v-if="emptyHint" class="text-sm text-slate">
                  {{ emptyHint }}
                </p>
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
      </table>
    </div>

    <!-- Pagination sits inside the card, under the table. It's hidden while
         loading and when everything already fits on one page. -->
    <div
      v-if="isPaginated && !loading"
      class="border-t border-mist px-5 py-3"
    >
      <LazyVPagination
        v-model:page="page"
        :total="rows.length"
        :per-page="perPage"
        :item-label="itemLabel"
      />
    </div>
  </div>
</template>

<script lang="ts" setup generic="Row extends Record<string, any>">
import type {
  TableColumn,
  TableAlign,
  TableHideBelow,
} from "@/types/shared/VTable";

const props = withDefaults(
  defineProps<{
    columns: TableColumn<Row>[];
    rows: Row[];
    /** Row property holding the key, or a function returning one. */
    rowKey?: string | ((row: Row, index: number) => string | number);
    /** Route for a row. Providing it makes rows clickable. */
    rowTo?: (row: Row) => string;
    loading?: boolean;
    skeletonRows?: number;
    emptyLabel?: string;
    emptyHint?: string;
    emptyIcon?: string;
    /** Screen-reader description of the table. */
    caption?: string;
    /**
     * Page `rows` in the client. Turn off when the rows are already a page
     * fetched from the server, and drive VPagination from the page instead.
     */
    paginate?: boolean;
    perPage?: number;
    /** Noun for the pagination summary, e.g. "orders". */
    itemLabel?: string;
  }>(),
  {
    rowKey: "id",
    loading: false,
    skeletonRows: 4,
    emptyLabel: "Nothing here yet",
    emptyIcon: "lucide:inbox",
    paginate: true,
    perPage: 10,
    itemLabel: "results",
  },
);

const emit = defineEmits<{
  (e: "row-click", row: Row, event: MouseEvent): void;
}>();

const NuxtLinkLocale = resolveComponent("NuxtLinkLocale");

const localePath = useLocalePath();

/** Current page, 1-based. Bindable with v-model:page to drive it externally. */
const page = defineModel<number>("page", { default: 1 });

const isPaginated = computed(
  () => props.paginate && props.perPage > 0 && props.rows.length > props.perPage,
);

const visibleRows = computed(() => {
  if (!isPaginated.value) return props.rows;
  const start = (page.value - 1) * props.perPage;
  return props.rows.slice(start, start + props.perPage);
});

// A filter that shrinks the result set can leave the page number past the end,
// which would render an empty table. Reset to the first page whenever the set
// changes size rather than trying to guess where the user was.
watch(
  () => props.rows.length,
  () => {
    page.value = 1;
  },
);

const keyOf = (row: Row, index: number) => {
  if (typeof props.rowKey === "function") return props.rowKey(row, index);
  return row[props.rowKey] ?? index;
};

const cellValue = (col: TableColumn<Row>, row: Row) =>
  col.value ? col.value(row) : row[col.key];

const alignClass = (align?: TableAlign) => {
  switch (align) {
    case "center":
      return "text-center";
    case "end":
      return "text-end";
    default:
      return "text-start";
  }
};

// Static strings so Tailwind can see the classes at build time.
const hideClass = (hideBelow?: TableHideBelow) => {
  switch (hideBelow) {
    case "sm":
      return "hidden sm:table-cell";
    case "md":
      return "hidden md:table-cell";
    case "lg":
      return "hidden lg:table-cell";
    default:
      return "";
  }
};

// Clicking anywhere in the row follows the first cell's link. Interactive
// content inside a cell keeps its own behaviour instead of navigating.
const INTERACTIVE = "a,button,input,select,textarea,label,[data-row-ignore]";

const onRowClick = (row: Row, event: MouseEvent) => {
  emit("row-click", row, event);
  if (!props.rowTo) return;

  const target = event.target as Element | null;
  if (target?.closest(INTERACTIVE)) return;

  const path = localePath(props.rowTo(row));

  // Mirror the modifier-click behaviour of the anchor in the first cell.
  if (event.metaKey || event.ctrlKey) {
    window.open(path, "_blank", "noopener");
    return;
  }

  navigateTo(path);
};
</script>