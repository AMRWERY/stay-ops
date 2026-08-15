<template>
  <div>
    <h1>Staff Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.staff"),
  description: () => t("meta.staff_description"),
  private: true,
});
</script>