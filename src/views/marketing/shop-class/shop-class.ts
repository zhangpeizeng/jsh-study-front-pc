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
import ShopClassDetail from "@/views/marketing/shop-class/shop-class-detail/shop-class-detail.vue";
import jobManagement from "@/views/marketing/job-management/job-management.vue";
import ApplicationList from "@/views/marketing/application-list/application-list.vue";
import messageManagement from "@/views/marketing/message-management/message-management.vue";
import playbackManagement from "@/views/marketing/playback-management/playback-management.vue";
import ShopClassTimeDetail from "@/views/marketing/shop-class/shop-class-time-detail/shop-class-time-detail.vue";
import StudentScope from "@/views/marketing/student-scope/student-scope.vue";
import courseStatistics from "@/views/marketing/course-statistics/course-statistics.vue";
import Http, { MarkeTing } from "@/request";
import { copyText, formatDate } from "@/utils";
import ShopDialogList from "@/views/marketing/shop-class/shop-dialog-list/shop-dialog-list.vue";
import assistantTeacher from "@/views/marketing/shop-class/assistant-teacher/assistant-teacher.vue"; // 助教管理
import evaluationManagement from "@/views/marketing/shop-class/evaluation-management/evaluation-management.vue"; // 助教管理
import courseRecommended from "@/views/marketing/shop-class/course-recommended/course-recommended.vue"; // 课程推荐
import appLivePopup from "@/components/app-live-popup/app-live-popup.vue"; // app直播

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
    jobManagement,
    ApplicationList,
    messageManagement,
    playbackManagement,
    ShopClassTimeDetail,
    StudentScope,
    ShopDialogList,
    // 课程统计
    courseStatistics,
    assistantTeacher,
    evaluationManagement,
    courseRecommended,
    appLivePopup
  }
})
export default class ShopClass extends Vue {
  public value: any = new Date();
  activeName: any = "class";
  @Prop({
    type: Number,
    required: false
  })
  classid?: any;
  courseType?: any;
  vhallLiveId?: any;
  copytext?: any = "";
  courseName?: any = "";
  studyStartTime?: any = "";
  liveStartTime?: any = "";
  appDialog: boolean = false;
  //弹框控制
  private dialogshow: boolean = false;
  private tableDataitem: any;
  detail: any;
  newStudyTerminals: any = [];
  detailshow = false;

  private created() {
    // this.classid = this.$route.params.id;
    const {
      classid,
      courseType,
      vhallLiveId,
      studyStartTime,
      courseName,
      tabName
    } = this.$route.query;
    this.classid = classid;
    this.courseType = courseType;
    this.vhallLiveId = vhallLiveId;
    this.copytext = "";
    this.studyStartTime = studyStartTime;
    this.courseName = courseName;
    if (tabName) {
      this.activeName = tabName;
    }
    this.needStudyterminalPower();
    console.log(this.classid, courseType);
  }
  gotoyaoqing() {
    // copyText(this.copytext, () => {
    //   this.$message({
    //     message: "复制成功!",
    //     type: "success"
    //   });
    // });
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
              if (this.courseType === "2" || this.courseType === "3") {
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
          console.log("owner.tableDataitem", owner.tableDataitem);
        } else {
          console.log(data.errorMsg);
        }
      })
      .catch(err => {
        console.log("");
      });
  }
  private onLoad(classid: any): void {
    Http.get(MarkeTing.getcollegemarketingbyid, {
      id: classid
    })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          this.detail = res.data.data;
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

  /**
   * 获取当前登录人终端权限和课程投放设置终端权限的交集
   */
  needStudyterminalPower() {
    Http.post(MarkeTing.listCourseTerminalAndAccount, { baseId: this.classid })
      .then(resp => {
        if (resp.data.success) {
          this.newStudyTerminals = resp.data.data;
          this.onLoad(this.classid);
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
  }

  handleClick() {
    console.log(event);
  }
}
