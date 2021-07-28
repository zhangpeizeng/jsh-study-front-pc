import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import { BrandListTableData, courseTypeList } from "./interface";
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
  //状态
  private status: string = "";
  //课程类型列表
  private courseTypeList = [];
  private chosetypelist: Array<courseTypeList> = [];
  classifyName: any = "";
  studyTerminalName: any = "";
  private statusany: any = "";

  private loading: boolean = false;

  colleges: Array<any> = [];

  options: Array<any> = [];

  labelCode: string = ""; // 学习终端

  classid?: any;

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;
  private dialogTableVisible: boolean = false;

  private tableData: Array<BrandListTableData> = [];
  //默认图
  private backlogo: any = backlogo;

  private created(): void {
    const { classid } = this.$route.query;
    this.classid = classid;
    this.onLoad();
    this.gettypelist();
    Http.post(MarkeTing.SearchSysDict, { typeCode: "study_terminal" })
      .then(res => {
        const { data } = res;

        if (data.success) {
          // this.options = [{"typeName":"终端类型","typeCode":"study_terminal","labelName":"客户端","labelCode":"1","iconUrl":null,"icon":null,"remarks":null},{"typeName":"终端类型","typeCode":"study_terminalDD","labelName":"非客户端","labelCode":"2","iconUrl":null,"icon":null,"remarks":null}]
          this.options = data.data;
          // console.log('金鹏测试哈哈哈',this.options)
          this.labelCode = this.options[0].labelCode;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  private onLoad(): void {
    const { $message } = this;
    this.loading = true;
    Http.get(MarkeTing.themeDetail, { id: this.classid })
      .then(res => {
        if (res.data.success) {
          this.classifyName = res.data.data.classifyName;
          this.studyTerminalName = res.data.data.studyTerminalName;
          this.statusany = res.data.data.status;
          this.colleges = res.data.data.baseInfoList;
          this.getList();
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
      .catch(err => {
        this.$message.error("品牌列表获取失败，请稍后重试");
      });
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.getList();
  }
  private onpageNumSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getList();
  }
  private closeto(): void {
    window.close();
  }

  private deleteclass(): void {
    this.$confirm(`是否确认删除主题`, "提示", {
      confirmButtonText: `确认删除`,
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        Http.get(MarkeTing.deleteTheme, {
          id: this.classid
        })
          .then(res => {
            console.log(res);
            if (res.data.success) {
              this.$router.push("/operation-classification");
            } else {
              this.$message.error(res.data.errorMsg);
            }
            this.loading = false;
          })
          .catch(err => {
            // this.$message.error("品牌列表获取失败，请稍后重试");$router.go(-1)
            this.loading = false;
          });
      })
      .catch(() => {
        console.log("取消");
      });
  }

  private upstaus(status: number): void {
    this.$confirm(`是否确认${status === 0 ? "下架" : "上架"}`, "提示", {
      confirmButtonText: `确认${status === 0 ? "下架" : "上架"}`,
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        Http.get(MarkeTing.drop, {
          id: this.classid,
          status: status
        })
          .then(res => {
            console.log(res);
            if (res.data.success) {
              this.onLoad();
              console.log("成功");
              // this.onLoad(this.classid);
            } else {
              this.$message.error(res.data.errorMsg);
            }
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
          });
      })
      .catch(() => {
        console.log("取消");
      });
  }

  private getList() {
    const params = {
      colleges: this.colleges,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    // this.loadingn = true
    Http.post(MarkeTing.themeFenye, params)
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.tableData = data.data.list;
          this.total = data.data.total;
        } else {
          this.$message.error(data.errorMsg);
        }
        // this.loadingn = false
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  private xiugai() {
    this.$router.push({
      path: "/xiu-theme",
      query: {
        id: this.classid
      }
    });
  }
}
