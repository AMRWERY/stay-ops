<template>
  <div>
    <h1>Order Details Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.order"),
  description: () => t("meta.order_description"),
  private: true,
});
</script>