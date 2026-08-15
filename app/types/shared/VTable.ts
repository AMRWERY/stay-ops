export type TableAlign = "start" | "center" | "end";

/** Breakpoint below which a column is dropped, keeping the table usable on a phone. */
export type TableHideBelow = "sm" | "md" | "lg";

export interface TableColumn<Row = any> {
  /** Row property to read, and the suffix of the `cell:<key>` slot. */
  key: string;
  /** Header text. Omit for a column that only renders through its slot. */
  label?: string;
  /** Read the value from somewhere other than `row[key]`. */
  value?: (row: Row) => unknown;
  align?: TableAlign;
  /** Extra classes on the body cells. */
  class?: string;
  /** Extra classes on the header cell. */
  headerClass?: string;
  hideBelow?: TableHideBelow;
  /** CSS width, e.g. "12rem" or "20%". */
  width?: string;
}
