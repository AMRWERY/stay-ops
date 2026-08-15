<template>
  <LazyVButton
    variant="plain"
    :to="to"
    :icon="icon"
    icon-class="w-3.5 h-3.5 rtl:rotate-180"
    class="gap-2 text-[#c5a35e] text-xs font-bold uppercase tracking-wider hover:opacity-80"
    @click="onClick"
  >
    {{ label }}
  </LazyVButton>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    /**
     * Where "back" leads, unprefixed ("/room-service") — it goes through
     * <nuxt-link-locale>. Naming the parent route beats history.back(), which
     * can land on an unrelated page, and it keeps the control a real link that
     * survives a deep link or an opened-in-new-tab detail page.
     *
     * Omit it to fall back to the browser's history instead.
     */
    to?: string;
    label?: string;
    /** Iconify name. The arrow mirrors itself under RTL. */
    icon?: string;
  }>(),
  {
    label: "Back",
    icon: "lucide:arrow-left",
  },
);

const router = useRouter();

// With `to` set the anchor navigates on its own, so this only runs for the
// history variant.
const onClick = () => {
  if (props.to) return;
  router.back();
};
</script>