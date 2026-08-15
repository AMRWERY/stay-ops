<template>
  <component
    :is="tag"
    v-bind="tagBindings"
    :class="[
      baseClasses,
      variantClasses,
      sizeClasses,
      roundedClasses,
      block ? 'w-full' : '',
      // A disabled link renders as a <span>, which the `disabled:` variants
      // can't reach — so the same look is applied directly.
      isDisabled && !isButton ? 'opacity-60 cursor-not-allowed' : '',
    ]"
    @click="onClick"
  >
    <!-- Leading icon (replaced by the spinner while loading) -->
    <slot name="leading">
      <Icon
        v-if="loading"
        :name="loadingIcon"
        :class="[resolvedIconClass, 'animate-spin shrink-0']"
      />
      <Icon
        v-else-if="icon"
        :name="icon"
        :class="[resolvedIconClass, 'shrink-0']"
      />
    </slot>

    <slot>
      <span v-if="displayLabel">{{ displayLabel }}</span>
    </slot>

    <slot name="trailing">
      <Icon
        v-if="trailingIcon"
        :name="trailingIcon"
        :class="[resolvedIconClass, 'shrink-0']"
      />
    </slot>
  </component>
</template>

<script lang="ts" setup>
import type {
  ButtonTo,
  ButtonVariant,
  ButtonSize,
  ButtonRounded,
  ButtonType,
} from "@/types/shared/VButton";

const props = withDefaults(
  defineProps<{
    /** Internal route. Rendered with <nuxt-link-locale>, so pass an unprefixed path ("/inventory"). */
    to?: ButtonTo;
    /** External URL. Rendered as a plain <a>. */
    href?: string;
    target?: string;
    /** Defaults to "noopener noreferrer" when target is "_blank". */
    rel?: string;
    /** Only applies when the button renders as a <button>. */
    type?: ButtonType;
    variant?: ButtonVariant;
    size?: ButtonSize;
    rounded?: ButtonRounded;
    /** Stretch to the full width of the parent. */
    block?: boolean;
    /** Text content. The default slot wins when both are given. */
    label?: string;
    /** Iconify name (https://icones.js.org) shown before the label. */
    icon?: string;
    /** Iconify name shown after the label. */
    trailingIcon?: string;
    /** Overrides the size-derived icon dimensions, e.g. "w-6 h-6". */
    iconClass?: string;
    /** Swaps the leading icon for a spinner and blocks interaction. */
    loading?: boolean;
    loadingIcon?: string;
    /** Label shown instead of `label` while loading, e.g. "Signing in…". */
    loadingText?: string;
    disabled?: boolean;
  }>(),
  {
    type: "button",
    variant: "primary",
    size: "md",
    rounded: "md",
    block: false,
    loading: false,
    loadingIcon: "lucide:loader-circle",
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const slots = useSlots();

const isDisabled = computed(() => props.disabled || props.loading);

/**
 * Links keep their semantics only while they're usable — a disabled <a> is
 * still followable, so it degrades to a <span> carrying aria-disabled.
 */
const tag = computed(() => {
  if (!props.to && !props.href) return "button";
  if (isDisabled.value) return "span";
  if (props.href) return "a";
  return resolveComponent("NuxtLinkLocale");
});

const isButton = computed(() => tag.value === "button");

const tagBindings = computed<Record<string, unknown>>(() => {
  if (isButton.value) {
    return { type: props.type, disabled: isDisabled.value };
  }

  if (isDisabled.value) {
    return { role: "link", "aria-disabled": "true" };
  }

  const rel =
    props.rel ??
    (props.target === "_blank" ? "noopener noreferrer" : undefined);

  if (props.href) {
    return { href: props.href, target: props.target, rel };
  }

  return { to: props.to, target: props.target, rel };
});

const displayLabel = computed(() =>
  props.loading && props.loadingText ? props.loadingText : props.label,
);

const hasLabel = computed(() => Boolean(displayLabel.value || slots.default));

// "plain" opts out of every visual class so chrome buttons (header icons, the
// sidebar close button…) can be styled from the call site without fighting
// Tailwind class conflicts — only behaviour-critical classes stay.
const isPlain = computed(() => props.variant === "plain");

const baseClasses = computed(() => [
  "inline-flex items-center transition-colors duration-200",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a35e] focus-visible:ring-offset-1",
  "disabled:opacity-60 disabled:cursor-not-allowed",
  // Left out of "plain" so the call site can pick its own alignment and weight
  // without a Tailwind class conflict.
  isPlain.value ? "" : "justify-center font-medium",
]);

const variantClasses = computed(() => {
  switch (props.variant) {
    case "secondary":
      return "bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50";
    case "outline":
      return "border border-[#c5a35e] text-[#c5a35e] bg-transparent hover:bg-[#c5a35e]/10";
    case "ghost":
      return "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
    case "danger":
      return "bg-[#b4472a] text-white shadow-sm hover:bg-[#9c3c23]";
    case "link":
      return "text-[#c5a35e] hover:text-[#b39150] underline-offset-4 hover:underline";
    case "plain":
      return "";
    case "primary":
    default:
      return "bg-[#c5a35e] text-white shadow-sm hover:bg-[#b39150]";
  }
});

// Icon-only buttons get square padding so they don't render as a wide pill.
const sizeClasses = computed(() => {
  if (isPlain.value) return "";

  const gapAndText = {
    xs: "gap-1.5 text-xs",
    sm: "gap-1.5 text-sm",
    md: "gap-2 text-sm",
    lg: "gap-2.5 text-base",
  }[props.size];

  if (props.variant === "link") return gapAndText;

  const padding = hasLabel.value
    ? {
        xs: "px-2.5 py-1",
        sm: "px-3 py-1.5",
        md: "px-4 py-2.5",
        lg: "px-5 py-3",
      }[props.size]
    : { xs: "p-1", sm: "p-1.5", md: "p-2", lg: "p-2.5" }[props.size];

  return `${gapAndText} ${padding}`;
});

const roundedClasses = computed(() => {
  if (isPlain.value) return "";
  switch (props.rounded) {
    case "none":
      return "rounded-none";
    case "sm":
      return "rounded";
    case "lg":
      return "rounded-lg";
    case "full":
      return "rounded-full";
    case "card":
      return "rounded-card";
    case "md":
    default:
      return "rounded-md";
  }
});

// `iconClass` replaces the default rather than merging with it, so a caller
// passing "w-6 h-6" can't lose to the size default in the generated CSS.
const resolvedIconClass = computed(() => {
  if (props.iconClass) return props.iconClass;
  return {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[props.size];
});

const onClick = (event: MouseEvent) => {
  if (isDisabled.value) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  emit("click", event);
};
</script>