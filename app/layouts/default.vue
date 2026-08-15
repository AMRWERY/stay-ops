<template>
  <div class="flex min-h-screen bg-[#f8f7f4] font-sans text-slate-900">
    <Sidebar />

    <main class="flex-1 flex flex-col h-screen overflow-hidden">
      <Header />

      <!-- Scrollable page area -->
      <div class="flex-1 overflow-y-auto px-6 lg:px-10 pb-10 py-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup></script>
