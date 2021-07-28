import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import addCoursePopup from "@/components/course-popup/add-course-popup/add-course-popup.vue";
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
import { copyText, formatDate } from "@/utils";
import courseDetailPopup from "@/components/course-popup/course-detail-popup/course-detail-popup.vue";
import ShopDialogList from "@/views/marketing/shop-class/shop-dialog-list/shop-dialog-list.vue";
import appLivePopup from "@/components/app-live-popup/app-live-popup.vue"; // app直播

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Tabs)
  .use(TabPane);

interface tableData {
  readonly name: string; // 课时名称
  readonly liveCoursesId: string; // 课时名称
  readonly type: string; // 课程类型（1-上传资料，2-选择课程）
  readonly studyStartTime: string; // 学习开始时间
  readonly studyEndTime: string; // 学习结束时间
  readonly sort: string; // 排序
  readonly liveParamsDtoList: Array<liveParamsDtoList>; // 上传的文档
}

interface liveParamsDtoList {
  readonly id: string; // id
  readonly liveId: string; // 视频/音频/文档id
  readonly liveName: string; // 视频/音频/文档名称
  readonly liveType: string; // 类型（1-视频，2-音频 ，3-文档）
  readonly sourceType?: string | number; // 来源类型（1-普通，2-系列课自建）
}

@Component({
  components: {
    addCoursePopup,
    courseDetailPopup,
    ShopDialogList,
    appLivePopup
  }
})
export default class ShopClassTimeDetail extends Vue {
  tableData: Array<tableData> = []; // 课时信息的list

  @Prop({
    type: String,
    required: false
  })
  classid!: any;
  detailPopupObj: any = ""; // 课时详情弹窗对象

  updatePopupObj: any = ""; // 课时去修改的对象
  labelCode: any = ""; // 课时去修改的对象
  addCourseDialog: boolean = false;

  detailCourseDialog: boolean = false;
  private loading: boolean = false;
  private detail: any = {};
  nowTime: any = ""; // 当前服务器时间
  private dialogshow: boolean = false;
  private tableDataitem: any;
  private appDialog: boolean = false;

  private viewId: any = "";

  // 获取详情
  private getDetail(id: any) {
    Http.get(MarkeTing.listseriescoursesbybaseid, { baseId: id })
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.tableData = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  // 发布
  private save() {
    this.insertCourse();
  }
  private insertCourse() {
    this.loading = true;
    // 对排序重新赋值
    this.tableData.forEach((value: any, index: any) => {
      value.sort = index + 1;
    });
    Http.post(MarkeTing.insertseriescourses, {
      baseId: this.classid,
      seriesCoursesList: this.tableData
    })
      .then(res => {
        this.loading = false;
        const { data } = res;
        if (data.success) {
          console.log("保存成功");
          this.$message.success("保存成功");
          this.getDetail(this.classid);
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.loading = false;
        this.$message.error("服务器错误");
      });
  }
  private addCourse() {
    // 新增初始化掉修改的数据
    this.updatePopupObj = {};
    this.addCourseDialog = true;
  }

  private confirmPopup(value: any) {
    // 修改
    if (Object.keys(this.updatePopupObj).length != 0) {
      this.tableData.forEach((value1: any) => {
        // debugger
        if (value1.sort == value.sort) {
          if (value1.type == 1) {
            value1.name = value.name;
            value1.type = value.type;
            value1.courseType = value.courseType;
            value1.studyStartTime = value.studyStartTime;
            value1.studyEndTime = value.studyEndTime;
            value1.liveParamsDtoList = value.liveParamsDtoList;
          } else if (value1.type == 2) {
            value1.name = value.name;
            value1.type = value.type;
            value1.courseName = value.courseName;
            value1.studyTerminal = value.studyTerminal;
            value1.studyStartTime = value.studyStartTime;
            value1.studyEndTime = value.studyEndTime;
            value1.liveCoursesId = value.liveCoursesId;
            value1.courseType = value.courseType;
            value1.lecturerName = value.lecturerName;
            value1.deleteFlg = value.deleteFlg;
            value1.status = value.status;
          }
        }
      });
      console.log(this.tableData);
      // this.$forceUpdate();
    } else {
      value.sort = this.tableData.length;
      this.tableData.push(value);
      // 对排序重新赋值
      this.tableData.forEach((value: any, index: any) => {
        value.sort = index + 1;
      });
    }
  }

  // 课时详情
  private openDetail(item: any) {
    this.detailPopupObj = item;
    this.detailCourseDialog = true;
  }
  // 邀请
  private invitation(item: any) {
    // let text = `您关注的课堂即将开讲了，请准时参加！课程名称：${"我是11"} 开始时间：${"20110926"} 讲师口令：${
    //   item.id
    // } 加入链接：${item.logoUrl}`;
    // copyText(text, () => {
    //   this.$message({
    //     message: "复制成功!",
    //     type: "success"
    //   });
    // });
    this.opendialog(item.vhallLiveId, item);
  }
  // APP直播弹窗
  private appView(item: any) {
    this.appDialog = true;
    this.viewId = item.baseId;
  }
  // 课时详情删除
  private deleteCourse(item: any) {
    for (let i = 0; i < this.tableData.length; i++) {
      if (this.tableData[i].sort == item.sort) {
        this.tableData.splice(i, 1);
        i--;
      }
    }
  }

  // 课时详情去修改
  private updateCourse(item: any) {
    this.updatePopupObj = item;
    this.addCourseDialog = true;
  }

  // 向上移动
  private tabUp(value: any, index: any) {
    if (index !== 0) {
      this.tableData[index] = this.tableData.splice(
        index - 1,
        1,
        this.tableData[index]
      )[0];
    }
  }
  // 向下移动
  private tabDown(value: any, index: any) {
    if (index !== this.tableData.length - 1) {
      this.tableData[index] = this.tableData.splice(
        index + 1,
        1,
        this.tableData[index]
      )[0];
    }
  }
  private onLoad(classid: any): void {
    this.loading = true;
    Http.get(MarkeTing.getcollegemarketingbyid, {
      id: classid
    })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          this.detail = res.data.data;
          this.labelCode = this.detail.studyTerminals;
        }
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
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
  private closeto(): void {
    window.close();
  }
  private created(): void {
    console.log(this.classid);
    this.getDetail(this.classid);
    this.onLoad(this.classid);
    // 获取当前服务器时间
    Http.post(MarkeTing.getNowDateTime, {})
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.nowTime = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
