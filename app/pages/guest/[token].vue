<template>
  <div>
    <h1>Guest Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "guest",
});

// The URL carries a room's QR token, so it must never be indexed.
useSeoPage({
  title: () => t("meta.guest"),
  description: () => t("meta.guest_description"),
  private: true,
});
</script>