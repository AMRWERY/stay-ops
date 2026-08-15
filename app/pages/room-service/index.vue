<template>
  <div>
    <h1>Room Service Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.room_service"),
  description: () => t("meta.room_service_description"),
  private: true,
});
</script>