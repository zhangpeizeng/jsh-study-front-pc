import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {}
})
export default class courseStatistical extends Vue {
  dataObj: any = "";

  cusStudyCount: any = ""; // 学习人数

  cusStudyProgressAvg: any = ""; // 平均学习进度

  cusStudyTimeAvg: any = ""; // 平均学习时长

  signNum: any = ""; // 报名人数

  joinerCount: any = ""; //参与考试的人数

  scoreAvg: any = ""; // 考试平均分

  taskNum: any = ""; // 作业提交人数

  pkNum: any = ""; // pk人数

  private initData(data: any): void {
    this.dataObj = data;
    if (data.signUpStatus == 1) {
      this.signPeopleQry(data.id, data.studyTerminal);
    }
    if (data.testStatus == 1) {
      this.testPeopleQry(data.id, data.studyTerminal);
    }
    if (data.taskStatus == 1) {
      this.taskSubmitQry(data.id, data.studyTerminal);
    }
    if (data.pkStatus == 1) {
      this.pkPeopleQry(data.id, data.studyTerminal);
    }
    this.studyPeopleQry(data.id, data.studyTerminal);
  }
  // 课程详情-学习人数+平均学习进度+平均学习时长
  private studyPeopleQry(id: any, studyTerminal: any) {
    Http.get(MarkeTing.studyPeopleQry, {
      baseId: id,
      studyTerminal: studyTerminal,
      classId: ""
    })
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.cusStudyCount = data.data.cusStudyCount;
          this.cusStudyProgressAvg = data.data.cusStudyProgressAvg;
          this.cusStudyTimeAvg = data.data.cusStudyTimeAvg;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }
  // 课程详情-报名人数
  private signPeopleQry(id: any, studyTerminal: any) {
    Http.get(MarkeTing.signPeopleQry, {
      baseId: id,
      studyTerminal: studyTerminal,
      classId: ""
    })
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.signNum = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }
  // 课程详情-考试人数+考试平均分
  private testPeopleQry(id: any, studyTerminal: any) {
    Http.get(MarkeTing.testPeopleQry, {
      baseId: id,
      studyTerminal: studyTerminal,
      classId: ""
    })
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.joinerCount = data.data.joinerCount;
          this.scoreAvg = data.data.scoreAvg;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }
  // 课程详情-作业提交数
  private taskSubmitQry(id: any, studyTerminal: any) {
    Http.get(MarkeTing.taskSubmitQry, {
      baseId: id,
      studyTerminal: studyTerminal,
      classId: ""
    })
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.taskNum = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }
  // 课程详情-参与PK数
  private pkPeopleQry(id: any, studyTerminal: any) {
    Http.get(MarkeTing.pkPeopleQry, {
      baseId: id,
      studyTerminal: studyTerminal,
      classId: ""
    })
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.pkNum = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }
  private created(): void {
    this.$emit("instance", this);
  }
}
