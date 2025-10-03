<script setup lang="ts">
import * as t from "@babel/types";
import * as babelParser from "@babel/parser";
import traverse, { type NodePath } from "@babel/traverse";
import { CodeEditor, type EditorError, type EditorLifecycleHooks } from "monaco-editor-vue3";
import { ref, watch } from "vue";
import type { editor } from "monaco-editor";
import * as monaco from "monaco-editor";

import MainLayout from "@/layouts/MainLayout.vue";

const code = ref<string>(`console.log('Start');

setTimeout(() => { 
  console.log('Timeout callback'); 
}, 0);

Promise.resolve().then(() => { 
  console.log('Promise resolved'); 
});

console.log('End');`);

const editorError = ref<EditorError | null>(null);
const monacoEditor = ref<editor.IStandaloneCodeEditor | null>(null);
let decorationsCollection: monaco.editor.IEditorDecorationsCollection | null = null;

const lifecycleHooks: EditorLifecycleHooks = {
  onReady: (editor) => {
    monacoEditor.value = editor;
    decorationsCollection = editor.createDecorationsCollection();
    console.log("Editor is ready:", editor);
  },
};

const handleError = (error: EditorError | null) => {
  editorError.value = error;
  if (error) {
    console.error("Editor error:", error);
  }
};

function highlightLine(lineNumber: number, className = "highlight-execution") {
  if (!decorationsCollection) return;

  decorationsCollection.set([
    {
      range: new monaco.Range(lineNumber, 1, lineNumber, 1),
      options: {
        isWholeLine: true,
        className,
        glyphMarginClassName: "highlight-glyph",
      },
    },
  ]);
  console.log(decorationsCollection);
}

function highlightLines(lineNumbers: number[], className = "highlight-execution") {
  if (!decorationsCollection) return;

  decorationsCollection.clear();

  const decorationOptions = lineNumbers.map((lineNumber) => ({
    range: new monaco.Range(lineNumber, 1, lineNumber, 1),
    options: {
      isWholeLine: true,
      className: className,
      glyphMarginClassName: "highlight-glyph",
    },
  }));

  decorationsCollection.set(decorationOptions);
}

function clearHighlights() {
  if (!decorationsCollection) return;
  decorationsCollection.clear();
}

function simulateExecution() {
  const executionOrder = [1, 3, 7, 9]; // Line numbers in execution order
  let currentStep = 0;

  const interval = setInterval(() => {
    if (currentStep < executionOrder.length) {
      highlightLine(executionOrder[currentStep]);
      currentStep++;
    } else {
      clearInterval(interval);
      setTimeout(clearHighlights, 1000); // Clear after 1 second
    }
  }, 1000);
}
type NodePath<T = t.Node> = {
  node: T;
  parent: t.Node;
  parentPath: NodePath | null;
};

function parseCode(codeStr: string) {
  const ast = babelParser.parse(codeStr, {
    sourceType: "module",
    plugins: ["typescript"],
  });

  const result: object[] = [];

  traverse(ast, {
    CallExpression(path: NodePath<t.CallExpression>) {
      const callee = path.node.callee;
      console.log(path.node);

      if (callee.type === "MemberExpression") {
        const objName = callee.object.type === "Identifier" ? callee.object.name : null;
        const propName = callee.property.type === "Identifier" ? callee.property.name : null;

        if (objName === "console" && propName === "log") {
          result.push({
            type: "sync",
            name: "console.log",
            location: [callee.loc.start.line, callee.loc.end.line],
          });
        }
        if (objName === "setTimeout") {
          result.push({
            type: "task",
            name: "setTimeout",
            location: [callee.loc.start.line, callee.loc.end.line],
          });
        }
        if (objName === "Promise" && propName === "resolve") {
          result.push({
            type: "microtask",
            name: "Promise.then",
            location: [callee.loc.start.line, callee.loc.end.line],
          });
        }
      }
      if (callee.type === "Identifier") {
        result.push({
          type: "sync",
          name: callee.name + "()",
          location: [callee.loc?.start.line, callee.loc?.end.line],
        });
      }
    },
  });

  return result;
}

watch(code, (newCode) => {
  console.log(parseCode(newCode));
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function traceArray(arr: object[]): Promise<void> {
  console.log(arr);
  for (const value in arr) {
    highlightLines(arr[value].location);
    console.log(arr[value]);
    await sleep(1000);
  }

  // clearHighlights();
}
</script>

<template>
  <MainLayout>
    <h2 class="text-4xl">The Event Loop</h2>
    <div class="flex gap-5">
      <div class="max-w-[600px] w-full rounded-2xl">
        <CodeEditor
          v-model:value="code"
          language="javascript"
          theme="vs-dark"
          :height="400"
          @error="handleError"
          :lifecycle="lifecycleHooks"
        />
        <div v-if="editorError" class="error-info">
          <h4>Error: {{ editorError.code }}</h4>
          <p>{{ editorError.message }}</p>
        </div>

        <!-- Control buttons -->
        <div class="mt-4 flex gap-2">
          <button
            @click="simulateExecution"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Simulate Execution
          </button>

          <button
            @click="traceArray(parseCode(code))"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Highlight Line 1
          </button>
          <button
            @click="clearHighlights"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Highlights
          </button>
        </div>
      </div>
      {{ code }}
    </div>
  </MainLayout>
</template>

<style lang="css">
.highlight-call {
  background-color: yellow;
  border-radius: 3px;
}

/* Monaco editor highlight styles */
.highlight-execution {
  background-color: rgba(255, 255, 0, 0.3) !important;
}

.highlight-glyph {
  background-color: #ffeb3b;
  width: 10px !important;
}

/* Alternative highlight styles */
:deep(.highlight-error) {
  background-color: rgba(255, 0, 0, 0.3) !important;
}

:deep(.highlight-success) {
  background-color: rgba(0, 255, 0, 0.3) !important;
}
</style>
