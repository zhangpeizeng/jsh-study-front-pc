import Vue from "vue";
import { Component, Watch, Prop } from "vue-property-decorator";
import classSchedule from "@/components/class-manage/class-schedule/class-schedule.vue";
import Http, { MarkeTing } from "@/request";
import TYPE from "../type/type";

@Component({
  name: "classTimetable",
  filters: {
    getSerialNumber: (index: number) => {
      return (index + 1 > 9 ? "" : "0") + String(index + 1);
    }
  },
  components: { classSchedule }
})
export default class classTimetable extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private classId!: string;

  @Prop({
    type: String,
    required: true
  })
  private studyTerminalCode!: string; // 终端code

  @Prop({
    type: Object,
    required: true
  })
  private classBasicInfo!: any;

  private COURSE_TYPE = TYPE.COURSE_TYPE;

  // 课表总数
  private total: number = 0;

  private pageSize: number = 6;

  private created() {
    // 获取班级列表
    this.getClassTimetable(this.pageSize);
  }

  // 课表
  private classTimetableAll: any = [];

  get classTimetable() {
    return this.toMoreFlag
      ? this.classTimetableAll
      : this.classTimetableAll.slice(0, 6);
  }

  // 新建课表flag
  private timetableDrawerCor: boolean = false;

  // 是否请求过全部课表
  private isAllTimetableFlag: boolean = false;

  // 查看更多flag
  private toMoreFlag: boolean = false;

  // 班级开始时间
  private classStartTime: number = 0;

  // 班级结束时间
  private classEndTime: number = 0;

  // 打开新建课表抽屉

  private drawerOpenCor() {
    this.classStartTime = this.classBasicInfo.classStartTime;
    this.classEndTime = this.classBasicInfo.classEndTime;
    this.timetableDrawerCor = true;
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
        this.timetableDrawerCor = false;
      })
      .catch(_ => {});
  }
  // 抽屉确定
  private drawerConfirm() {
    this.timetableDrawerCor = false;
    this.toMoreFlag = false;
    this.total = 0;
    this.getClassTimetable(6);
  }

  // 跳转课表设置
  private timetableSetting() {
    this.$router.push({
      path: "/timetable-setting",
      query: {
        id: this.classId,
        studyTerminalCode: this.studyTerminalCode,
        classStartTime: this.classBasicInfo.classStartTime,
        classEndTime: this.classBasicInfo.classEndTime
      }
    });
  }
  // 课表展开和收起
  private changeToMoreFlag() {
    if (this.total !== this.classTimetableAll.length) {
      // 第一次点击查看更多时请求全部的课表数据
      this.getClassTimetable(this.total);
    }
    this.toMoreFlag = !this.toMoreFlag;
  }

  /**
   * 获取班级列表
   * 与后端预定，课表以分页形式请求，第一次请求只请求默认显示的个数，点击查看更多请求全部
   * @param classId 班级id
   */
  private getClassTimetable(pageSize: number) {
    Http.get(MarkeTing.listClassCoursesRela, {
      classId: this.classId,
      pageNum: 1,
      pageSize
    })
      .then(res => {
        const { data } = res;
        if (data.success) {
          // 更新班级课表
          this.classTimetableAll = data.data.list;
          // 更新课表数量
          this.total = data.data.total;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  /**
   * 跳转课表详情
   * @param id 课表id
   */
  private viewTimetable(id: any) {
    window.open(
      this.$router.resolve({
        path: "/course-details",
        query: {
          classId: this.classId,
          courseId: id,
          studyTerminalCode: this.studyTerminalCode
        }
      }).href,
      "_blank"
    );
  }
}
