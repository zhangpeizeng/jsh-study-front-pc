// ------home page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Http, { Default } from "@/request";
import { Menu, CommonMenu } from "../sidebar/sidebar.interface";

@Component
export default class AppManage extends Vue {
  @Prop({
    type: Boolean,
    default: false,
    required: false
  })
  visible: boolean = false;

  // 菜单列表
  menuList: Menu[] = [];

  // loading
  loading: boolean = false;
  // 是否初始化过页面
  isInit: boolean = false;

  // 常用功能菜单
  get commonMenuList(): CommonMenu[] {
    this.isInit = true;
    return this.$store.state.commonMenuList;
  }

  @Watch("visible")
  watchVisible(value: boolean) {
    this.$nextTick(() => {
      if (value) {
        // document.body.appendChild(this.$el);
        document.body.style.overflow = "hidden";
      } else {
        // if (this.$el.parentNode) this.$el.parentNode.removeChild(this.$el);
        document.body.style.overflow = "";
      }
    });
  }

  async mounted() {
    const res = await Http.get(Default.sidebarMenu);
    if (res.data.success) {
      this.menuList = res.data.data;
    }

    // if (this.$el.parentNode) this.$el.parentNode.removeChild(this.$el);
    document.body.appendChild(this.$el);
  }

  private async created() {}
}
