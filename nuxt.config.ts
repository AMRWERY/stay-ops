// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? "https://stayops.hotel",
    },
  },
  modules: [
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxtjs/supabase",
    "@vee-validate/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },
  i18n: {
    vueI18n: "app/i18n/i18n.config.ts",
    restructureDir: "",
    langDir: "app/i18n/locales",
    locales: [
      {
        code: "en",
        language: "en-US",
        file: "en.json",
        name: "English",
        dir: "ltr",
      },
      { code: "ar", language: "ar-EG", file: "ar.json", name: "عربي", dir: "rtl" },
    ],
    defaultLocale: "en",
    strategy: "prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      fallbackLocale: "en",
      redirectOn: "root",
    },
    bundle: {},
  },
  supabase: {
    // The module's built-in redirect hardcodes "/auth/index", which never matches
    // under i18n strategy: "prefix". app/middleware/auth.global.ts handles it
    // instead so the target path keeps its locale prefix.
    redirect: false,
  },
  veeValidate: {
    autoImports: true,
  },
  icon: {
    // Collections come from the @iconify-json packages in devDependencies, so
    // the server never calls out to api.iconify.design.
    serverBundle: {
      collections: ["heroicons", "lucide"],
    },
    // Scanning bundles every icon name found in the source, which lets
    // loadIcon() resolve synchronously during SSR instead of fetching
    // /api/_nuxt_icon (a relative URL the server cannot fetch, which is what
    // produced the "[Icon] failed to load icon" warnings).
    clientBundle: {
      scan: true,
    },
  },
  imports: {
    dirs: ["composables/**"],
  },
  css: ["@/assets/css/tailwind.css"],
  components: [
    {
      path: "components",
      pathPrefix: false,
    },
  ],
  app: {
    head: {
      title: "StayOps",
      titleTemplate: "%s",
      script: [{}],
      noscript: [],
      link: [{}],
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          charset: "utf-8",
        },
      ],
    },
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
  },
});