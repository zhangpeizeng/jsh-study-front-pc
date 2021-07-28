/**
 * 根模块路由，不属于任何模块的路由可放置在这.
 *
 * meta 可配置参数
 * @param {boolean} keepAlive 是否缓存页面,一般默认为false
 * @param {string} title 页面标题
 * @param {string} permission 页面访问权限码,无此属性则不设权限
 */
export default [
  {
    path: "",
    component: () => import("@/views/layout/basic/basic.vue"),
    redirect: "/",
    children: [
      {
        path: "/",
        name: "home",
        component: () => import("@/views/home/home.vue"),
        meta: {
          keepAlive: true,
          title: "首页"
        }
      }
    ]
  },
  {
    path: "/local-login",
    name: "localLogin",
    component: () => import("@/views/local/local-login.vue"), // 营销学院本地调试登录页
    meta: {
      keepAlive: false,
      title: "登录"
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/login.vue"), // 中转页登录--第三方系统跳转使用
    meta: {
      keepAlive: false,
      title: "登录"
    }
  },
  {
    path: "/login-page",
    name: "loginPage",
    component: () => import("@/views/login/login-page.vue"), // 营销学院登录页
    meta: {
      keepAlive: false,
      title: "登录"
    }
  },
  {
    path: "/nologin",
    name: "nologin",
    component: () => import("@/views/login/nologin.vue"),
    meta: {
      keepAlive: false,
      title: "未登录"
    }
  },
  {
    path: "/nouser",
    name: "nouser",
    component: () => import("@/views/login/nouser.vue"),
    meta: {
      keepAlive: false,
      title: "未登录"
    }
  },
  {
    path: "/userFreeze",
    name: "userFreeze",
    component: () => import("@/views/login/userFreeze.vue"), // 讲师被冻结缺省页
    meta: {
      keepAlive: false,
      title: "未登录"
    }
  },
  {
    path: "/lecturer-apply", // 讲师申请
    name: "lecturerApply",
    component: () => import("@/views/apply/lecturerApply.vue"),
    meta: {
      keepAlive: false,
      title: "讲师申请"
    }
  },
  {
    path: "/document-browsing",
    name: "documentBrowsing",
    component: () =>
      import("@/components/document-browsing/document-browsing.vue"),
    meta: {
      keepAlive: false,
      title: "文件预览"
    }
  }
];
