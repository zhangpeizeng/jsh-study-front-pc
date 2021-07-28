import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import TYPE from "../type/type";

@Component
export default class classDetailFooter extends Vue {
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
    type: Number,
    required: true
  })
  private isAssistant!: number;

  private CLASS_STATE_TYPE = TYPE.CLASS_STATE_TYPE;

  // 关闭当前页面
  private closeCurrentPage(): void {
    window.close();
    // 跳转到班级列表
    this.$router.push({
      path: "/class-manage-list"
    });
  }

  /**
   * 变更班级状态
   * @param status 班级状态更改为
   */
  private updateClassStatus(status: number) {
    Http.get(MarkeTing.updateClassStatus, {
      classId: this.classId,
      type: status
    })
      .then(res => {
        const { data } = res;
        if (data.success) {
          this.$emit("initClassBasicInfo");
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  // 删除当前课程
  private deleteCurrentclass() {
    this.$confirm("是否删除", "提示").then(() => {
      this.updateClassStatus(1);
      // 跳转到班级列表
      this.$router.push({
        path: "/class-manage-list"
      });
    });
  }

  // 当前课程开班
  private openCurrentclass() {
    this.$confirm("确认开班", "提示").then(() => {
      this.updateClassStatus(2);
    });
  }

  // 当前课程停班
  private stopCurrentclass() {
    this.$confirm("停班后学员将无法查看此班级，请确认", "提示").then(() => {
      this.updateClassStatus(3);
    });
  }

  // 当前课程结班
  private closeCurrentClass() {
    this.$confirm("是否确认结班", "提示", {
      confirmButtonText: "确认结班"
    }).then(() => {
      this.updateClassStatus(4);
    });
  }

  // 修改当前班级
  private editClass() {
    // 跳转到班级修改
    this.$router.push({
      path: "/add-class",
      query: {
        classId: this.classId,
        saveType: "1"
      }
    });
  }
}
