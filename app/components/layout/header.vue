<template>
  <header
    class="h-20 flex items-center justify-between px-6 lg:px-10 shrink-0 gap-4"
  >
    <div class="flex items-center gap-3 min-w-0">
      <!-- Opens the off-canvas sidebar; hidden once the sidebar is pinned -->
      <button
        type="button"
        class="lg:hidden text-slate-500 hover:text-slate-800 transition-colors shrink-0"
        aria-controls="app-sidebar"
        :aria-expanded="isSidebarOpen"
        aria-label="Open navigation"
        @click="toggleSidebar"
      >
        <Icon name="lucide:menu" class="w-6 h-6" />
      </button>
      <h2 class="text-2xl font-serif truncate">{{ title }}</h2>
    </div>
    <div class="flex items-center gap-4 sm:gap-6 shrink-0">
      <!-- Locale switch -->
      <button
        type="button"
        class="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors"
        :title="switchLabel"
        :aria-label="switchLabel"
        @click="toggleLocale"
      >
        <Icon name="prime:language" class="w-6 h-6" />
        <span class="text-xs font-semibold uppercase">{{
          nextLocale.code
        }}</span>
      </button>

      <button
        type="button"
        class="text-slate-500 hover:text-slate-800"
        aria-label="Notifications"
      >
        <Icon name="lucide:bell" class="w-6 h-6" />
      </button>
      <button
        type="button"
        class="text-slate-500 hover:text-slate-800"
        aria-label="Help"
      >
        <Icon name="lucide:circle-question-mark" class="w-6 h-6" />
      </button>
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