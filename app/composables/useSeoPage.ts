/**
 * Centralised SEO composable — use on every page.
 *
 * Public pages  → title, description, Open Graph, Twitter Card, canonical, hreflang
 * Private pages → title, description, robots noindex/nofollow
 */

import type { UseSeoPageOptions } from "@/types/seo-pages"

export const useSeoPage = (opts: UseSeoPageOptions) => {
  const { locale } = useI18n()
  const route = useRoute()
  const config = useRuntimeConfig()

  const siteUrl = (config.public.siteUrl as string | undefined) ?? ""

  const ogLocaleMap: Record<string, string> = { en: "en_US", ar: "ar_EG" }
  const hreflangMap: Record<string, string> = { en: "en-US", ar: "ar-EG" }

  const altLocale = computed(() =>
    locale.value === "en" ? "ar" : "en",
  )

  const canonicalUrl = computed(
    () => `${siteUrl}${route.fullPath}`,
  )

  const altUrl = computed(() => {
    const swapped = route.fullPath.replace(
      /^\/(en|ar)(\/|$)/,
      `/${altLocale.value}$2`,
    )
    return `${siteUrl}${swapped}`
  })

  const xDefaultUrl = computed(() => {
    const enPath = route.fullPath.replace(/^\/(en|ar)(\/|$)/, "/en$2")
    return `${siteUrl}${enPath}`
  })

  if (opts.private) {
    useSeoMeta({
      title: opts.title,
      description: opts.description,
      robots: "noindex, nofollow",
    })
    return
  }

  useSeoMeta({
    title: opts.title,
    description: opts.description,
    ogTitle: opts.title,
    ogDescription: opts.description,
    ogType: "website",
    ogUrl: () => canonicalUrl.value,
    ogSiteName: "StayOps",
    ogLocale: () => ogLocaleMap[locale.value] ?? "en_US",
    twitterCard: "summary_large_image",
    twitterTitle: opts.title,
    twitterDescription: opts.description,
  })

  useHead(() => ({
    link: [
      { rel: "canonical", href: canonicalUrl.value },
      {
        rel: "alternate",
        hreflang: hreflangMap[locale.value] ?? "en-US",
        href: canonicalUrl.value,
      },
      {
        rel: "alternate",
        hreflang: hreflangMap[altLocale.value] ?? "ar-EG",
        href: altUrl.value,
      },
      { rel: "alternate", hreflang: "x-default", href: xDefaultUrl.value },
    ],
  }))
}
