// ------OrderDemo page
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  Button,
  Calendar,
  Card,
  Popover,
  Progress,
  Alert,
  ButtonGroup,
  Tag
} from "element-ui";
import ShopClassDetail from "./course-basis/course-basis.vue";
import courseStatistics from "./course-count/course-count.vue";
import ShopDialogList from "@/views/marketing/shop-class/shop-dialog-list/shop-dialog-list.vue";
import Http, { MarkeTing } from "@/request";
import { copyText, formatDate } from "@/utils";

Vue.use(Card);
Vue.use(Button);
Vue.use(Progress);
Vue.use(Calendar);
Vue.use(Popover);
Vue.use(Alert);
Vue.use(ButtonGroup);
Vue.use(Tag);
@Component({
  components: {
    ShopClassDetail,
    courseStatistics,
    ShopDialogList
  }
})
export default class ShopClass extends Vue {
  public value: any = new Date();
  activeName: any = "class";
  appDialog: boolean = false;
  //弹框控制
  private dialogshow: boolean = false;
  private tableDataitem: any;
  detail: any;
  studyTerminalCode: any = [];
  detailshow = false;
  courseId: any = 0;
  classId: any = 0;
  courseType: any = 0;
  vhallLiveId: any = 0;
  copytext: any = 0;
  courseName: any = 0;
  studyStartTime: any = 0;
  liveStartTime: any = 0;

  gotoyaoqing() {
    this.dialogshow = true;
  }
  // 打开app直播弹窗
  gotoAPPLive() {
    this.appDialog = true;
  }
  opendialog(vhallLiveId: any, detail: any) {
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
              if (
                Number(this.courseType) === 2 ||
                Number(this.courseType) === 3
              ) {
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

            itemto["courseName"] = owner.courseName;
          });
          owner.tableDataitem = data.data;
          // console.log("owner.tableDataitem", owner.tableDataitem);
        } else {
          console.log(data.errorMsg);
        }
      })
      .catch(err => {
        console.log("");
      });
  }
  private onLoad(courseId: any): void {
    Http.get(MarkeTing.getClassCourseDetailById, {
      id: courseId
    })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          this.detail = res.data.data;
          this.courseType = this.detail.courseType;
          this.vhallLiveId = this.detail.vhallLiveId;
          this.studyStartTime = this.detail.studyStartTime;
          this.courseName = this.detail.courseName;
          this.detailshow = true;
        } else {
          this.$message.error(res.data.errorMsg);
          this.detailshow = false;
        }
        if (this.courseType === "2" || this.courseType === "3") {
          this.opendialog(this.vhallLiveId, this.detail);
        }
      })
      .catch(err => {
        this.detailshow = false;
        if (this.courseType === "2" || this.courseType === "3") {
          this.opendialog(this.vhallLiveId, this.detail);
        }
        console.log(err);
      });
  }

  private closeto(): void {
    window.close();
  }

  handleClick() {
    console.log(event);
  }
  private created() {
    const { courseId, classId, tabName, studyTerminalCode } = this.$route.query;
    this.courseId = courseId;
    this.classId = classId;
    this.studyTerminalCode = studyTerminalCode;
    this.courseType = studyTerminalCode;
    this.copytext = "";
    if (tabName) {
      this.activeName = tabName;
    }
    this.onLoad(this.courseId);
  }
}
