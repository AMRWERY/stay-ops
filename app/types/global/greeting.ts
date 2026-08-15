import type { MaybeRefOrGetter } from "vue";

/** Slice of the day a timestamp falls into; drives the greeting and its icon. */
export type DayPeriod = "morning" | "afternoon" | "evening" | "night";

export interface UseGreetingOptions {
  /** Person or team the greeting addresses, e.g. "Operations Team". */
  name?: MaybeRefOrGetter<string | undefined>;
  /** Clock tick in ms. Set to 60000 when seconds aren't displayed. */
  interval?: number;
  /** 12-hour clock with a meridiem. Set false for 24-hour. */
  hour12?: boolean;
}
