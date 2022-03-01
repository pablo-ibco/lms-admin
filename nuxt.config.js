export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    htmlAttrs: {
      lang: 'pt-br'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/style.css',
    'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/route-control',
    '~/plugins/axios-settings',
    '~/plugins/lottie-player',
    '~/plugins/aws',
    '~/plugins/utils.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  // Axios settings
  axios: {
    baseURL: 'http://18.212.140.39:3000/api/'
  },

  auth: {
    redirect: {
      home: '/content/cursos',
      logout: '/admin/login'
    },
    strategies: {
      admin: {
        _scheme: 'local',
        endpoints: {
          login: { url: 'auth/adm', method: 'post'},
          user: false,
        },
        token: {
          maxAge: 60 * 60 * 24,
        },
      },
      student: {
        _scheme: 'local',
        endpoints: {
          login: { url: 'auth/student', method: 'post'},
          user: false,
          logout: '/login'
        },
        token: {
          maxAge: 60 * 60 * 24,
        },
      },
    },
  },

  router: {
    middleware: ['auth'],
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'Página Inicial',
          path: '/',
          component: resolve(__dirname, 'pages/content/cursos/index.vue')
        },
        {
          name: 'Login Administrador',
          path: '/admin/login',
          component: resolve(__dirname, 'pages/login.vue')
        },
        {
          name: 'Editar Curso',
          path: '/content/cursos/editar/:id',
          component: resolve(__dirname, 'pages/content/cursos/adicionar.vue')
        }
      )
    }
  },

  server: {
	port: process.env.PORT || 3030
  },

  env: {
    accessKeyId: "AKIARZJ56O723XMCULHS",
    secretAccessKey: "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"
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
}
