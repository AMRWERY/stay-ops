<template>
  <div>
    <h1>Reports Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.reports"),
  description: () => t("meta.reports_description"),
  private: true,
});
</script>