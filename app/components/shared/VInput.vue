<template>
  <div :class="['w-full flex flex-col gap-1.5', containerClass]">
    <!-- Label -->
    <label
      v-if="label || $slots.label"
      :for="inputId"
      :class="[
        'block text-sm font-medium text-slate-700 transition-colors',
        displayError ? 'text-red-600' : '',
        disabled ? 'opacity-60 cursor-not-allowed' : '',
        labelClass,
      ]"
    >
      <slot name="label">
        {{ label }}
        <span v-if="required" class="text-red-500 ms-0.5" aria-hidden="true"
          >*</span
        >
      </slot>
    </label>

    <!-- Outer Input Wrapper (with Prepend / Append slots) -->
    <div class="relative flex items-center w-full">
      <!-- Prepend Slot -->
      <div v-if="$slots.prepend" class="flex-shrink-0 flex items-center pe-2">
        <slot name="prepend" />
      </div>

      <!-- Checkbox Type -->
      <template v-if="type === 'checkbox'">
        <label
          :class="[
            'inline-flex items-center gap-2.5 cursor-pointer select-none',
            disabled ? 'opacity-60 cursor-not-allowed' : '',
          ]"
        >
          <input
            :id="inputId"
            type="checkbox"
            v-model="internalValue"
            :disabled="disabled"
            :required="required"
            :class="[
              'w-4 h-4 rounded border-slate-300 text-[#c5a35e] focus:ring-[#c5a35e] transition-colors',
              displayError ? 'border-red-500 focus:ring-red-500' : '',
              inputClass,
            ]"
            v-bind="$attrs"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
          />
          <span v-if="hint && !label" class="text-sm text-slate-600">{{
            hint
          }}</span>
        </label>
      </template>

      <!-- Switch / Toggle Type -->
      <template v-else-if="type === 'switch'">
        <label
          :class="[
            'inline-flex items-center gap-3 cursor-pointer select-none',
            disabled ? 'opacity-60 cursor-not-allowed' : '',
          ]"
        >
          <div class="relative inline-flex items-center">
            <input
              :id="inputId"
              type="checkbox"
              v-model="internalValue"
              :disabled="disabled"
              class="sr-only peer"
              v-bind="$attrs"
              @change="onChange"
              @focus="onFocus"
              @blur="onBlur"
            />
            <div
              class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#c5a35e]/40 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c5a35e]"
            ></div>
          </div>
          <span v-if="hint && !label" class="text-sm text-slate-600">{{
            hint
          }}</span>
        </label>
      </template>

      <!-- Radio / Radio Group Type -->
      <template v-else-if="type === 'radio'">
        <div v-if="normalizedOptions.length" class="flex flex-wrap gap-4">
          <label
            v-for="(opt, idx) in normalizedOptions"
            :key="idx"
            :class="[
              'inline-flex items-center gap-2 cursor-pointer select-none',
              disabled || opt.disabled ? 'opacity-60 cursor-not-allowed' : '',
            ]"
          >
            <input
              :id="`${inputId}-${idx}`"
              type="radio"
              :name="name || inputId"
              :value="opt.value"
              v-model="internalValue"
              :disabled="disabled || opt.disabled"
              class="w-4 h-4 text-[#c5a35e] border-slate-300 focus:ring-[#c5a35e] transition-colors"
              v-bind="$attrs"
              @change="onChange"
              @focus="onFocus"
              @blur="onBlur"
            />
            <span class="text-sm text-slate-700">{{ opt.label }}</span>
          </label>
        </div>
        <label
          v-else
          :class="[
            'inline-flex items-center gap-2 cursor-pointer select-none',
            disabled ? 'opacity-60 cursor-not-allowed' : '',
          ]"
        >
          <input
            :id="inputId"
            type="radio"
            :name="name"
            :value="value"
            v-model="internalValue"
            :disabled="disabled"
            class="w-4 h-4 text-[#c5a35e] border-slate-300 focus:ring-[#c5a35e] transition-colors"
            v-bind="$attrs"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
          />
        </label>
      </template>

      <!-- Select Type -->
      <template v-else-if="type === 'select'">
        <div class="relative w-full">
          <!-- Prefix Icon for Select -->
          <span
            v-if="prefixIcon || $slots.prefix || $slots.leading"
            class="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center z-10"
          >
            <slot name="prefix">
              <slot name="leading">
                <Icon
                  v-if="prefixIcon"
                  :name="prefixIcon"
                  :class="iconSizeClass"
                />
              </slot>
            </slot>
          </span>

          <select
            :id="inputId"
            v-model="internalValue"
            :disabled="disabled"
            :required="required"
            :class="[
              inputBaseClasses,
              sizeClasses,
              variantClasses,
              prefixIcon || $slots.prefix || $slots.leading ? 'ps-10' : '',
              'pe-10 appearance-none cursor-pointer',
              displayError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : '',
              inputClass,
            ]"
            v-bind="$attrs"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
          >
            <slot name="options">
              <option v-if="placeholder" value="" disabled selected>
                {{ placeholder }}
              </option>
              <option
                v-for="(opt, idx) in normalizedOptions"
                :key="idx"
                :value="opt.value"
                :disabled="opt.disabled"
              >
                {{ opt.label }}
              </option>
            </slot>
          </select>

          <!-- Chevron Down Icon -->
          <span
            class="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center"
          >
            <Icon name="heroicons:chevron-down" :class="iconSizeClass" />
          </span>
        </div>
      </template>

      <!-- Textarea Type -->
      <template v-else-if="type === 'textarea'">
        <textarea
          :id="inputId"
          v-model="internalValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :rows="rows"
          :cols="cols"
          :class="[
            inputBaseClasses,
            sizeClasses,
            variantClasses,
            resizeClasses,
            displayError
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : '',
            inputClass,
          ]"
          v-bind="$attrs"
          @input="onInput"
          @change="onChange"
          @focus="onFocus"
          @blur="onBlur"
        />
      </template>

      <!-- Standard Input Types (text, email, password, number, date, etc.) -->
      <template v-else>
        <div class="relative flex items-center w-full">
          <!-- Prefix Icon / Slot -->
          <span
            v-if="prefixIcon || $slots.prefix || $slots.leading"
            class="absolute start-3.5 text-slate-400 pointer-events-none flex items-center z-10"
          >
            <slot name="prefix">
              <slot name="leading">
                <Icon
                  v-if="prefixIcon"
                  :name="prefixIcon"
                  :class="iconSizeClass"
                />
              </slot>
            </slot>
          </span>

          <input
            :id="inputId"
            :type="computedType"
            v-model="internalValue"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :required="required"
            :min="min"
            :max="max"
            :step="step"
            :autocomplete="autocomplete"
            :autofocus="autofocus"
            :class="[
              inputBaseClasses,
              sizeClasses,
              variantClasses,
              prefixIcon || $slots.prefix || $slots.leading ? 'ps-10' : '',
              hasSuffixArea ? 'pe-10' : '',
              displayError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : '',
              inputClass,
            ]"
            v-bind="$attrs"
            @input="onInput"
            @change="onChange"
            @focus="onFocus"
            @blur="onBlur"
          />

          <!-- Suffix Area (Clear / Password Toggle / Custom Icon / Slot) -->
          <div
            v-if="hasSuffixArea"
            class="absolute end-3 flex items-center gap-1.5 text-slate-400 z-10"
          >
            <!-- Clear Button -->
            <VButton
              v-if="clearable && hasValue && !disabled && !readonly"
              variant="plain"
              icon="heroicons:x-mark"
              icon-class="w-4 h-4"
              class="p-0.5 rounded hover:text-slate-600"
              title="Clear input"
              aria-label="Clear input"
              @click="clearInput"
            />

            <!-- Password Show/Hide Toggle -->
            <VButton
              v-if="type === 'password' && showPasswordToggle"
              variant="plain"
              :icon="
                isPasswordVisible ? 'heroicons:eye-slash' : 'heroicons:eye'
              "
              :icon-class="iconSizeClass"
              class="p-0.5 rounded hover:text-slate-600"
              :title="isPasswordVisible ? 'Hide password' : 'Show password'"
              :aria-label="
                isPasswordVisible ? 'Hide password' : 'Show password'
              "
              @click="isPasswordVisible = !isPasswordVisible"
            />

            <!-- Suffix Icon or Slot -->
            <slot name="suffix">
              <slot name="trailing">
                <Icon
                  v-if="suffixIcon && type !== 'password'"
                  :name="suffixIcon"
                  :class="iconSizeClass"
                />
              </slot>
            </slot>
          </div>
        </div>
      </template>

      <!-- Append Slot -->
      <div v-if="$slots.append" class="flex-shrink-0 flex items-center ps-2">
        <slot name="append" />
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="displayError || $slots.error"
      class="flex items-center gap-1 text-xs text-red-500 mt-0.5"
      role="alert"
    >
      <Icon
        name="heroicons:exclamation-triangle"
        class="w-3.5 h-3.5 flex-shrink-0"
      />
      <span>
        <slot name="error" :error="displayError">
          {{
            typeof displayError === "string"
              ? displayError
              : "This field is invalid"
          }}
        </slot>
      </span>
    </div>

    <!-- Hint / Help Text (only if no error) -->
    <p
      v-else-if="
        (hint || $slots.hint) && type !== 'checkbox' && type !== 'switch'
      "
      class="text-xs text-slate-500 mt-0.5"
    >
      <slot name="hint">
        {{ hint }}
      </slot>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import type { RuleExpression } from "vee-validate";
import type {
  OptionItem,
  InputType,
  InputSize,
  InputVariant,
} from "@/types/shared/VInput";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue?: any;
    value?: any;
    type?: InputType;
    label?: string;
    id?: string;
    name?: string;
    placeholder?: string;
    hint?: string;
    error?: string | boolean;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    size?: InputSize;
    variant?: InputVariant;
    options?: (OptionItem | string | number)[];
    rows?: number | string;
    cols?: number | string;
    resize?: boolean | "none" | "y" | "x" | "both";
    prefixIcon?: string;
    suffixIcon?: string;
    showPasswordToggle?: boolean;
    clearable?: boolean;
    min?: number | string;
    max?: number | string;
    step?: number | string;
    autocomplete?: string;
    autofocus?: boolean;
    containerClass?: string;
    labelClass?: string;
    inputClass?: string;
    /**
     * vee-validate rules for this field: a validator function (see
     * app/utils/validators.ts), an array of them, or a yup/zod schema.
     * Ignored when the parent VFormWrapper supplies a validation schema.
     */
    rules?: RuleExpression<any>;
    /** Register the field but keep it out of the parent form's values/validation. */
    standalone?: boolean;
    /** Re-validate on every value change. Set false to only validate on blur/submit. */
    validateOnValueUpdate?: boolean;
    /** Validate when the control loses focus. */
    validateOnBlur?: boolean;
    validateOnMount?: boolean;
    /** Keep the value in the form after this input unmounts. */
    keepValueOnUnmount?: boolean;
  }>(),
  {
    type: "text",
    size: "md",
    variant: "default",
    showPasswordToggle: true,
    clearable: false,
    required: false,
    disabled: false,
    readonly: false,
    options: () => [],
    rows: 3,
    resize: "y",
    standalone: false,
    validateOnValueUpdate: true,
    validateOnBlur: true,
    validateOnMount: false,
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "change", event: Event): void;
  (e: "input", event: Event): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
  (e: "clear"): void;
}>();

// Generate unique ID for input label pairing fallback
const defaultId = useId
  ? useId()
  : `v-input-${Math.random().toString(36).slice(2, 9)}`;
const inputId = computed(() => props.id || defaultId);

// Password visibility state
const isPasswordVisible = ref(false);

const computedType = computed(() => {
  if (props.type === "password" && isPasswordVisible.value) {
    return "text";
  }
  return props.type;
});

/**
 * vee-validate integration.
 *
 * The field is always created so the value plumbing is identical everywhere,
 * but it only registers with a parent form (and therefore participates in the
 * form's values, validation and submit) when it has a `name` and isn't marked
 * standalone. Without a parent form it behaves as a plain v-model input, with
 * `rules` still applied locally.
 */
const isControlled = computed(() => Boolean(props.name) && !props.standalone);
const fieldPath = computed(() => props.name || inputId.value);

// `required` alone gives the field a sensible rule when none was provided.
const fieldRules = computed<RuleExpression<any>>(() => {
  if (props.rules) return props.rules;
  if (props.required) return formRules.required();
  return undefined;
});

const {
  value: internalValue,
  errorMessage,
  meta: fieldMeta,
  handleBlur: fieldHandleBlur,
  setValue: setFieldValue,
  validate: validateField,
  resetField,
} = useField<any>(fieldPath, fieldRules, {
  initialValue: props.modelValue !== undefined ? props.modelValue : props.value,
  label: computed(() => props.label),
  controlled: isControlled.value,
  syncVModel: true,
  validateOnValueUpdate: props.validateOnValueUpdate,
  validateOnMount: props.validateOnMount,
  keepValueOnUnmount: computed(() => props.keepValueOnUnmount),
});

// An explicit `error` prop always wins over the validation result.
const displayError = computed<string | boolean | undefined>(() => {
  if (
    props.error !== undefined &&
    props.error !== false &&
    props.error !== ""
  ) {
    return props.error;
  }
  return errorMessage.value;
});

const hasValue = computed(() => {
  return (
    internalValue.value !== undefined &&
    internalValue.value !== null &&
    internalValue.value !== ""
  );
});

// Normalize options for select and radio types
const normalizedOptions = computed<OptionItem[]>(() => {
  return (props.options || []).map((opt) => {
    if (typeof opt === "object" && opt !== null && "label" in opt) {
      return {
        label: String(opt.label),
        value: opt.value,
        disabled: Boolean(opt.disabled),
      };
    }
    return {
      label: String(opt),
      value: opt,
      disabled: false,
    };
  });
});

// Check suffix area display condition
const hasSuffixArea = computed(() => {
  return (
    Boolean(props.suffixIcon) ||
    Boolean(props.type === "password" && props.showPasswordToggle) ||
    Boolean(
      props.clearable && hasValue.value && !props.disabled && !props.readonly,
    )
  );
});

// Styling mapping
const inputBaseClasses = computed(() => {
  return "w-full transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100";
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "px-3 py-1.5 text-xs rounded";
    case "lg":
      return "px-4 py-3 text-base rounded-lg";
    case "md":
    default:
      return "px-4 py-2.5 text-sm rounded-md";
  }
});

const iconSizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-4 h-4";
    case "lg":
      return "w-6 h-6";
    case "md":
    default:
      return "w-5 h-5";
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case "filled":
      return "border border-transparent bg-slate-100 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#c5a35e] focus:ring-1 focus:ring-[#c5a35e]";
    case "flushed":
      return "border-b border-slate-200 rounded-none bg-transparent px-0 text-slate-800 placeholder:text-slate-400 focus:border-[#c5a35e] focus:ring-0";
    case "outlined":
      return "border-2 border-slate-300 bg-transparent text-slate-800 placeholder:text-slate-400 focus:border-[#c5a35e]";
    case "default":
    default:
      return "border border-slate-200 bg-white text-slate-700 placeholder:text-slate-400 focus:border-[#c5a35e] focus:ring-1 focus:ring-[#c5a35e]";
  }
});

const resizeClasses = computed(() => {
  if (props.resize === false || props.resize === "none") return "resize-none";
  if (props.resize === "x") return "resize-x";
  if (props.resize === "both") return "resize";
  return "resize-y";
});

// Event handlers
const onInput = (event: Event) => {
  emit("input", event);
};

const onChange = (event: Event) => {
  emit("change", event);
};

const onFocus = (event: FocusEvent) => {
  emit("focus", event);
};

const onBlur = (event: FocusEvent) => {
  // Marks the field as touched, and validates when validateOnBlur is enabled.
  fieldHandleBlur(event, props.validateOnBlur);
  emit("blur", event);
};

const clearInput = () => {
  setFieldValue("", props.validateOnValueUpdate);
  emit("clear");
};

defineExpose({
  value: internalValue,
  meta: fieldMeta,
  errorMessage,
  validate: validateField,
  setValue: setFieldValue,
  reset: resetField,
});
</script>