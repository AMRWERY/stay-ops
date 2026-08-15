<template>
  <div>
    <h1>Suppliers Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.suppliers"),
  description: () => t("meta.suppliers_description"),
  private: true,
});
</script>