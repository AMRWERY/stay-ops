<template>
  <div>
    <h1>Settings Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.settings"),
  description: () => t("meta.settings_description"),
  private: true,
});
</script>