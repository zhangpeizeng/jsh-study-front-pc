import "core-js";
import "regenerator-runtime/runtime";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./components/global-components";
import "./plugins";
import "./directives";
import "./filters";

Vue.config.productionTip = false;

if (process.env.NODE_ENV === "development") {
  Vue.config.devtools = true;

  Vue.config.errorHandler = (err, vm, info) => {
    console.error(err);
  };
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
