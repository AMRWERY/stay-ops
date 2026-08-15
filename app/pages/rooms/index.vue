<template>
  <div>
    <h1>Rooms Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.rooms"),
  description: () => t("meta.rooms_description"),
  private: true,
});
</script>