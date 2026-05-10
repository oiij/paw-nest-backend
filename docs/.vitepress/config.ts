import { resolve } from 'node:path'
import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Nitro Starter',
  description: 'A production-ready Nitro.js v3 starter template with TypeScript, JWT authentication, Zod validation, and VitePress documentation.',
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
    ['meta', {
      name: 'keywords',
      content: 'Nitro, Nitro.js, TypeScript, API, Server, Starter, Template',
    }],
    ['link', { rel: 'apple-touch-icon', href: '/logo.svg', sizes: '192x192' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/getting-started' },
      {
        text: 'Links',
        items: [
          { text: 'GitHub', link: 'https://github.com/oiij/nitro-starter' },
          { text: 'Nitro.js', link: 'https://nitro.unjs.io/' },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Getting Started', link: '/getting-started' },
        ],
      },
      {
        text: 'Core',
        items: [
          { text: 'API Routes', link: '/api-routes' },
          { text: 'Middleware', link: '/middleware' },
          { text: 'Plugins', link: '/plugins' },
        ],
      },
      {
        text: 'Features',
        items: [
          { text: 'Authentication', link: '/authentication' },
          { text: 'Validation', link: '/validation' },
        ],
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Configuration', link: '/configuration' },
          { text: 'Deployment', link: '/deployment' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/oiij/nitro-starter' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright 2025 oiij',
    },
  },
  markdown: {
    config(md) {
      md.use(vitepressDemoPlugin)
    },
  },
  vite: {
    resolve: {
      alias: {
        '~': resolve(__dirname, '../../src'),
      },
    },
  },
})
