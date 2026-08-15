<template>
  <header
    class="h-20 flex items-center justify-between px-6 lg:px-10 shrink-0 gap-4"
  >
    <div class="flex items-center gap-3 min-w-0">
      <!-- Opens the off-canvas sidebar; hidden once the sidebar is pinned -->
      <VButton
        variant="plain"
        icon="lucide:menu"
        icon-class="w-6 h-6"
        class="lg:hidden text-slate-500 hover:text-slate-800 shrink-0"
        aria-controls="app-sidebar"
        :aria-expanded="isSidebarOpen"
        aria-label="Open navigation"
        @click="toggleSidebar"
      />
      <h2 class="text-2xl font-serif truncate">{{ title }}</h2>
    </div>
    <div class="flex items-center gap-4 sm:gap-6 shrink-0">
      <!-- Locale switch -->
      <VButton
        variant="plain"
        icon="prime:language"
        icon-class="w-6 h-6"
        class="gap-1.5 text-slate-500 hover:text-slate-800"
        :title="switchLabel"
        :aria-label="switchLabel"
        @click="toggleLocale"
      >
        <span class="text-xs font-semibold uppercase">{{
          nextLocale.code
        }}</span>
      </VButton>

      <VButton
        variant="plain"
        icon="lucide:bell"
        icon-class="w-6 h-6"
        class="text-slate-500 hover:text-slate-800"
        aria-label="Notifications"
      />
      <VButton
        variant="plain"
        icon="lucide:circle-question-mark"
        icon-class="w-6 h-6"
        class="text-slate-500 hover:text-slate-800"
        aria-label="Help"
      />
      <div
        class="w-10 h-10 rounded-full bg-slate-300 overflow-hidden border-2 border-white shadow-sm"
      >
        <img src="/img/fake-user.jpg" alt="User" />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    /** Greeting shown on the left of the header. */
    title?: string;
  }>(),
  {
    title: "Morning, Operations Team",
  },
);

const { t, locale, locales, setLocale } = useI18n();
const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();

/**
 * The locale the button switches to. With two locales this is a plain toggle;
 * it cycles if more are added.
 */
const nextLocale = computed<LocaleObject>(() => {
  const list = locales.value as LocaleObject[];
  const current = list.findIndex((l) => l.code === locale.value);
  return list[(current + 1) % list.length]!;
});

const switchLabel = computed(() =>
  t("nav.switch_language", { language: nextLocale.value.name }),
);

// setLocale navigates to the prefixed route for the target locale and
// persists the i18n_redirected cookie.
const toggleLocale = () => setLocale(nextLocale.value.code);
</script>