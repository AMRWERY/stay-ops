<template>
  <div>
    <h1>Inventory Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.inventory"),
  description: () => t("meta.inventory_description"),
  private: true,
});
</script>