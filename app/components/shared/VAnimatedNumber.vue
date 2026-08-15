<template>
  <span
    class="inline-flex items-baseline tabular-nums"
    :style="{ '--roll-duration': `${duration}ms` }"
    :aria-label="String(value)"
  >
    <!-- Only digits roll; separators (":", ",", ".") stay put so the string
         doesn't shimmer as a whole. -->
    <template v-for="(char, index) in chars" :key="index">
      <span v-if="isDigit(char)" class="roll-cell">
        <Transition :name="`roll-${direction}`">
          <span :key="char" class="roll-digit" aria-hidden="true">{{
            char
          }}</span>
        </Transition>
      </span>
      <span v-else aria-hidden="true">{{ char }}</span>
    </template>
  </span>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    /** Rendered as-is; digits animate, everything else is printed. */
    value: string | number;
    /** Roll duration in ms. */
    duration?: number;
  }>(),
  {
    duration: 400,
  },
);

const chars = computed(() => String(props.value).split(""));

const isDigit = (char: string) => char >= "0" && char <= "9";

// Digits roll upwards when the value grows and downwards when it shrinks, so a
// counter ticking back down reads as going back rather than forward.
const direction = ref<"up" | "down">("up");

watch(
  () => props.value,
  (next, previous) => {
    const to = Number(next);
    const from = Number(previous);
    if (Number.isNaN(to) || Number.isNaN(from) || to === from) return;
    direction.value = to > from ? "up" : "down";
  },
);
</script>

<style scoped>
.roll-cell {
  position: relative;
  display: inline-block;
  /* 1ch is the width of "0", and tabular-nums makes every digit match it. */
  width: 1ch;
  overflow: hidden;
  text-align: center;
  vertical-align: bottom;
}

.roll-digit {
  display: block;
}

.roll-up-enter-active,
.roll-up-leave-active,
.roll-down-enter-active,
.roll-down-leave-active {
  transition:
    transform var(--roll-duration, 400ms) cubic-bezier(0.22, 1, 0.36, 1),
    opacity var(--roll-duration, 400ms) ease;
}

/* The outgoing digit leaves the flow so the incoming one isn't pushed aside. */
.roll-up-leave-active,
.roll-down-leave-active {
  position: absolute;
  inset-inline-start: 0;
  top: 0;
  width: 100%;
}

.roll-up-enter-from,
.roll-down-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.roll-up-leave-to,
.roll-down-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .roll-up-enter-active,
  .roll-up-leave-active,
  .roll-down-enter-active,
  .roll-down-leave-active {
    transition: none;
  }
}
</style>