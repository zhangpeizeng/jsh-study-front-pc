/**
 * 插件的全局声明模块都放到这个文件下, 单个插件的声明文件请新建文件
 *
 * 如果node_modules的声明全局模块放在本文件夹内不生效 则放入shims-plugin.d.ts下
 */

import { HttpService } from "./http.service";
import { VueCookie } from "./vue-cookie";

declare module "vue/types/vue" {
  interface Vue {
    $http: HttpService;
    $cookie: VueCookie;
  }
}

declare global {
  interface Window {
    [p: string]: any;
  }
}
