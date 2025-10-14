<script setup lang="ts">
import * as t from "@babel/types";
import * as babelParser from "@babel/parser";
import traverse, { type NodePath } from "@babel/traverse";
import { CodeEditor, type EditorError, type EditorLifecycleHooks } from "monaco-editor-vue3";
import { ref, watch } from "vue";
import type { editor } from "monaco-editor";
import * as monaco from "monaco-editor";
import MainLayout from "@/layouts/MainLayout.vue";

type ExecutionStep = {
  type: string;
  name: string;
  context: string;
  location: number[] | null;
  executionOrder: number;
};

const code = ref<string>(`

Promise.resolve().then(() => {
  console.log('Promise resolved');
});

console.log('Start');

setTimeout(() => {
  console.log('Timeout callback');
}, 0);

console.log('End');
`);

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

// function highlightLine(lineNumber: number, className = "highlight-execution") {
//   if (!decorationsCollection) return;

//   decorationsCollection.set([
//     {
//       range: new monaco.Range(lineNumber, 1, lineNumber, 1),
//       options: {
//         isWholeLine: true,
//         className,
//         glyphMarginClassName: "highlight-glyph",
//       },
//     },
//   ]);
// }

function highlightLines(lineNumbers: number[] | null, className = "highlight-execution") {
  if (!decorationsCollection || !lineNumbers) return;

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

type NodePath<T = t.Node> = {
  node: T;
  parent: t.Node;
  parentPath: NodePath | null;
};

function getExecutionContext(path: NodePath): string {
  let currentPath = path.parentPath;
  while (currentPath) {
    const node = currentPath.node;

    if (t.isCallExpression(node)) {
      const callee = node.callee;
      if (
        t.isIdentifier(callee) &&
        (callee.name === "setTimeout" || callee.name === "setInterval")
      ) {
        console.log(t.isCallExpression(node), callee.name);

        return "macrotask-queue";
      }
    }

    if (t.isCallExpression(node)) {
      const callee = node.callee;
      if (t.isMemberExpression(callee)) {
        const property = callee.property;
        if (
          t.isIdentifier(property) &&
          (property.name === "then" || property.name === "catch" || property.name === "finally")
        ) {
          return "microtask-queue";
        }
      }
    }

    if (
      t.isFunctionDeclaration(node) ||
      t.isFunctionExpression(node) ||
      t.isArrowFunctionExpression(node)
    ) {
      if (node.async) {
        return "async-function";
      }
    }

    currentPath = currentPath.parentPath;
  }

  return "main-thread";
}

function parseCodeWithContext(codeStr: string) {
  const ast = babelParser.parse(codeStr, {
    sourceType: "module",
    plugins: ["typescript"],
  });

  const result: ExecutionStep[] = [];

  traverse(ast, {
    CallExpression(path: NodePath<t.CallExpression>) {
      const callee = path.node.callee;
      const context = getExecutionContext(path);

      const startLine = path.node.loc?.start.line ? path.node.loc?.start.line : null;
      const endLine = path.node.loc?.end.line ? path.node.loc?.end.line : null;
      const location = startLine && endLine ? [startLine, endLine] : null;

      if (t.isMemberExpression(callee)) {
        const objName = callee.object.type === "Identifier" ? callee.object.name : null;
        const propName = callee.property.type === "Identifier" ? callee.property.name : null;

        if (objName === "console" && propName === "log") {
          result.push({
            type: "console-log",
            name: "console.log",
            context: context,
            location: location,
            executionOrder: getExecutionOrder(context),
          });
        }
      }
    },
  });

  return result.sort((a, b) => a.executionOrder - b.executionOrder);
}

function getExecutionOrder(context: string): number {
  switch (context) {
    case "main-thread":
      return 1;
    case "microtask-queue":
      return 2;
    case "async-function":
      return 2;
    case "macrotask-queue":
      return 3;
    default:
      return 1;
  }
}

function getHighlightClass(context: string): string {
  switch (context) {
    case "main-thread":
      return "highlight-main";
    case "microtask-queue":
      return "highlight-microtask";
    case "task-queue":
      return "highlight-task";
    case "async-function":
      return "highlight-async";
    default:
      return "highlight-execution";
  }
}

async function traceArrayWithContext(arr: ExecutionStep[]): Promise<void> {
  for (let i = 0; i < arr.length; i++) {
    const item: ExecutionStep = arr[i];
    const className = getHighlightClass(item.context);

    highlightLines(item.location, className);
    await sleep(1500);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateEventLoop(): Promise<void> {
  const parsed = parseCodeWithContext(code.value);
  await traceArrayWithContext(parsed);
}

watch(code, (newCode) => {
  console.log("Parsed with context:", JSON.stringify(parseCodeWithContext(newCode), null, 2));
});
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
            @click="simulateEventLoop"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Simulate Event Loop
          </button>
          <button
            @click="clearHighlights"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Highlights
          </button>
        </div>

        <!-- Legend -->
        <div class="mt-4 text-sm">
          <div class="flex gap-4">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-blue-300 rounded"></div>
              <span>Main Thread</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-green-300 rounded"></div>
              <span>Microtasks</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 bg-red-300 rounded"></div>
              <span>Task Queue</span>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-[400px]">
        <h3 class="text-lg font-bold mb-2">Parsed Code:</h3>
        ]
        <div class="flex gap-5 flex-col">
          <div>
            {{
              parseCodeWithContext(code)
                .filter((snippet) => snippet.executionOrder === 1)
                .map((snippet) => ({ type: snippet.type, lines: snippet.location }))
            }}
          </div>
          <div>
            {{
              parseCodeWithContext(code)
                .filter((snippet) => snippet.executionOrder === 2)
                .map((snippet) => ({ type: snippet.type, lines: snippet.location }))
            }}
          </div>
          <div>
            {{
              parseCodeWithContext(code)
                .filter((snippet) => snippet.executionOrder === 3)
                .map((snippet) => ({ type: snippet.type, lines: snippet.location }))
            }}
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style lang="css">
:deep(.highlight-main) {
  background-color: rgba(59, 130, 246, 0.3) !important;
}

:deep(.highlight-microtask) {
  background-color: rgba(34, 197, 94, 0.3) !important;
}

:deep(.highlight-task) {
  background-color: rgba(239, 68, 68, 0.3) !important;
}

:deep(.highlight-async) {
  background-color: rgba(168, 85, 247, 0.3) !important;
}

:deep(.highlight-execution) {
  background-color: rgba(255, 255, 0, 0.3) !important;
}

:deep(.highlight-glyph) {
  background-color: #ffeb3b;
  width: 10px !important;
}
</style>
