import colors from "vuetify/es5/util/colors";
const BASE_API = process.env.BASE_API || "http://localhost:10102/";
const ENDPOINT_AUTH = `${BASE_API}/api/Account`;
const ENDPOINT_ONLINE = `${BASE_API}/api/Online`;

export default {
  server: { port: 10102, host: "0.0.0.0", timing: false },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s",
    title: "K8系统",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["~/assets/style.sass"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/axios",
    "~/plugins/common",
    "~/plugins/i18n",
    "~/plugins/form-rule.js",
    "~/plugins/vue-toastification.client",
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    "@nuxtjs/moment",
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/google-analytics",
  ],
  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTIC_ID,
  },
  publicRuntimeConfig: {
    googleAnalytics: {
      id: process.env.GOOGLE_ANALYTIC_ID,
    },
  },
  moment: {
    defaultLocale: "zh-cn",
    locales: ["zh-cn"],
  },
  publicRuntimeConfig: {
    ImagePrefixURL: process.env.BASE_API || "https://nuxtjs.org",
  },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    ["cookie-universal-nuxt", { alias: "cookiz" }],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
  },
  proxy: {
    "/api-auth": {
      target: ENDPOINT_AUTH,
      pathRewrite: { "^/api-auth": "" },
    },
    "/api-base": {
      target: BASE_API,
      pathRewrite: { "^/api-base": "" },
    },
    "/api-image": {
      target: BASE_API,
      pathRewrite: { "^/api-image": "" },
    },
    "/api-online": {
      target: ENDPOINT_ONLINE,
      pathRewrite: { "^/api-online": "" },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      themes: {
        light: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
