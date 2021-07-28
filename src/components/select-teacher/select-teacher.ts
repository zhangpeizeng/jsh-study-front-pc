// ------home page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Http, { Default, MarkeTing } from "@/request";
import { Menu, CommonMenu } from "../sidebar/sidebar.interface";

@Component
export default class SelectTestPaper extends Vue {
  // 被选中的教师的值
  itemPaper: any = {
    accountId: null,
    orgCode: null,
    accountName: null,
    orgName: null,
    phone: null,
    huiHuiNumber: null
  };
  //查询输入的内容
  examName: any = "";
  //选择试卷的dialog框是否展示
  dialogSetting: boolean = false;
  // loading
  loading: boolean = false;
  // 是否初始化过页面
  isInit: boolean = false;
  // 讲师列表
  paperListData: any = [];
  // 讲师数量
  listCount: number = 100;
  // 默认当前的页面
  currentChange: number = 1;
  // 默认当前页面的数量
  limit: number = 10;

  async mounted() {}
  /**
   *  获取讲师列表
   * @param val
   */
  paperList() {
    console.log(this.currentChange, "当前页码");
    console.log(this.limit, "当前页面数量");
    Http.post(MarkeTing.listAccountInfo, {
      nameOrHuiHui: this.examName,
      page: this.currentChange,
      rows: this.limit
    })
      .then(res => {
        console.log(res.data.data, "shishishsihsishsihsihsi33333333333333");
        this.paperListData = res.data.data.list;
        this.listCount = res.data.data.total;
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 选择讲师
   */
  selectPaper(i: any) {
    Http.postFormData(MarkeTing.checkAccount, {
      accountId: i.accountId
    })
      .then(res => {
        console.log(res.data, "66666666666666666644444444444444");
        if (res.data.success) {
          if (res.data.data) {
            this.itemPaper = i;
            this.$emit("pap", this.itemPaper);
            this.dialogSetting = false;
          }
        } else {
          this.$message(res.data.errorMsg);
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 确定选择修改的讲师
   */
  // confirmPaper() {
  //   this.$emit("pap", this.itemPaper);
  //   this.dialogSetting = false;
  // }
  /**
   * 底部跳转页面
   * @param val
   */
  handleSizeChange(val: any) {
    this.limit = val;
    console.log(`每页 ${val} 条1`);
    this.paperList();
  }
  handleCurrentChange(val: any) {
    console.log(`当前页2: ${val}`);
    this.currentChange = val;
    this.paperList();
  }

  private async created() {
    this.paperList();
  }
}
