// ------home page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Http, { Default, MarkeTing } from "@/request";
import { Menu, CommonMenu } from "../sidebar/sidebar.interface";

@Component
export default class SelectTestPaper extends Vue {
  @Prop({
    type: Boolean,
    default: false,
    required: false
  })
  visible!: boolean;
  medalList: any = [{ medalName: "" }]; // 选中的勋章组
  dialogSetting: boolean = false;

  // 菜单列表
  menuList: any = [];
  //当前的选中的索引值
  checkIndex: any = "";
  // 选中的勋章组
  // checkList: any = [];

  // loading
  loading: boolean = false;
  // 是否初始化过页面
  isInit: boolean = false;

  /**
   * 获取勋章列表接口
   */
  obtainMedalList() {
    console.log(this.medalList, "555555555555");
    Http.get(MarkeTing.listMedal, { accountId: 1 })
      .then(res => {
        this.menuList = res.data.data;
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 选择勋章
   * @param item
   * @param i
   */
  clickLi(item: any, i: any) {
    this.checkIndex = i;
    this.medalList = item.medalTypeList;
    for (let i = 0; i < this.medalList.length; i++) {
      this.medalList[i]["distributionRatio"] = "";
      this.medalList[i]["medalName"] = item.medalName;
    }
  }
  // closeMedal() {
  //   console.log('333333333333333333333')
  //   this.$emit("medalShow", false);
  // }

  /**
   * 将选择勋章的值传给父组件
   */
  confirm() {
    this.$emit("func", this.medalList);
    this.dialogSetting = false;
  }
  async mounted() {}

  private async created() {
    this.obtainMedalList();
  }
}
