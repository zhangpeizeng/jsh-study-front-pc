// ------basic page
import { Component, Vue } from "vue-property-decorator";
import HeaderComponent from "@/components/header/header.vue";
import SidebarComponent from "@/components/sidebar/sidebar.vue";
import bus from "@/bus";
import { addClass, copyText, removeClass } from "@/utils";
import Http, { Default } from "@/request";
import { Breadcrumb } from "@/store/index.interface";

@Component({
  components: {
    HeaderComponent,
    SidebarComponent
  }
})
export default class Basic extends Vue {
  // 默认主题色
  private theme: string = "theme-blue";

  private get breadcrumbList(): Breadcrumb[] {
    return this.$store.state.breadcrumbList;
  }

  // 设备指纹标识
  deviceNumber: string = "";

  // 复制设备号
  copyDeviceNo() {
    copyText(this.deviceNumber, () => {
      this.$message("复制成功");
    });
  }

  private async created() {
    console.log("basic+++");
  }
}
