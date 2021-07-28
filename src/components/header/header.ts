import { Component, Vue, Watch } from "vue-property-decorator";
import bus from "@/bus";
import { getFullAddress } from "@/utils";

@Component
export default class Header extends Vue {
  private theme: string = "";

  // 切换主题
  @Watch("theme")
  watchTheme() {
    if (!this.theme) return;
    bus.$emit("change-theme", "theme-" + this.theme);
  }

  // 用户名称
  private userName: any = "";
  // 员工头像
  private accountUrl: any = null;
  private toDetail() {
    this.$router.push({ path: "/my-teacher-detail" });
  }
  private handleCommand(command: String) {
    if (command === "info") {
      this.toDetail();
    } else if (command === "logout") {
      this.logout();
    }
  }
  // 登出
  private logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessexp");
    localStorage.removeItem("accountId");
    localStorage.removeItem("oldtoken");
    localStorage.removeItem("accountName");
    localStorage.removeItem("accountUrl");
    localStorage.removeItem("applyAccountId");
    localStorage.removeItem("huiHuiNumber");
    this.$router.push({ path: "/login-page" });
  }
  private created() {
    this.userName = localStorage.getItem("accountName");
    this.accountUrl = localStorage.getItem("accountUrl");
  }
}
