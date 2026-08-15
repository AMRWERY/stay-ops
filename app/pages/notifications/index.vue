<template>
  <div>
    <h1>Notifications Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.notifications"),
  description: () => t("meta.notifications_description"),
  private: true,
});
</script>