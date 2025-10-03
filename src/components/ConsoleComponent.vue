<script setup lang="ts">
import { codeToHtml } from "shiki";

interface Props {
  code: string;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Terminal",
});

import { ref, onMounted } from "vue";

const formattedCode = ref<string>("");

onMounted(async () => {
  formattedCode.value = await codeToHtml(props.code, {
    lang: "typescript",
    theme: "github-dark",
  });
});
</script>

<template>
  <div class="w-full max-w-[600px] bg-console-bg p-7 text-console-text rounded-2xl">
    <div class="flex items-center gap-2 mb-4 -mt-3 -ml-2">
      <span class="w-3 h-3 rounded-full bg-red-500"></span>
      <span class="w-3 h-3 rounded-full bg-yellow-400"></span>
      <span class="w-3 h-3 rounded-full bg-green-500"></span>
      <span class="ml-2 text-sm text-gray-400">{{ title }}</span>
    </div>
    <pre class="shiki" v-html="formattedCode"></pre>
  </div>
</template>
