<script setup lang="ts">
import { navLinksArray } from "@/constants/routes";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <nav class="flex flex-col gap-5 text-gray-600">
    <RouterLink
      v-for="(link, i) in navLinksArray"
      class="hover:text-text-primary"
      :class="{ 'text-text-primary': route.path === link.to }"
      :key="i + link.label"
      :to="link.to"
    >
      {{ link.label }}
    </RouterLink>
  </nav>
</template>

<style scoped></style>
