<template>
  <div>
    <h1>Inventory Item Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.inventory_item"),
  description: () => t("meta.inventory_item_description"),
  private: true,
});
</script>