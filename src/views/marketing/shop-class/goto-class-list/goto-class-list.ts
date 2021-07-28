import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import { BrandListTableData } from "./interface";
import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination,
  Dialog
} from "element-ui";
import ShopDialogList from "@/views/marketing/shop-class/shop-dialog-list/shop-dialog-list.vue";
import { courseTypeList } from "@/views/marketing/shop-class/goto-class-list/interface";
import { formatDate } from "@/utils";
import appLivePopup from "@/components/app-live-popup/app-live-popup.vue"; // app直播

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(Dialog)
  .use(TableColumn)
  .use(Pagination);

@Component({
  components: {
    ShopDialogList,
    appLivePopup
  }
})
export default class GotoClassList extends Vue {
  //弹框控制
  private dialogshow: boolean = false;

  private tableDataitem: Array<BrandListTableData> = [];
  //
  private courseName: string = "";
  //状态
  private status: string = "";
  //课程类型列表
  private courseTypeList = [];
  private chosetypelist: Array<courseTypeList> = [];
  private coursename: any = "";

  private studyTerminal: any = ""; // 学习终端

  private studyTerminals: any = []; // 学习终端名称

  private studyTerminalNameList: any = []; // 学习终端列表

  //直播开始时间
  private liveStartTime: any = null;
  //直播结束时间
  private liveEndTime: any = null;

  private loading: boolean = false;

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  private appDialog: boolean = false;

  private classid: any = "";

  private tableData: Array<BrandListTableData> = [];
  shownolist = true;

  private created(): void {
    this.onLoad();
    this.gettypelist();
    this.getTerminalList();
  }

  private onSearch(): void {
    this.pageNum = 1;
    this.pageSize = 10;
    if (this.studyTerminal == "") {
      this.studyTerminals = [];
    } else {
      this.studyTerminals = [];
      this.studyTerminals.push(this.studyTerminal);
    }
    this.onLoad();
  }
  private cleanto(): void {
    this.pageNum = 1;
    this.studyTerminal = "";
    this.studyTerminals = [];
    this.liveStartTime = null;
    this.liveEndTime = null;
    this.courseTypeList = [];
    this.courseName = "";
    this.status = "";
    // this.onLoad();
  }

  private onpageNumSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.onLoad();
  }

  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    console.log(pageNum);
    this.onLoad();
  }
  private timeChange(type: string): void {
    // 结束时间加上23小时59分钟59秒的时间戳
    if (type == "live") {
      if (this.liveEndTime) {
        this.liveEndTime = this.liveEndTime + 86399000;
      }
    }
  }

  private onLoad(): void {
    const {
      pageNum,
      pageSize,
      courseName,
      status,
      studyTerminals,
      liveStartTime,
      liveEndTime,
      courseTypeList,
      $message
    } = this;

    this.loading = true;
    Http.post(MarkeTing.listcollegemarketinglive, {
      pageNum,
      pageSize,
      courseName,
      status,
      studyTerminals,
      liveStartTime,
      liveEndTime,
      courseTypeList
    })
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          this.shownolist = true;
          if (!this.tableData || this.tableData.length === 0) {
            this.shownolist = false;
          }
        } else {
          this.shownolist = false;
          $message.error(res.data.errorMsg);
        }
        this.loading = false;
      })
      .catch(err => {
        this.shownolist = false;
        // $message.error("品牌列表获取失败，请稍后重试");
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
          this.chosetypelist = [];
          data.data.forEach((item: any) => {
            if (!(item.labelCode === "1" || item.labelCode === "4")) {
              this.chosetypelist.push(item);
            }
          });
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        // this.$message.error("品牌列表获取失败，请稍后重试");
      });
  }

  // 获取学习终端数据
  private getTerminalList(): void {
    Http.get(MarkeTing.listStudyTerminal)
      .then(res => {
        if (res.data.success) {
          this.studyTerminalNameList = res.data.data;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  private gotodetail(scope: any): void {
    console.log(scope);
    // this.$router.push({ name: "ShopClass" }, () => {classid:11});
    let studyStartTime = formatDate(new Date(), "yyyy-MM-dd 23:59:59");
    console.log(studyStartTime);
    let newpage = this.$router.resolve({
      path: "/shop-class",
      query: {
        classid: scope.id,
        courseType: scope.courseType,
        courseName: scope.courseName,
        studyStartTime: studyStartTime
      }
    });
    window.open(newpage.href, "_blank");
  }

  opendialog(item: any) {
    console.log(item);
    this.loading = true;
    Http.get(MarkeTing.getvhallliveurl, {
      classId: item.vhallLiveId
    })
      .then(res => {
        this.loading = false;
        console.log(res);
        const { data } = res;
        this.tableDataitem = [];
        if (data.success && data.data && data.data.length > 0) {
          data.data.forEach((itemto: any) => {
            // if (itemto.identityType === "1") {
            let studyStartTime = "";
            if (item.studyStartTime) {
              studyStartTime = formatDate(
                new Date(item.studyStartTime),
                "yyyy-MM-dd hh:mm:ss"
              );
            }
            let liveStartTime = "";
            if (item.liveStartTime) {
              liveStartTime = formatDate(
                new Date(item.liveStartTime),
                "yyyy-MM-dd hh:mm:ss"
              );
            }
            itemto["liveStartTime"] = liveStartTime;
            itemto["studyStartTime"] = liveStartTime;
            itemto["courseName"] = item.courseName;
            this.tableDataitem.push(itemto);
            // }
          });
          // this.tableDataitem.push(data.data[0]);
        } else {
          this.$message.error(data.errorMsg);
        }
        this.dialogshow = true;
      })
      .catch(err => {
        this.loading = false;
      });
  }
  gotoAPPLive(item: any) {
    this.appDialog = true;
    this.classid = item.id;
  }
}
