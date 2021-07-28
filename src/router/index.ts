import Vue from "vue";
import Router from "vue-router";
import ROOT_ROUTES from "./root-router";
import MARKETING_ROUTES from "./marketing-router";

import store from "@/store";
import { trim } from "@/utils";
import { Menu } from "@/components/sidebar/sidebar.interface";
import { Breadcrumb } from "@/store/index.interface";

Vue.use(Router);

const router = new Router({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    ...ROOT_ROUTES,
    ...MARKETING_ROUTES,
    {
      // 这里匹配404链接
      path: "*",
      component: () => import("@/views/404/404.vue"),
      meta: {
        icon: "",
        keepAlive: true,
        title: "找不到页面"
      }
    }
  ],
  base: process.env.BASE_URL,
  mode: "history"
});
const originalPush = Router.prototype.push;

Router.prototype.push = function push(location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err);
};

// 跳转之前
router.beforeEach((to, from, next) => {
  // 从缓存中取出权限列表
  const permissionListStr = localStorage.getItem("permissionList") as string;
  const permissionList = JSON.parse(permissionListStr);

  if (
    permissionList &&
    to.meta.permission &&
    !permissionList.includes(to.meta.permission)
  ) {
    // 没有权限则跳转404页面
    next({ path: "/404" });
  }
  // 页面标签标题
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  next();
});

const setBreadcrumbList = (breadcrumbList: Breadcrumb[]) => {
  store.commit("changeBreadcrumbList", breadcrumbList);
};

// 跳转之后
router.afterEach((to, from) => {
  store.commit("changeMenuPath", to.path);
  // 清空面包屑
  setBreadcrumbList([]);

  // 动态设置菜单面包屑
  const menuList = JSON.parse(localStorage.getItem("menuList") as string);
  let url = to.fullPath;
  if (to.meta.parentMenuPath) url = to.meta.parentMenuPath;
  let breadcrumbList: Breadcrumb[] = [];
  if (url !== "/" && menuList) {
    menuList.forEach((menu: Menu) => {
      if (menu.pcUrl && trim(menu.pcUrl).indexOf(url) > -1) {
        breadcrumbList = [
          {
            name: menu.name
          }
        ];
      }
      menu.children.forEach(subMenu => {
        if (subMenu.pcUrl && trim(subMenu.pcUrl).indexOf(url) > -1) {
          breadcrumbList = [
            {
              name: menu.name
            },
            {
              name: subMenu.name
            }
          ];
        }
        subMenu.children.forEach(thirdMenu => {
          if (thirdMenu.pcUrl && trim(thirdMenu.pcUrl).indexOf(url) > -1) {
            breadcrumbList = [
              {
                name: menu.name
              },
              {
                name: subMenu.name
              },
              {
                name: thirdMenu.name
              }
            ];
          }
        });
      });
    });
  }
  if (to.meta.extendBreadcrumbList)
    breadcrumbList = breadcrumbList.concat(to.meta.extendBreadcrumbList);
  setBreadcrumbList(to.meta.extendBreadcrumbList);
});

export default router;
