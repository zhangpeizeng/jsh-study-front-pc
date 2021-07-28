import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Tabs,
  TabPane
} from "element-ui";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Tabs)
  .use(TabPane);

@Component({
  components: {}
})
export default class selectCourse extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  private selectObj!: any;

  @Prop({
    type: [Array, String],
    required: true
  })
  private studyTerminalList!: any;
  @Prop({
    type: [Array, String],
    required: true
  })
  private classClassifyId!: any;

  loadingInTable: boolean = false;

  tableData: Array<any> = [];

  choosedThemeList: Array<any> = []; // 选择的主题

  themeName: any = ""; // 主题名称

  //当前页
  private currentPage: number = 1;

  //页容量
  private pageSize: number = 10;

  //总条数
  private total: number = 0;

  //页码容量变化
  private handleSizeChange(pageSize: number) {
    this.currentPage = 1;
    this.pageSize = pageSize;
    this.getThemeList();
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    this.getThemeList();
  }
  //查询主题列表
  private getThemeList() {
    const params = {
      pageNum: this.currentPage,
      pageSize: this.pageSize,
      status: "",
      studyTerminalCode: this.studyTerminalList,
      classifyThemeName: this.themeName,
      firstClassifyId: this.classClassifyId
    };
    this.loadingInTable = true;
    Http.post(MarkeTing.listClassClassifyTheme, params)
      .then(resp => {
        if (resp.data.success) {
          if (document.getElementById("tableCourse")) {
            //@ts-ignore
            document
              .getElementById("tableCourse")
              .getElementsByClassName(
                "el-table__body-wrapper"
              )[0].scrollTop = 0;
          }
          this.tableData = resp.data.data.list;
          this.total = resp.data.data.total;
        } else {
          this.$message.error(resp.data.errorMsg);
          this.tableData = [];
          this.total = 0;
        }
      })
      .catch(error => {
        this.$message.error("服务器错误");
        this.tableData = [];
        this.total = 0;
      })
      .finally(() => {
        this.loadingInTable = false;
      });
  }
  private themeQry() {
    this.getThemeList();
  }
  //选择
  private handleAdd(data: any) {
    this.choosedThemeList = [
      {
        id: data.id,
        themeName: data.classifyName
      }
    ];
    console.log(this.choosedThemeList);
  }

  //判断是否已选
  private existedFilter(data: any, type: any) {
    var flag = false;
    const existedLength2 = this.choosedThemeList.filter(item => {
      return item.id == data.id;
    }).length;
    if (existedLength2 > 0) {
      flag = true;
    }
    return flag;
  }

  private save() {
    const params = {
      id: this.choosedThemeList[0].id,
      themeName: this.choosedThemeList[0].themeName
    };
    this.$emit("confirm", params);
    this.$emit("cancel");
  }

  private created(): void {
    this.getThemeList();
    if (this.selectObj && Object.keys(this.selectObj).length != 0) {
      this.choosedThemeList = [
        {
          id: this.selectObj.id,
          themeName: this.selectObj.themeName
        }
      ];
    }
  }
}
