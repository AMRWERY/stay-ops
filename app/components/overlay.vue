<template>
  <Transition name="overlay">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[#0B1929]/85 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="relative flex items-center justify-center">
        <!-- Brass arc orbiting the mark -->
        <span
          class="absolute w-24 h-24 rounded-full border-2 border-[#C7A257]/20 border-t-[#C7A257] animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
        <img
          src="/svg/logo.svg"
          alt=""
          class="w-16 h-16 overlay-mark"
          aria-hidden="true"
        />
      </div>

      <p v-if="message" class="text-sm text-slate-300 px-6 text-center">
        {{ message }}
      </p>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const { isVisible, message } = useOverlay();

// The overlay usually covers a navigation, so Escape can't dismiss it — but a
// scrollbar reappearing underneath is visible through the blur.
watch(isVisible, (visible) => {
  if (import.meta.server) return;
  document.body.style.overflow = visible ? "hidden" : "";
});

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = "";
});
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
  transition:
    opacity 250ms ease,
    backdrop-filter 250ms ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-mark {
  animation: overlay-breathe 1.8s ease-in-out infinite;
}

@keyframes overlay-breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .overlay-mark {
    animation: none;
  }
}
</style>