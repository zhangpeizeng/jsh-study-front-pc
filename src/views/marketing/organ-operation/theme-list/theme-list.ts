import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination
} from "element-ui";
import { backlogo } from "@/assets/images/backlogo.png";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination);

@Component({
  components: {}
})
export default class ShopClassList extends Vue {
  //
  private themeName: string = "";
  private activeName: string = "first";
  private courseName: string = "";
  //状态
  private status: string = "";
  private chosetypelist: Array<any> = [];

  private loading: boolean = false;

  private classifyName: string = "";

  options: Array<any> = [];

  terminalList: any = [];

  labelCode: any = ""; // 学习终端

  organCode: string = ""; // 所选机构

  organName: string = ""; // 所选机构名字

  choosedCourseList: Array<any> = []; // 选择的课程,选择课程

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  private tableData: Array<any> = [];
  //默认图
  private backlogo: any = backlogo;

  private created(): void {
    this.getTerminal();
    this.gettypelist();
  }

  private onSearch(): void {
    this.pageNum = 1;
    this.onLoad();
  }
  // 查终端列表
  private getTerminal() {
    Http.post(MarkeTing.SelectCourse, {
      typeCode: "study_terminal",
      baseId: null
    }).then(res => {
      const { data } = res;
      if (data.success) {
        this.terminalList = data.data;
        this.labelCode = this.terminalList[0].labelCode;
        // if (this.$route.query.code) {
        //   this.labelCode = this.$route.query.code;
        // }
        if (this.$route.query.code) {
          // 比对，防止进列表终端被删除
          this.terminalList.forEach((value: any) => {
            if (value.labelCode == this.$route.query.code) {
              this.labelCode = this.$route.query.code;
            }
          });
        }
        this.organList();
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }
  /**
   * 切换终端tab
   * @param tab
   * @param event
   */
  private handleClick(tab: any, event: any) {
    console.log(tab, event);
    this.pageNum = 1;
    this.organList();
  }

  /**
   * 获取机构列表
   *
   */
  private organList() {
    Http.get(MarkeTing.getClassList, { studyTerminalCode: this.labelCode })
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.options = [];
          this.organCode = "";
          this.organName = "";
          if (data.data.length > 0) {
            this.options = data.data;
            this.organCode = this.options[0].id;
            this.organName = this.options[0].classifyName;
          }
          this.onLoad();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  /**
   * 所选机构的值发生改变时触发
   */
  private changeCode() {
    this.options.forEach((item: any) => {
      if (item.id === this.organCode) {
        this.organName = item.classifyName;
      }
    });
  }

  private cleanto(): void {
    this.pageNum = 1;
    this.status = "";
    this.classifyName = "";
    this.organCode = this.options[0].id;
  }

  private onpageNumSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.onLoad();
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.onLoad();
  }

  /**
   * 获取列表数据
   */
  private onLoad(): void {
    const { pageNum, pageSize, status, classifyName, $message } = this;
    const studyTerminalCode = this.labelCode;
    this.loading = true;
    Http.post(MarkeTing.listClassClassifyTheme, {
      pageNum,
      pageSize,
      status,
      studyTerminalCode,
      firstClassifyId: this.organCode,
      classifyThemeName: classifyName
    })
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          this.tableData = res.data.data.list;
          // this.tableData.forEach((item:any)=>{
          //     item.status = 1
          // });
          this.total = res.data.data.total;
        } else {
          $message.error(res.data.errorMsg);
        }
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  }
  private gettypelist(): void {
    Http.post(MarkeTing.SearchSysDict, {
      typeCode: "courses_classify"
    })
      .then(res => {
        console.log(res);
        const { data } = res;
        if (data.success && data.data && data.data.length > 0) {
          this.chosetypelist = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }

  private gotodetail(scope: any): void {
    let newpage = this.$router.resolve({
      path: "/organ-theme-detail",
      query: {
        id: scope.id
      }
    });
    window.open(newpage.href, "_blank");
  }

  private toNewTheme() {
    this.$router.push({
      path: "/add-organ-theme",
      query: {
        labelCode: this.labelCode,
        organCode: this.organCode,
        organName: this.organName
      }
    });
  }

  // 向上移动
  private tabUp(value: any, index: any) {
    if (index !== 0) {
      const sortList = [];
      let indexFlag = 0;
      this.tableData.forEach((value1: any, index1: any) => {
        if (value.id == value1.id) {
          indexFlag = index1;
        }
      });
      sortList.push(
        {
          id: this.tableData[indexFlag - 1].id,
          sortNo: this.tableData[indexFlag - 1].sortNo
        },
        {
          id: value.id,
          sortNo: value.sortNo
        }
      );
      // this.tableData[index] = this.tableData.splice(
      //   index - 1,
      //   1,
      //   this.tableData[index]
      // )[0];
      this.adverList(sortList);
    }
  }

  // 向下移动
  private tabDown(value: any, index: any) {
    if (index !== this.tableData.length - 1) {
      const sortList = [];
      let indexFlag = 0;
      this.tableData.forEach((value1: any, index1: any) => {
        if (value.id == value1.id) {
          indexFlag = index1;
        }
      });
      if (this.tableData[indexFlag + 1].status == 0) {
        return;
      }
      sortList.push(
        {
          id: this.tableData[indexFlag + 1].id,
          sortNo: this.tableData[indexFlag + 1].sortNo
        },
        {
          id: value.id,
          sortNo: value.sortNo
        }
      );
      // this.tableData[index] = this.tableData.splice(
      //   index + 1,
      //   1,
      //   this.tableData[index]
      // )[0];
      this.adverList(sortList);
    }
  }

  private adverList(data: any) {
    Http.post(MarkeTing.updateClassClassifyThemeSort, data)
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.onLoad();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
