<template>
  <div>
    <h1>Staff Member Page</h1>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

definePageMeta({
  layout: "default",
});

useSeoPage({
  title: () => t("meta.staff_member"),
  description: () => t("meta.staff_member_description"),
  private: true,
});
</script>