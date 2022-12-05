import Vue from "vue";
import VueI18n from "vue-i18n";
import { en } from "./lang/en";
import { km } from "./lang/km";

Vue.use(VueI18n);

let currentLang = "en";
// if (process.browser) {
//   currentLang = localStorage.locale;
// }
const i18n = new VueI18n({
  locale: currentLang || "en",
  fallbackLocale: currentLang || "en",
  silentTranslationWarn: true,
  messages: { en, km },
});

const changeLocale = (locale) => {
  i18n.locale = locale;
  localStorage.locale = locale;
};

export default ({ app, $axios }, inject) => {
  app.i18n = i18n;
  const lang = app.i18n.locale;
  // $moment.locale(lang);
  $axios.setHeader("Content-Language", lang);
  $axios.setHeader("Accept-Language", lang);
  inject("changeI18nLocale", (lang) => {
    changeLocale(lang);
    // $moment.locale(lang);
    $axios.setHeader("Content-Language", lang);
    $axios.setHeader("Accept-Language", lang);
  });

  inject("isKm", () => i18n.locale != "en");
};

const $t = (key, choice) => i18n.tc(key, choice);

export { changeLocale, $t };
