// ------home page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Http, { Default, MarkeTing } from "@/request";
import { Menu, CommonMenu } from "../sidebar/sidebar.interface";

@Component
export default class SelectTestPaper extends Vue {
  // 被选中的试卷的值
  itemPaper: any = {
    qId: null,
    name: null,
    beginDate: null,
    viewUrl: null
  };
  //查询输入的内容
  examName: any = "";
  //选择试卷的dialog框是否展示
  dialogSetting: boolean = false;
  // loading
  loading: boolean = false;
  // 是否初始化过页面
  isInit: boolean = false;
  // 试卷列表
  paperListData: any = [];
  // 试卷数量
  listCount: number = 100;
  // 默认当前的页面
  currentChange: number = 1;
  // 默认当前页面的数量
  limit: number = 10;

  async mounted() {}
  /**
   *  点击新建跳转到试卷新建页面（第三方）
   * @param val
   */
  newPaper() {
    Http.get(MarkeTing.addExam)
      .then(res => {
        if (res.data.success) {
          window.open(res.data.data);
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }
  /**
   *  获取试卷列表
   * @param val
   */
  paperList() {
    console.log(this.currentChange, "当前页码");
    console.log(this.limit, "当前页面数量");
    Http.get(MarkeTing.listExam, {
      collegeId: "100000",
      examName: this.examName,
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
   * 预览试卷
   * @param val
   */
  preview(item: any) {
    window.open(item);
  }

  /**
   * 选择试卷
   */
  selectPaper(i: any) {
    this.itemPaper = i;
    console.log(this.itemPaper, "66666666666666666644444444444444");
  }

  /**
   * 确定选择修改的试卷
   */
  confirmPaper() {
    this.$emit("pap", this.itemPaper);
    this.dialogSetting = false;
  }
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
    // this.paperListData = [
    //   {
    //     qId: "112",
    //     name: "mingzi",
    //     beginDate: "2001-11-11",
    //     viewUrl: "https://ks.wjx.top/jq/73132810.aspx"
    //   },
    //   {
    //     qId: "113",
    //     name: "mingzi",
    //     beginDate: "2001-11-11",
    //     viewUrl: "https://ks.wjx.top/jq/73132810.aspx"
    //   },
    //   {
    //     qId: "114",
    //     name: "mingzi",
    //     beginDate: "2001-11-11",
    //     viewUrl: "https://ks.wjx.top/jq/73132810.aspx"
    //   }
    // ];
  }
}
