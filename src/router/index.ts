import EventLoopPage from '@/pages/EventLoopPage.vue'
import GarbageCollectorPage from '@/pages/GarbageCollectorPage.vue'
import MainPage from '@/pages/MainPage.vue'
import ReflowRepaintPage from '@/pages/ReflowRepaintPage.vue'
import RenderingPage from '@/pages/RenderingPage.vue'
import ThrottlongDebouncePage from '@/pages/ThrottlongDebouncePage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },
    {
      path: '/event-loop',
      name: 'event-loop',
      component: EventLoopPage,
    },
    {
      path: '/garbage-collector',
      name: 'garbage-collector',
      component: GarbageCollectorPage,
    },
    {
      path: '/throttling-debouncing',
      name: 'throttling-debouncing',
      component: ThrottlongDebouncePage,
    },
    {
      path: '/reflow-repaint',
      name: 'reflow-repaint',
      component: ReflowRepaintPage,
    },
    {
      path: '/rendering',
      name: 'rendering',
      component: RenderingPage,
    },
  ],
})

export default router
