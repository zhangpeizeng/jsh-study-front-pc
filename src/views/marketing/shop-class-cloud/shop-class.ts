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
import ShopClassDetail from "@/views/marketing/course-detail/course-detail.vue";
import jobManagement from "@/views/marketing/job-management/job-management.vue";
import ApplicationList from "@/views/marketing/application-list/application-list.vue";
import messageManagement from "@/views/marketing/message-management/message-management.vue";
import playbackManagement from "@/views/marketing/playback-management/playback-management.vue";
import ShopClassTimeDetail from "@/views/marketing/shop-class/shop-class-time-detail/shop-class-time-detail.vue";
import StudentScope from "@/views/marketing/student-scope/student-scope.vue";
import Http, { MarkeTing } from "@/request";
import { copyText, formatDate } from "@/utils";
import ShopDialogList from "@/views/marketing/shop-class/shop-dialog-list/shop-dialog-list.vue";

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
    ShopDialogList
  }
})
export default class ShopClass extends Vue {
  public value: any = new Date();
  activeName = "class";
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
  //弹框控制
  private dialogshow: boolean = false;
  private tableDataitem: any;
  detail: any;
  detailshow = false;

  private created() {
    // this.classid = this.$route.params.id;
    const {
      classid,
      courseType,
      vhallLiveId,
      studyStartTime,
      courseName
    } = this.$route.query;
    this.classid = classid;
    this.courseType = courseType;
    this.vhallLiveId = vhallLiveId;
    this.copytext = "";
    this.studyStartTime = studyStartTime;
    this.courseName = courseName;
    this.onLoad(this.classid);
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

  handleClick() {
    console.log(event);
  }
}
