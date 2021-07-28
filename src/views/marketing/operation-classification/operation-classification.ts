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
  private courseName: string = "";
  //状态
  private status: string = "";
  private chosetypelist: Array<any> = [];

  private loading: boolean = false;

  private classifyName: string = "";

  options: Array<any> = [];

  labelCode: any = ""; // 学习终端

  choosedCourseList: Array<any> = []; // 选择的课程,选择课程

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  private tableData: Array<any> = [];
  //默认图
  private backlogo: any = backlogo;

  private created(): void {
    this.gettypelist();
    Http.post(MarkeTing.SearchSysDict, { typeCode: "study_terminal" })
      .then(res => {
        const { data } = res;

        if (data.success) {
          // this.options = [{"typeName":"终端类型","typeCode":"study_terminal","labelName":"客户端","labelCode":"1","iconUrl":null,"icon":null,"remarks":null},{"typeName":"终端类型","typeCode":"study_terminalDD","labelName":"非客户端","labelCode":"2","iconUrl":null,"icon":null,"remarks":null}]
          this.options = data.data;
          if (this.$route.query.labelCode) {
            this.labelCode = this.$route.query.labelCode;
          } else {
            this.labelCode = this.options[0].labelCode;
          }
          this.onLoad();
          // console.log('金鹏测试哈哈哈',this.options)
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  private onSearch(): void {
    this.pageNum = 1;
    this.onLoad();
  }
  private cleanto(): void {
    this.pageNum = 1;
    this.status = "";
    this.classifyName = "";
    this.labelCode = this.options[0].labelCode;
  }

  private onpageNumSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.onLoad();
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.onLoad();
  }

  private onLoad(): void {
    const { pageNum, pageSize, status, classifyName, $message } = this;
    const studyTerminalCode = this.labelCode;
    this.loading = true;
    Http.post(MarkeTing.oprateTheme, {
      pageNum,
      pageSize,
      status,
      studyTerminalCode,
      // 分类名称
      classifyName
    })
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          this.tableData = res.data.data.list;
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
      path: "/theme-detail",
      query: {
        classid: scope.id
      }
    });
    window.open(newpage.href, "_blank");
  }

  private toNewTheme() {
    this.$router.push({
      path: "/add-theme",
      query: {
        labelCode: this.labelCode
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
    Http.post(MarkeTing.sortTheme, data)
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
