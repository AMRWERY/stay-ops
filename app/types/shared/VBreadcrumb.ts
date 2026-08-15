export interface BreadcrumbItem {
  label: string;
  /** Unprefixed path ("/room-service"). Omit for the current, unlinked page. */
  to?: string;
}

/**
 * Lets a page name its own last crumb, for routes whose final segment is an id:
 * definePageMeta({ breadcrumb: "Order details" })
 */
declare module "#app" {
  interface PageMeta {
    breadcrumb?: string;
  }
}
