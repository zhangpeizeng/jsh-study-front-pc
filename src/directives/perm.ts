/**
 * @auther:seebin
 */
import Vue from "vue";
import { DirectiveBinding } from "vue/types/options";

/**
 * 许可证指令(权限码指令)
 *
 * 用于dom节点上，用来控制按钮的权限展示
 *
 * 例子：
 * <div v-perm="'home'"></div> ==> 如果权限列表中有home权限码则展示，没有则会移除该dom元素
 *
 */

Vue.directive("perm", {
  inserted: function(el: HTMLElement, binding: DirectiveBinding) {
    if (!binding.value) return;

    const permission = binding.value;

    let permissionArray = [];
    if (permission.indexOf(",") > 0) {
      permissionArray = permission.split(",");
    }

    // 从缓存中取出权限列表
    const permissionListStr = localStorage.getItem("permissionList") as string;
    const permissionList = JSON.parse(permissionListStr);

    // 只有一个权限码
    if (
      permissionArray.length === 0 &&
      el.parentNode &&
      !permissionList.includes(permission)
    ) {
      // 没有权限则移除元素
      el.parentNode.removeChild(el);
      return;
    }

    // 数组个数
    const permissionListLength = permissionList.length;
    let hasPermission = false;

    // 多个权限码控制
    for (let i = 0; i < permissionListLength / 2; i++) {
      const oldItemPrev = permissionList[i];
      const oldItemNext = permissionList[permissionList.length - (i + 1)];

      for (let y = 0; y < permissionArray.length; y++) {
        const newItem = permissionArray[y];
        if (newItem === oldItemPrev || newItem === oldItemNext) {
          hasPermission = true;
        }
      }
    }

    if (el.parentNode && !hasPermission) {
      // 没有权限则移除元素
      el.parentNode.removeChild(el);
    }
  }
});
