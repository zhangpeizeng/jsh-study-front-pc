import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import ShopDialogList from "@/views/marketing/shop-class/shop-dialog-list/shop-dialog-list.vue"; // 邀请弹框
import appLivePopup from "@/components/app-live-popup/app-live-popup.vue"; // app直播
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
import classSchedule from "@/components/class-manage/class-schedule/class-schedule.vue";
import { formatDate } from "@/utils";
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
  components: { classSchedule, ShopDialogList, appLivePopup }
})
export default class TimeTableSetting extends Vue {
  private classId: any = ""; // 班级id

  private courseRelaId: any = ""; // 班级关联课程id

  private drawerCor: boolean = false; // 是否显示Drawer，

  private drawerName: string = ""; // 抽屉title

  private loading: boolean = false; //是否正在加载

  private total: number = 0; // 总条目数

  private pageNum: number = 1;

  private pageSize: number = 10;

  private tableData: any = [];
  private sort: any = ""; // 现在排序
  private studyTerminalCode: any = ""; // 学习终端
  //邀请弹框控制
  private dialogshow: boolean = false;
  private tableDataitem: any = ""; // 弹窗数据
  private appDialog: boolean = false; //  APP直播弹窗
  private viewId: any = "";

  private classStartTime: any = "";
  private classEndTime: any = "";
  private created(): void {
    const {
      id,
      studyTerminalCode,
      classStartTime,
      classEndTime
    } = this.$route.query;
    this.classId = id;
    this.studyTerminalCode = studyTerminalCode;
    this.classStartTime = classStartTime;
    this.classEndTime = classEndTime;
    this.ManagementCoursesRela();
  }
  // 邀请
  private goInvite(item: any): void {
    this.opendialog(item.vhallLiveId, item);
  }
  // 打开邀请窗口
  private opendialog(vhallLiveId: any, detail: any): void {
    let owner = this;
    console.log(vhallLiveId, detail);
    Http.get(MarkeTing.getvhallliveurl, {
      classId: vhallLiveId
    })
      .then(res => {
        console.log(res);
        const { data } = res;
        if (data.success && data.data && data.data.length > 0) {
          data.data.forEach((itemto: any) => {
            if (detail) {
              if (detail.courseType === "2" || detail.courseType === "3") {
                let liveStartTime = "";
                if (detail.liveStartTime) {
                  liveStartTime = formatDate(
                    new Date(detail.liveStartTime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
                }
                itemto["liveStartTime"] = liveStartTime;
              } else {
                let studyStartTime = "";
                if (detail.studyStartTime) {
                  studyStartTime = formatDate(
                    new Date(detail.studyStartTime),
                    "yyyy-MM-dd hh:mm:ss"
                  );
                }
                itemto["liveStartTime"] = studyStartTime;
              }
            } else {
              itemto["liveStartTime"] = "-";
            }

            itemto["courseName"] = detail.courseName;
          });
          owner.tableDataitem = data.data;
          console.log("owner.tableDataitem", owner.tableDataitem);
        } else {
          console.log(data.errorMsg);
        }
        owner.dialogshow = true;
      })

      .catch(err => {
        console.log("");
        owner.dialogshow = true;
      });
  }
  // APP直播弹窗
  private appView(item: any) {
    this.appDialog = true;
    this.viewId = item.baseId;
  }
  // 添加课程
  private gotoadd(): void {
    this.drawerName = "添加课程";
    this.courseRelaId = 0; // 置空courseRelaId，防止和修改冲突
    this.classStartTime = this.classStartTime
      ? Number(this.classStartTime)
      : "";
    this.classEndTime = this.classEndTime ? Number(this.classEndTime) : "";
    this.drawerCor = true;
  }
  // 修改课程
  private gotoupdate(scope: any): void {
    this.drawerName = "修改课程";
    this.courseRelaId = scope.courseRelaId;
    this.classStartTime = scope.classStartTime;
    this.classEndTime = scope.classEndTime;
    this.drawerCor = true;
  }
  // 抽屉右上角叉号关闭抽屉
  private handleClose(done: any) {
    this.$confirm("确认关闭？")
      .then(_ => {
        done();
      })
      .catch(_ => {});
  }
  // 抽屉取消按钮关闭抽屉
  private drawerCloseCor() {
    this.$confirm("确认关闭？")
      .then(_ => {
        this.drawerCor = false;
      })
      .catch(_ => {});
  }
  // 抽屉确定
  private drawerConfirm() {
    this.drawerCor = false;
    this.ManagementCoursesRela();
  }
  // 获取课表设置列表
  private ManagementCoursesRela() {
    let that = this;
    this.loading = true;
    Http.get(MarkeTing.ManagementCoursesRela, {
      classId: this.classId,
      pageNum: that.pageNum,
      pageSize: that.pageSize
    })
      .then(res => {
        that.loading = false;
        if (res.data.success && res.data.data) {
          that.tableData = res.data.data.list;
          that.total = res.data.data.total;
        } else {
          that.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        that.loading = false;
        that.$message.error("服务器错误");
      });
  }

  // 每页条数
  private onpageNumSizeChange(pageSize: number): void {
    this.pageNum = 1;
    this.pageSize = pageSize;
    this.ManagementCoursesRela();
  }
  // 当前页改变时会触发
  private onpageNumNumChange(pageNum: number): void {
    this.pageNum = pageNum;
    this.ManagementCoursesRela();
  }
  // 打开课程详情新页签
  private gotoDetail(scope: any) {
    let newpage = this.$router.resolve({
      path: "/course-details",
      query: {
        courseId: scope.courseRelaId,
        classId: this.classId,
        studyTerminalCode: this.studyTerminalCode
      }
    });
    window.open(newpage.href, "_blank");
  }
  // 删除
  private gotoDelete(scope: any) {
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(MarkeTing.deleteClassCourses, { id: scope.courseRelaId }).then(
          res => {
            if (res.data.success && res.data.data) {
              this.ManagementCoursesRela();
            } else {
              this.$message.error(res.data.errorMsg);
            }
          }
        );
      })
      .catch(() => {});
  }
  // 向上移动
  private tabUp(value: any) {
    console.log("向上移动");
    this.courseRelaId = value.courseRelaId;
    this.sort = value.sort;
    this.updateClassSourceSort("up");
  }

  // 向下移动
  private tabDown(value: any) {
    console.log("向下移动");
    this.courseRelaId = value.courseRelaId;
    this.sort = value.sort;
    this.updateClassSourceSort("down");
  }
  // 请求排序接口
  private updateClassSourceSort(type: any) {
    Http.post(MarkeTing.updateClassSourceSort, {
      classId: this.classId,
      courseRelaId: this.courseRelaId,
      type: type,
      sort: this.sort
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.ManagementCoursesRela();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
