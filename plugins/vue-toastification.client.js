import Vue from "vue";
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

const options = {
  position: POSITION.TOP_RIGHT,
  hideProgressBar: true,
  timeout: 1000,
};
export default (context) => {
  Vue.use(Toast, options);
};
