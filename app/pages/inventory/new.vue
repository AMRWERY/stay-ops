<template>
  <div>
    <h1>New Inventory Item Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.inventory_new"),
  description: () => t("meta.inventory_new_description"),
  private: true,
});
</script>