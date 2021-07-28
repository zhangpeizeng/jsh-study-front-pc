export * from "./element";
export * from "./plugin";
import Vue from "vue";
import Http from "@/request";

Vue.prototype.$http = Http;
