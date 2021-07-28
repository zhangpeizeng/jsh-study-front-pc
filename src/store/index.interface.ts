import { CommonMenu } from "@/components/sidebar/sidebar.interface";
import { RouteConfig } from "vue-router";

// 面包屑数据
export interface Breadcrumb {
  // 面包屑名称
  name: string;
  // 面包屑路径 同vue-router的to
  to?: string | RouteConfig;
  // 在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录
  replace?: boolean;
}

// 根store状态数据
export interface IndexState {
  // 侧边栏常用菜单列表
  commonMenuList: CommonMenu[];
  // 是否显示常用菜单弹出框
  isDisplayAppManageModal: boolean;
  // 面包屑列表
  breadcrumbList: Breadcrumb[];
  //  菜单路径
  menuPath: string;
}
