import Vue from "vue";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

/**
 * @description 自动判断该更新PerfectScrollbar还是创建它
 * @param {HTMLElement} el - 必填。dom元素
 */
const el_scrollBar = (el: any) => {
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update();
  } else {
    el._ps_ = new PerfectScrollbar(el, {});
  }
};

Vue.directive("scroll", {
  inserted(el: any, binding, vnode) {
    const rules = ["fixed", "absolute", "relative"];
    if (!rules.includes(el.style.position)) {
      console.error(
        `perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join(
          "、"
        )}`
      );
    }
    el_scrollBar(el);
  },
  //更新dom的时候
  componentUpdated(el, binding, vnode: any, oldVnode) {
    try {
      vnode.context.$nextTick(() => {
        el_scrollBar(el);
      });
    } catch (error) {
      console.error(error);
      el_scrollBar(el);
    }
  }
});
