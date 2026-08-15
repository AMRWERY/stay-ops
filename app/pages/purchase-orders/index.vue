<template>
  <div>
    <h1>Purchase Orders Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.purchase_orders"),
  description: () => t("meta.purchase_orders_description"),
  private: true,
});
</script>
