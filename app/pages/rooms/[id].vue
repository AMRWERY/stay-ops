<template>
  <div>
    <h1>Room Details Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.room"),
  description: () => t("meta.room_description"),
  private: true,
});
</script>