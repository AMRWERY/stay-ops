<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="open"
        class="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center"
      >
        <!-- Translucent Ink scrim, per docs/design.md §6 -->
        <div
          class="dialog-scrim absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
          aria-hidden="true"
          @click="onScrimClick"
        />

        <div
          ref="panel"
          :class="[
            'dialog-panel relative flex w-full flex-col overflow-hidden rounded-card bg-white shadow-2xl focus:outline-none',
            'max-h-[calc(100vh-2rem)]',
            sizeClass,
          ]"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          :aria-labelledby="title ? titleId : undefined"
          :aria-describedby="description ? descriptionId : undefined"
          @keydown="onKeydown"
        >
          <slot name="header">
            <div
              v-if="title || description || !hideClose"
              class="flex items-start justify-between gap-4 border-b border-mist px-6 py-5"
            >
              <div class="min-w-0">
                <h2
                  v-if="title"
                  :id="titleId"
                  class="font-display text-lg font-semibold text-ink"
                >
                  {{ title }}
                </h2>
                <p
                  v-if="description"
                  :id="descriptionId"
                  class="mt-1 text-sm text-slate"
                >
                  {{ description }}
                </p>
              </div>

              <LazyVButton
                v-if="!hideClose"
                variant="plain"
                icon="lucide:x"
                icon-class="w-5 h-5"
                class="-me-1.5 -mt-0.5 shrink-0 rounded-md p-1 text-slate-light hover:bg-linen hover:text-ink"
                aria-label="Close dialog"
                @click="close('close')"
              />
            </div>
          </slot>

          <div class="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <slot />
          </div>

          <slot name="footer">
            <div
              v-if="confirmLabel || cancelLabel"
              class="flex flex-col-reverse gap-3 border-t border-mist bg-linen/50 px-6 py-4 sm:flex-row sm:justify-end"
            >
              <LazyVButton
                v-if="cancelLabel"
                variant="ghost"
                :label="cancelLabel"
                :disabled="loading"
                @click="close('cancel')"
              />
              <LazyVButton
                v-if="confirmLabel"
                :variant="confirmVariant"
                :label="confirmLabel"
                :loading="loading"
                @click="$emit('confirm')"
              />
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { DialogSize } from "@/types/shared/VDialog";
import type { ButtonVariant } from "@/types/shared/VButton";

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    size?: DialogSize;
    /** Block dismissal by scrim click and Escape, e.g. during a submit. */
    persistent?: boolean;
    hideClose?: boolean;
    /** Renders the default footer. Omit both labels to use the footer slot. */
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: ButtonVariant;
    /** Spins the confirm button and blocks the cancel. */
    loading?: boolean;
  }>(),
  {
    size: "sm",
    persistent: false,
    hideClose: false,
    confirmVariant: "primary",
    loading: false,
  },
);

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
  (e: "close"): void;
}>();

const open = defineModel<boolean>({ default: false });

const uid = useId();
const titleId = `${uid}-title`;
const descriptionId = `${uid}-description`;

const panel = ref<HTMLElement | null>(null);

// 384px default matches the confirmation/form width in the design doc.
const sizeClass = computed(
  () =>
    ({
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-2xl",
    })[props.size],
);

const close = (reason: "cancel" | "close") => {
  if (props.loading) return;
  emit(reason);
  open.value = false;
};

const onScrimClick = () => {
  if (props.persistent) return;
  close("close");
};

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const focusableItems = () =>
  Array.from(
    panel.value?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
  ).filter((el) => el.offsetParent !== null);

/**
 * Tab is cycled inside the panel by hand. A modal that lets focus wander into
 * the page behind it is unusable by keyboard, and the browser only does this
 * for itself with <dialog>.showModal(), which can't be animated the same way.
 */
const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== "Tab") return;

  const items = focusableItems();
  if (!items.length) return;

  const first = items[0]!;
  const last = items[items.length - 1]!;
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
};

onKeyStroke("Escape", () => {
  if (!open.value || props.persistent) return;
  close("close");
});

let previouslyFocused: HTMLElement | null = null;

watch(open, async (isOpen) => {
  if (import.meta.server) return;

  if (isOpen) {
    // Remember where focus came from so it can be handed back on close —
    // otherwise the keyboard user is dropped at the top of the document.
    previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    await nextTick();
    // A form dialog should open on its first field, not on the close button
    // that happens to come first in the DOM. With no fields, the panel itself
    // takes focus so the title is announced.
    const firstField = panel.value?.querySelector<HTMLElement>(
      "input:not([disabled]),select:not([disabled]),textarea:not([disabled])",
    );
    (firstField ?? panel.value)?.focus();
    return;
  }

  document.body.style.overflow = "";
  previouslyFocused?.focus?.();
});

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = "";
});
</script>

<style scoped>
/* Scrim and panel animate separately: the scrim just fades, the panel rises
   and settles with an ease-out curve so it reads as arriving, not appearing. */
.dialog-enter-active .dialog-scrim,
.dialog-leave-active .dialog-scrim {
  transition: opacity 200ms ease;
}

.dialog-enter-from .dialog-scrim,
.dialog-leave-to .dialog-scrim {
  opacity: 0;
}

.dialog-enter-active .dialog-panel {
  transition:
    opacity 220ms ease,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.dialog-leave-active .dialog-panel {
  transition:
    opacity 150ms ease,
    transform 150ms ease-in;
}

.dialog-enter-from .dialog-panel {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

.dialog-leave-to .dialog-panel {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

@media (prefers-reduced-motion: reduce) {
  .dialog-enter-active .dialog-panel,
  .dialog-leave-active .dialog-panel {
    transition: opacity 120ms ease;
    transform: none;
  }

  .dialog-enter-from .dialog-panel,
  .dialog-leave-to .dialog-panel {
    transform: none;
  }
}
</style>