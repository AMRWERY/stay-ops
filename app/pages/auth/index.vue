<template>
  <div class="w-full max-w-[440px] bg-white rounded-lg shadow-2xl p-10">
    <!-- Logo & Header -->
    <div class="flex flex-col items-center mb-10">
      <div class="flex items-center gap-3 mb-2">
        <!-- Gold Square Icon -->
        <div class="w-7 h-7 bg-[#c5a35e] rounded-sm"></div>
        <h1 class="text-3xl font-serif font-bold text-[#09101d] tracking-tight">
          StayOps
        </h1>
      </div>
      <h2 class="text-xl font-serif font-bold text-[#09101d]">Sign in</h2>
    </div>

    <!-- Form -->
    <LazyVFormWrapper
      :initial-values="initialValues"
      :submit-handler="handleSignIn"
      :form-error="formError"
      form-class="space-y-5"
      actions-class="mt-2"
    >
      <!-- Email Field -->
      <LazyVInput
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="staff@stayops.hotel"
        autocomplete="email"
        required
        label-class="text-slate-500 font-medium"
        :rules="composeRules(formRules.required(), formRules.email())"
      />

      <!-- Password Field -->
      <LazyVInput
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autocomplete="current-password"
        required
        label-class="text-slate-500 font-medium"
        show-password-toggle
        :rules="composeRules(formRules.required(), formRules.minLength(8))"
      />

      <!-- Sign In Button -->
      <template #actions="{ isBusy }">
        <VButton
          type="submit"
          size="lg"
          block
          label="Sign in"
          loading-text="Signing in…"
          :loading="isBusy"
        />
      </template>
    </LazyVFormWrapper>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const initialValues = {
  email: "staff@stayops.hotel",
  password: "password123",
};

const formError = ref<string | null>(null);

const handleSignIn = async (values: Record<string, any>) => {
  formError.value = null;
  console.log("Signing in with:", values.email);
};

definePageMeta({
  layout: "auth",
});

useSeoPage({
  title: () => t("meta.login"),
  description: () => t("meta.login_description"),
  private: true,
});
</script>