/**
 *@desc: 班级数据统计
 *@date: 2021-08-04 13:30:24
 */

import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

const STTENDANCE_RATE_BGIMG = require("@/assets/images/course-sign.png");
const STUDENTSNUM_BGIMG = require("@/assets/images/course-study.png");
const AVERAGE_LEARNING_PROGRESS_BGIMG = require("@/assets/images/course-progress.png");
const AVERAGE_LEARNING_TIME_BGIMG = require("@/assets/images/course-time.png");

@Component
export default class classStatistical extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private classId!: string;

  private statistical: any = {
    attendanceRate: {
      title: "出勤率",
      bgImg: STTENDANCE_RATE_BGIMG
    },
    studentsNum: {
      title: "学习人数",
      bgImg: STUDENTSNUM_BGIMG
    },
    averageLearningProgress: {
      title: "平均学习进度",
      bgImg: AVERAGE_LEARNING_PROGRESS_BGIMG
    },
    averageLearningTime: {
      title: "平均学习时长",
      bgImg: AVERAGE_LEARNING_TIME_BGIMG
    }
  };

  private created() {
    this.getClassBasicInfo(this.classId);
  }

  /**
   * 获取班级统计
   * @param classId 班级ID
   */
  private getClassBasicInfo(classId: string) {
    Http.get(MarkeTing.getClassStatisticalData, { classId })
      .then(res => {
        const { data } = res;
        if (data.success) {
          // 更新班级统计
          const {
            attendance,
            studyCount,
            averageStudyProgress,
            averageStudyTime
          } = data.data;
          // 更新班级状态
          this.$set(
            this.statistical.attendanceRate,
            "desc",
            attendance || 0 + "%"
          );
          this.$set(this.statistical.studentsNum, "desc", studyCount || 0);
          this.$set(
            this.statistical.averageLearningProgress,
            "desc",
            averageStudyProgress || 0 + "%"
          );
          this.$set(
            this.statistical.averageLearningTime,
            "desc",
            averageStudyTime || 0 + "分钟"
          );
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
}
