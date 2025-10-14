# 🚀 Performance Playground

> An interactive web application for learning and exploring key front-end performance concepts

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 About

**Performance Playground** is an educational platform designed to help developers understand and visualize critical front-end performance mechanisms. Through interactive demonstrations and real-time code execution, you can explore how various performance optimizations work under the hood.

Made with ❤️ for learning and practice by **A. Verbetskyi**

## ✨ Features

This application provides interactive demonstrations for the following performance concepts:

- **🔄 Event Loop** - Visualize JavaScript's event loop, call stack, and task queue with an integrated code editor
- **🗑️ Garbage Collector** - Learn about memory management and garbage collection patterns
- **⏱️ Throttling & Debouncing** - Explore optimization techniques for event handling
- **🎨 Reflow & Repaint** - Understand browser rendering and how layout changes affect performance
- **🖼️ Rendering** - Deep dive into browser rendering pipeline and optimization strategies

### Key Capabilities

- 📝 **Interactive Code Editor** - Built-in Monaco editor for writing and testing JavaScript code
- 🔍 **Real-time Visualization** - See how your code executes step-by-step
- 🎯 **AST Parsing** - Utilizes Babel parser to analyze code structure
- 🎨 **Modern UI** - Clean, responsive interface built with Tailwind CSS
- 🧭 **Easy Navigation** - Sidebar navigation for quick access to all topics

## 🛠️ Technology Stack

- **Framework:** [Vue 3](https://vuejs.org/) - Progressive JavaScript framework with Composition API
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Build Tool:** [Vite](https://vitejs.dev/) - Next generation frontend tooling
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- **Code Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The editor that powers VS Code
- **State Management:** [Pinia](https://pinia.vuejs.org/) - Vue Store
- **Router:** [Vue Router](https://router.vuejs.org/) - Official Vue.js routing
- **Code Analysis:** [@babel/parser](https://babeljs.io/docs/babel-parser) & [@babel/traverse](https://babeljs.io/docs/babel-traverse) - JavaScript parsing and AST traversal

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `^20.19.0 || >=22.12.0`
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Heitorop/Performance-Playground.git
   cd Performance-Playground
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Lint and fix code with ESLint |

## 📁 Project Structure

```
Performance-Playground/
├── public/              # Static assets
├── src/
│   ├── assets/          # Styles and other assets
│   ├── components/      # Reusable Vue components
│   │   ├── NavBar.vue
│   │   └── ConsoleComponent.vue
│   ├── constants/       # Application constants
│   │   └── routes.ts
│   ├── layouts/         # Layout components
│   │   └── MainLayout.vue
│   ├── pages/           # Page components (route views)
│   │   ├── MainPage.vue
│   │   ├── EventLoopPage.vue
│   │   ├── GarbageCollectorPage.vue
│   │   ├── ThrottlingDebouncePage.vue
│   │   ├── ReflowRepaintPage.vue
│   │   └── RenderingPage.vue
│   ├── router/          # Vue Router configuration
│   │   └── index.ts
│   ├── stores/          # Pinia stores
│   ├── types/           # TypeScript type definitions
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── index.html           # HTML entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## 🎯 Usage

1. **Navigate** through different topics using the sidebar menu
2. **Interact** with code examples in the Monaco editor
3. **Observe** real-time execution and visualization
4. **Experiment** with your own code to see how performance mechanisms work

## 💻 Development

### Recommended IDE Setup

- [Visual Studio Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension (disable Vetur if installed)

### Type Support for `.vue` Imports

TypeScript doesn't handle `.vue` imports by default. This project uses `vue-tsc` for type checking and requires the [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension for proper IDE support.

### Building for Production

```bash
npm run build
```

This will:
1. Run TypeScript type checking
2. Build optimized production assets to `dist/` directory

## 🤝 Contributing

Contributions are welcome! If you'd like to add new performance demonstrations or improve existing ones:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**A. Verbetskyi (Heitorop)**

- GitHub: [@Heitorop](https://github.com/Heitorop)

## 🙏 Acknowledgments

- Built with modern web technologies for educational purposes
- Inspired by the need to visualize complex performance concepts
- Special thanks to the Vue.js and open-source community

---

<div align="center">
  <p>If you find this project helpful, please consider giving it a ⭐️</p>
  <p>Made with ❤️ and Vue.js</p>
</div>
