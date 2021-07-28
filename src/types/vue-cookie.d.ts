import Vue from "vue";

export interface VueCookie {
  install(vue: typeof Vue): void;

  set(name: string, value: string, daysOrOptions?: any): void;

  get(name: string): string;

  delete(name: string): void;
}
