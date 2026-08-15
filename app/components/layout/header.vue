<template>
  <!-- relative + z-10 so the shadow paints over the scroll area below it,
       which otherwise covers it as a later sibling in the flow. -->
  <header
    class="relative z-10 h-20 flex items-center justify-between px-6 lg:px-10 shrink-0 gap-4 bg-[#f8f7f4] shadow-header"
  >
    <div class="flex items-center gap-3 min-w-0">
      <!-- Opens the off-canvas sidebar; hidden once the sidebar is pinned -->
      <LazyVButton
        variant="plain"
        icon="lucide:menu"
        icon-class="w-6 h-6"
        class="lg:hidden text-slate-500 hover:text-slate-800 shrink-0"
        aria-controls="app-sidebar"
        :aria-expanded="isSidebarOpen"
        aria-label="Open navigation"
        @click="toggleSidebar"
      />
      <!-- Greeting + live clock. Both depend on the viewer's clock, so a
           placeholder of the same size holds the space until mount. -->
      <div class="min-w-0">
        <Transition name="greeting" mode="out-in">
          <div v-if="isReady" key="greeting">
            <h2 class="text-2xl font-serif truncate leading-tight">
              {{ greetingLine }}
            </h2>
            <p
              class="mt-0.5 flex items-center gap-2 text-xs text-slate-500 min-w-0"
            >
              <Icon :name="periodIcon" class="w-3.5 h-3.5 shrink-0" />
              <span class="hidden sm:inline truncate">{{ dateLabel }}</span>
              <span class="hidden sm:inline text-slate-300">•</span>
              <span class="inline-flex items-baseline font-mono shrink-0">
                <LazyVAnimatedNumber :value="hours" />
                <!-- Pulses once a second, so the clock reads as live -->
                <span
                  :class="[
                    'px-px transition-opacity duration-300',
                    Number(seconds) % 2 ? 'opacity-30' : 'opacity-100',
                  ]"
                  >:</span
                >
                <LazyVAnimatedNumber :value="minutes" />
                <span class="px-px opacity-40">:</span>
                <LazyVAnimatedNumber :value="seconds" />
                <span v-if="meridiem" class="ms-1">{{ meridiem }}</span>
              </span>
            </p>
          </div>

          <div v-else key="placeholder" class="animate-pulse">
            <div class="h-6 w-56 max-w-full rounded bg-slate-200/70" />
            <div class="mt-1.5 h-3 w-40 max-w-full rounded bg-slate-200/50" />
          </div>
        </Transition>
      </div>
    </div>
    <div class="flex items-center gap-4 sm:gap-6 shrink-0">
      <!-- Locale switch -->
      <LazyVButton
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
      </LazyVButton>

      <LazyVButton
      to="/notifications"
        variant="plain"
        icon="lucide:bell"
        icon-class="w-6 h-6"
        class="text-slate-500 hover:text-slate-800"
        aria-label="Notifications"
      />
      <LazyVButton
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
const { t, locale, locales, setLocale } = useI18n();
const { isOpen: isSidebarOpen, toggle: toggleSidebar } = useSidebar();

const props = withDefaults(
  defineProps<{
    /** Who the greeting addresses — the signed-in staff member or their team. */
    name?: string;
  }>(),
  {
    name: "Operations Team",
  },
);

const {
  isReady,
  greetingLine,
  periodIcon,
  dateLabel,
  hours,
  minutes,
  seconds,
  meridiem,
} = useGreeting({ name: () => props.name });

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

<style scoped>
.greeting-enter-active,
.greeting-leave-active {
  transition:
    opacity 300ms ease,
    transform 300ms ease;
}

.greeting-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.greeting-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .greeting-enter-active,
  .greeting-leave-active {
    transition: none;
  }
}
</style>