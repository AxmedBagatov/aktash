import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  server: {
    port: 80,
    host: '0.0.0.0',
  },
  head: {
    titleTemplate: '%s - aktash',
    title: 'aktash',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/axios',  // Модуль для работы с HTTP запросами
    '@nuxtjs/auth-next', // Модуль для авторизации
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  axios: {
    baseURL: 'http://localhost:4000', // URL вашего API
    credentials: true,  // Разрешаем отправку cookies
  },
  router: {
    middleware: ['auth'] // Убедитесь, что это подключено глобально или для нужных страниц
  },
  
  auth: {
    strategies: {
      cookie: {
        cookies: {
          name: 'authToken', // Название cookie
          httpOnly: true,     // Токен доступен только серверу (не для JS)
          secure: process.env.NODE_ENV === 'production', // Работает только на HTTPS в продакшн
          maxAge: 3600,       // Время жизни токена (например, 1 час)
          sameSite: 'Strict', // Защищает от CSRF атак
        },
        user: {
          property: 'user', // Свойство, где хранится информация о пользователе
        },
        endpoints: {
          login: { url: '/api/login', method: 'post' }, // URL для логина
          logout: { url: '/api/logout', method: 'post' }, // URL для выхода
          user: { url: '/api/user', method: 'get' },     // URL для получения данных о пользователе
        },
      },
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
