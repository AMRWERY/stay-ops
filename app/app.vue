<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Outside NuxtLayout so it stays mounted across the navigations it
         covers. Raise it from anywhere with useOverlay(). -->
    <Overlay />
  </div>
</template>

<script lang="ts" setup>
const { localeProperties } = useI18n();

// Title and titleTemplate live in nuxt.config; pages set their own title
// through useSeoPage().
useHead(() => ({
  htmlAttrs: {
    lang: localeProperties.value.language,
    dir: localeProperties.value.dir ?? "ltr",
  },
}));
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}
</style>