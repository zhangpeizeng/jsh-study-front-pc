// ------home page
import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import IScroll from "iscroll/build/iscroll-probe";
import { Menu, CommonMenu } from "./sidebar.interface";
import { trim } from "@/utils";
import MenuDefaultImg from "@/assets/images/kehu.png";

@Component({})
export default class Sidebar extends Vue {
  get getMenuPath(): string {
    if (this.$store.state.menuPath === "/") {
      this.activeMenuId = 0;
    } else {
      const list1 = this.$store.state.menuPath.split("/");
      if (this.menuList && this.menuList.length > 0) {
        this.menuList.forEach(e1 => {
          if (e1.children && e1.children.length > 0) {
            e1.children.forEach(e2 => {
              if (e2.children && e2.children.length > 0) {
                e2.children.forEach(e3 => {
                  const list2 = e3.pcUrl.split("/");
                  if (list2[list2.length - 1] === list1[list1.length - 1]) {
                    this.activeMenuId = e1.id;
                  }
                });
              }
            });
          }
        });
      }
    }
    return this.$store.state.menuPath;
  }
  // 默认一级菜单图标
  menuDefaultImg: any = MenuDefaultImg;
  // 菜单列表
  private menuList: Menu[] = [];
  // 当前页菜单id
  private activeMenuId: number = 0; // 默认0 首页

  // 左侧菜单跳转
  toPage(menu: Menu, secondMenu: Menu) {
    // 属于vue工程
    if (secondMenu.pcUrl) {
      const urlResult = secondMenu.pcUrl;
      this.$router.push(urlResult).catch(err => {});
      this.activeMenuId = menu.id;
    }
    localStorage.setItem(
      "activeMenuId",
      JSON.stringify({ activeMenuId: this.activeMenuId })
    );
  }

  // 初始化侧边栏交互
  private initSidebarUE() {
    this.$nextTick(() => {
      const iScroll = new IScroll("#i-scroll-js", {
        preventDefault: false,
        mouseWheel: true, // 允许鼠标滚轮
        probeType: 2
      });

      const menuNodes = document.getElementsByClassName(
        "js-hover-menu"
      ) as HTMLCollectionOf<HTMLElement>;
      for (const ele of menuNodes) {
        const childNode = ele.lastChild as HTMLElement;
        childNode.style.display = "block";
        // 二级菜单的高度
        const menuHeight = childNode.clientHeight;
        childNode.style.display = "none";

        // 距离页面的高度
        const offsetTop = ele.offsetTop + 70;

        ele.addEventListener("mouseenter", () => {
          // 滚动条的高度 被卷进去的高度
          const scrollTop = -iScroll.y;
          // 屏幕高度
          // const windowHeight = document.documentElement.clientHeight;
          if (offsetTop !== 70) {
            childNode.style.top = -(offsetTop - 70 - scrollTop) + "px";
            childNode.style.bottom = "auto";
          }
          childNode.style.display = "block";
        });

        ele.addEventListener("mouseleave", () => {
          const childNode = ele.lastChild as HTMLElement;
          childNode.style.display = "none";
        });
      }
    });
  }

  // 初始化查询侧边栏菜单
  private initSidebarMenu() {
    Http.post(MarkeTing.LISTMENU, {
      pids: [0], //菜单层级
      roleCode: "lecturer" //区分登录身份
    }).then(res => {
      if (!res.data.success && res.data.data && res.data.data.length > 0) {
        this.menuList = res.data.data;
        console.log(res.data.data);
        localStorage.setItem("menuList", JSON.stringify(this.menuList));

        // 首页
        if (this.$router.currentRoute.fullPath === "/") {
          this.activeMenuId = 0;
        } else {
          // 取出激活的一级菜单id
          this.menuList.forEach(menu => {
            if (
              menu.pcUrl &&
              window.location.href.indexOf(trim(menu.pcUrl)) > -1
            ) {
              this.activeMenuId = menu.id;
            }
            menu.children.forEach(subMenu => {
              if (
                subMenu.pcUrl &&
                window.location.href.indexOf(trim(subMenu.pcUrl)) > -1
              ) {
                this.activeMenuId = menu.id;
              }
              subMenu.children.forEach(thirdMenu => {
                if (
                  thirdMenu.pcUrl &&
                  window.location.href.indexOf(trim(thirdMenu.pcUrl)) > -1
                ) {
                  this.activeMenuId = menu.id;
                }
              });
            });
          });
        }

        this.initSidebarUE();
      } else {
        // ....
      }
    });
  }

  private created() {
    this.initSidebarMenu();
    // @ts-ignore
    const activeMenu = JSON.parse(localStorage.getItem("activeMenuId"));
    localStorage.removeItem("activeMenu");
    if (activeMenu && activeMenu.activeMenuId) {
      this.activeMenuId = activeMenu.activeMenuId;
    }
  }
}
