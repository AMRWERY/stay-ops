/**
 * Live time-of-day greeting plus the current date and clock.
 *
 * The period, the date and the clock all depend on the *viewer's* timezone,
 * which the server can't know — rendering them during SSR would hydrate into a
 * mismatch. So the clock only starts on mount and `isReady` stays false until
 * then; render a placeholder while it is.
 */

import type { DayPeriod, UseGreetingOptions } from "@/types/global/greeting";

// Start hour of each period. Anything before the first entry belongs to the
// previous night, which is why "night" wraps around midnight.
const PERIOD_START: Record<Exclude<DayPeriod, "night">, number> = {
  morning: 5,
  afternoon: 12,
  evening: 17,
};

const NIGHT_START = 21;

const PERIOD_ICONS: Record<DayPeriod, string> = {
  morning: "lucide:sunrise",
  afternoon: "lucide:sun",
  evening: "lucide:sunset",
  night: "lucide:moon",
};

// "-u-nu-latn" keeps Arabic dates on Latin digits so they stay aligned with the
// clock (Intl would otherwise render ٠١٢ for ar-EG).
const INTL_LOCALES: Record<string, string> = {
  en: "en-US",
  ar: "ar-EG-u-nu-latn",
};

const pad = (value: number) => String(value).padStart(2, "0");

export const useGreeting = (options: UseGreetingOptions = {}) => {
  const { interval = 1000, hour12 = true } = options;

  const { t, locale } = useI18n();

  const now = ref(new Date());
  const isReady = ref(false);

  const { pause, resume } = useIntervalFn(
    () => {
      now.value = new Date();
    },
    interval,
    { immediate: false },
  );

  onMounted(() => {
    now.value = new Date();
    isReady.value = true;
    resume();
  });

  const intlLocale = computed(() => INTL_LOCALES[locale.value] ?? "en-US");

  const hour = computed(() => now.value.getHours());

  const period = computed<DayPeriod>(() => {
    const h = hour.value;
    if (h >= NIGHT_START || h < PERIOD_START.morning) return "night";
    if (h >= PERIOD_START.evening) return "evening";
    if (h >= PERIOD_START.afternoon) return "afternoon";
    return "morning";
  });

  const periodIcon = computed(() => PERIOD_ICONS[period.value]);

  /** "Good morning" — the greeting on its own. */
  const greeting = computed(() => t(`greeting.${period.value}`));

  const name = computed(() => toValue(options.name));

  /** "Good morning, Operations Team" — falls back to the bare greeting. */
  const greetingLine = computed(() =>
    name.value
      ? t("greeting.line", { greeting: greeting.value, name: name.value })
      : greeting.value,
  );

  /** "Friday, 15 August 2026" */
  const dateLabel = computed(() =>
    new Intl.DateTimeFormat(intlLocale.value, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now.value),
  );

  // Clock parts are exposed separately (already zero-padded) so the digits can
  // be animated individually instead of as one re-rendered string.
  const hours = computed(() => {
    if (!hour12) return pad(hour.value);
    return pad(hour.value % 12 || 12);
  });

  const minutes = computed(() => pad(now.value.getMinutes()));
  const seconds = computed(() => pad(now.value.getSeconds()));

  const meridiem = computed(() => {
    if (!hour12) return "";
    return t(hour.value < 12 ? "greeting.am" : "greeting.pm");
  });

  const time = computed(() =>
    [`${hours.value}:${minutes.value}:${seconds.value}`, meridiem.value]
      .filter(Boolean)
      .join(" "),
  );

  return {
    now,
    isReady,
    period,
    periodIcon,
    greeting,
    greetingLine,
    dateLabel,
    hours,
    minutes,
    seconds,
    meridiem,
    time,
    /** Stop / restart the tick, e.g. while a heavy view is open. */
    pause,
    resume,
  };
};
