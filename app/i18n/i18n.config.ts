import type { DateTimeFormat, NumberFormat } from "@intlify/core-base";
import type { Locale } from "~/types/supported-locales";

type DatetimeFormats = { [key in Locale]: DateTimeFormat };
type NumberFormats = { [key in Locale]: NumberFormat };

const defaultDatetimeFormat: DateTimeFormat = {
  short: { year: "numeric", month: "short", day: "numeric" },
  long: {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
  },
};

const datetimeFormats: DatetimeFormats = {
  en: defaultDatetimeFormat,
  ar: {
    short: { year: "numeric", month: "short", day: "numeric" },
    long: {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    },
  },
};

const numberFormats: NumberFormats = {
  en: {
    decimal: {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    percent: { style: "percent", useGrouping: false },
  },
  ar: {
    decimal: {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    percent: { style: "percent", useGrouping: false },
  },
};

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  datetimeFormats,
  numberFormats,
  missingWarn: false,
  fallbackWarn: false,
  warnHtmlMessage: false,
}));
