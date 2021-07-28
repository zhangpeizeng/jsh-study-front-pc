/**
 *@desc:学生进度
 *@date: 2021-08-04 14:44:38
 */
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import TYPE from "../type/type";

@Component({})
export default class studentProgress extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private classId!: string;

  @Prop({
    type: Number,
    required: true
  })
  private classStatus!: number;

  @Prop({
    type: String,
    required: true
  })
  private studyTerminalCode!: string;
  // data

  // 班级人数
  private studentCount: number = 0;
  // 已加入人数
  private joinedCount: number = 0;
  // 班级是否需要审核
  private auditStatus: 0 | 1 = 0;
  // 默认学员管理状态
  private studentStatus: string = "-1";
  // 管理学员的操作名称
  private operationName: string = "";
  // 班级加入学员百分比，用于进度条显示
  private get percentage() {
    return this.joinedCount > this.studentCount
      ? 1
      : (this.joinedCount / this.studentCount) * 100 || 0;
  }

  // created
  private created() {
    this.getClassStudentStatusData();
  }

  // methods
  // 操作名称，显示的中文名
  @Watch("classStatus")
  private getOperationName() {
    switch (this.classStatus) {
      case TYPE.CLASS_STATE_TYPE.DRAFT: // 草稿
      case TYPE.CLASS_STATE_TYPE.CLASS_IN_PROGRESS: // 进行中
      case TYPE.CLASS_STATE_TYPE.END_OF_COURSE: // 已结课
      case TYPE.CLASS_STATE_TYPE.CLASS_INTERRUPT: // 已停班
        this.operationName = "去管理";
        break;
      case TYPE.CLASS_STATE_TYPE.BEFORE_CLASS:
        // 开班之前需要审核显示“去审核”，不需要审核显示“去管理”
        this.operationName = this.auditStatus ? "去审核" : "去管理";
        this.studentStatus = this.auditStatus ? "1" : "";
        break;
      case TYPE.CLASS_STATE_TYPE.END_OF_CLASS:
        // 已结班
        this.studentStatus = "9";
        this.operationName = "去评定";
        break;
      default:
        return "";
    }
  }

  /**
   * 跳转学员管理页面
   */
  private openManageStudents() {
    // todo 添加学员管理页面的路由
    this.$router.push({
      path: "/student-manage",
      query: {
        studentStatus: this.studentStatus,
        classId: this.classId,
        enrollNum: String(this.studentCount),
        classStatus: String(this.classStatus),
        auditStatus: String(this.auditStatus),
        studyTerminalCode: String(this.studyTerminalCode)
      }
    });
  }
  // 获取学员信息
  private getClassStudentStatusData() {
    Http.get(MarkeTing.getClassStudentStatusData, { classId: this.classId })
      .then(res => {
        const { data } = res;
        if (data.success) {
          // 更新班级统计
          const { studentCount, joinedCount, auditStatus } = data.data;
          // 可加入的学员总数
          this.studentCount = studentCount;
          // 加入的学员数
          this.joinedCount = joinedCount;
          // 班级是否需要审核
          this.auditStatus = auditStatus;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
