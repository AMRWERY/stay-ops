<template>
  <component
    :is="as"
    :novalidate="as === 'form' ? true : undefined"
    :class="['w-full', formClass]"
    @submit="onSubmit"
    @reset.prevent="onReset"
  >
    <slot name="header" v-bind="slotProps" />

    <!-- Schema driven fields -->
    <div
      v-if="visibleFields.length"
      :class="['grid', gapClass, columnsClass, fieldsClass]"
    >
      <div
        v-for="field in visibleFields"
        :key="field.name"
        :class="[colSpanClass(field.colSpan), field.class]"
      >
        <!-- A `field:<name>` slot replaces the generated field entirely -->
        <slot :name="`field:${field.name}`" v-bind="slotProps" :field="field">
          <component
            :is="resolveComponent_(field.component)"
            v-bind="fieldBindings(field)"
          />
        </slot>
      </div>
    </div>

    <!-- Hand written fields -->
    <slot v-bind="slotProps" />

    <!-- Form level (non field) error -->
    <div
      v-if="formError"
      class="flex items-center gap-1.5 text-sm text-red-600 mt-4"
      role="alert"
    >
      <Icon
        name="heroicons:exclamation-triangle"
        class="w-4 h-4 flex-shrink-0"
      />
      <span>{{ formError }}</span>
    </div>

    <slot name="footer" v-bind="slotProps" />

    <!-- Actions -->
    <div
      v-if="shouldShowActions"
      :class="['flex items-center gap-3', actionsClass ?? 'mt-6']"
    >
      <slot name="actions" v-bind="slotProps">
        <button
          type="submit"
          :disabled="isSubmitDisabled"
          class="inline-flex items-center justify-center gap-2 bg-[#c5a35e] hover:bg-[#b39150] text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Icon
            v-if="isBusy"
            name="heroicons:arrow-path"
            class="w-4 h-4 animate-spin"
          />
          {{ submitLabel }}
        </button>

        <button
          v-if="showReset"
          type="reset"
          :disabled="isBusy"
          class="inline-flex items-center justify-center px-5 py-2.5 rounded-md font-medium text-slate-600 hover:bg-slate-100 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ resetLabel }}
        </button>
      </slot>
    </div>
  </component>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import type { Component } from "vue";
import type { FormFieldConfig } from '@/types/shared/VFormWrapper'

const props = withDefaults(
  defineProps<{
    /** Fields to render. Leave empty to lay the form out with the default slot. */
    fields?: FormFieldConfig[];
    /** yup / zod / typed schema, or a plain object of rules keyed by field name. */
    validationSchema?: any;
    initialValues?: Record<string, any>;
    initialErrors?: Record<string, string | undefined>;
    initialTouched?: Record<string, boolean>;
    validateOnMount?: boolean;
    keepValuesOnUnmount?: boolean;
    /**
     * Async submit handler. When provided it is awaited inside vee-validate's
     * submission, so `isSubmitting` stays true for its whole duration.
     * Otherwise listen to the `submit` event.
     */
    submitHandler?: (
      values: Record<string, any>,
      ctx: any,
    ) => any | Promise<any>;
    /** Form level error message, e.g. a failed API call. */
    formError?: string | null;
    /** Element to render. Use "div" for a form nested inside another form. */
    as?: string;
    columns?: 1 | 2 | 3 | 4;
    gap?: "sm" | "md" | "lg";
    /** Defaults to true when `fields` is used, false otherwise. */
    showActions?: boolean;
    showReset?: boolean;
    submitLabel?: string;
    resetLabel?: string;
    /** External busy flag, e.g. a pending store action. */
    loading?: boolean;
    disabled?: boolean;
    /** Keep the submit button disabled until the form is valid. */
    disableInvalid?: boolean;
    formClass?: string;
    fieldsClass?: string;
    actionsClass?: string;
  }>(),
  {
    fields: () => [],
    as: "form",
    columns: 1,
    gap: "md",
    // Must be declared, or Vue casts this absent Boolean prop to `false` and
    // the "auto" behaviour in shouldShowActions can never kick in.
    showActions: undefined,
    showReset: false,
    submitLabel: "Submit",
    resetLabel: "Reset",
    loading: false,
    disabled: false,
    disableInvalid: false,
    validateOnMount: false,
  },
);

const emit = defineEmits<{
  (e: "submit", values: Record<string, any>, ctx: any): void;
  (e: "invalid-submit", ctx: any): void;
  (e: "reset"): void;
}>();

const form = useForm({
  validationSchema: computed(() => props.validationSchema),
  initialValues: computed(() => props.initialValues) as any,
  initialErrors: props.initialErrors as any,
  initialTouched: props.initialTouched as any,
  validateOnMount: props.validateOnMount,
  keepValuesOnUnmount: computed(() => props.keepValuesOnUnmount ?? false),
});

const onSubmit = form.handleSubmit(
  async (values, ctx) => {
    emit("submit", values, ctx);
    if (props.submitHandler) {
      await props.submitHandler(values, ctx);
    }
  },
  (ctx) => {
    emit("invalid-submit", ctx);
  },
);

const onReset = () => {
  form.resetForm();
  emit("reset");
};

const isBusy = computed(() => props.loading || form.isSubmitting.value);

const isSubmitDisabled = computed(
  () =>
    props.disabled ||
    isBusy.value ||
    (props.disableInvalid && !form.meta.value.valid),
);

// Fields whose `if` predicate passes for the current values.
const visibleFields = computed(() =>
  props.fields.filter((field) => (field.if ? field.if(form.values) : true)),
);

// Default buttons appear for schema driven forms; a custom `actions` slot is
// always rendered. Either can be forced on or off with `showActions`.
const slots = useSlots();

const shouldShowActions = computed(
  () => props.showActions ?? (props.fields.length > 0 || Boolean(slots.actions)),
);

// `component` may be a string naming a globally registered component.
const resolveComponent_ = (component?: string | Component) => {
  if (!component) return resolveComponent("VInput");
  if (typeof component !== "string") return component;
  return resolveComponent(component);
};

// Everything except the layout-only keys becomes a prop on the field.
const LAYOUT_KEYS = ["component", "colSpan", "class", "if"];

const fieldBindings = (field: FormFieldConfig) => {
  const bindings: Record<string, any> = {};
  for (const [key, value] of Object.entries(field)) {
    if (!LAYOUT_KEYS.includes(key)) bindings[key] = value;
  }
  return bindings;
};

const gapClass = computed(() => {
  switch (props.gap) {
    case "sm":
      return "gap-3";
    case "lg":
      return "gap-6";
    case "md":
    default:
      return "gap-5";
  }
});

// Static strings so Tailwind can see the classes at build time.
const columnsClass = computed(() => {
  switch (props.columns) {
    case 2:
      return "grid-cols-1 sm:grid-cols-2";
    case 3:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    case 4:
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    default:
      return "grid-cols-1";
  }
});

const colSpanClass = (span?: number | "full") => {
  if (!span) return "";
  if (span === "full") return "col-span-full";
  switch (span) {
    case 2:
      return "sm:col-span-2";
    case 3:
      return "lg:col-span-3";
    case 4:
      return "lg:col-span-4";
    default:
      return "col-span-1";
  }
};

const slotProps = computed(() => ({
  values: form.values,
  errors: form.errors.value,
  meta: form.meta.value,
  isSubmitting: form.isSubmitting.value,
  isValidating: form.isValidating.value,
  isBusy: isBusy.value,
  submitCount: form.submitCount.value,
  submit: onSubmit,
  reset: onReset,
  validate: form.validate,
  validateField: form.validateField,
  setFieldValue: form.setFieldValue,
  setFieldError: form.setFieldError,
  setValues: form.setValues,
  setErrors: form.setErrors,
  resetForm: form.resetForm,
}));

defineExpose({
  form,
  values: form.values,
  errors: form.errors,
  meta: form.meta,
  submit: onSubmit,
  reset: onReset,
  validate: form.validate,
  validateField: form.validateField,
  setFieldValue: form.setFieldValue,
  setFieldError: form.setFieldError,
  setValues: form.setValues,
  setErrors: form.setErrors,
  resetForm: form.resetForm,
});
</script>