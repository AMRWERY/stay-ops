<template>
  <div>
    <h1>Orders Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.orders"),
  description: () => t("meta.orders_description"),
  private: true,
});
</script>