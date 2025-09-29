<script setup lang="ts">
import { ref } from "vue";
import NavBar from "@/components/NavBar.vue";

const sidebarVisible = ref(true);

function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value;
}
</script>

<template>
  <div class="w-full flex">
    <sidebar
      :class="[
        'flex flex-col relative w-[330px] bg-white h-[100dvh] shadow-lg z-0 p-5 pl-8 transition-transform duration-300 ease-in-out',
        sidebarVisible ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <button
        class="absolute top-4 -right-6 z-10 bg-gray-200 px-3 py-1 rounded-full shadow cursor-pointer"
        @click="toggleSidebar"
      >
        <span v-if="sidebarVisible" aria-label="Hide sidebar">&#x292B;</span>
        <span v-else aria-label="Show sidebar">&#x27F6;</span>
      </button>
      <h1 class="max-w-[150px] mb-10 text-xl text-text-primary font-bold">Perfomance Playground</h1>
      <NavBar />
    </sidebar>
    <main class="flex w-full p-4">
      <slot />
    </main>
  </div>
</template>
