import Vue from "vue";
import Vuex from "vuex";
import { CommonMenu } from "@/components/sidebar/sidebar.interface";
import { Breadcrumb, IndexState } from "@/store/index.interface";

Vue.use(Vuex);

/**
 * 框架共用的数据可加载此
 *
 * 业务模块之间共用的数据，建议新建文件并引入到modules属性中
 */
export default new Vuex.Store({
  state: {
    commonMenuList: [],
    isDisplayAppManageModal: false,
    breadcrumbList: [],
    menuPath: ""
  },
  mutations: {
    changeCommonMenu(state: IndexState, Payload: CommonMenu[]) {
      state.commonMenuList = Payload;
    },
    changeDisplayAppManageModal(state: IndexState, Payload: boolean) {
      state.isDisplayAppManageModal = Payload;
    },
    changeBreadcrumbList(state: IndexState, Payload: Breadcrumb[]) {
      state.breadcrumbList = Payload;
    },
    changeMenuPath(state: IndexState, Payload: string) {
      state.menuPath = Payload;
    }
  },
  actions: {},
  modules: {}
});
