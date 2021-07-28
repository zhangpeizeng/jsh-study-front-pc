import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import Uploader from "@/components/uploader/uploader.vue";
import uploadFile from "@/components/upload-file/upload-file.vue";
import selectLibraryTeacher from "@/components/select-library-teacher/select-library-teacher.vue";
import libraryAdd from "@/views/marketing/teacher-page/teacher-library-list/components/library-add.vue";

@Component({
  components: { Uploader, uploadFile, selectLibraryTeacher, libraryAdd }
})
export default class ClassSchedule extends Vue {
  @Prop({
    type: String,
    required: false
  })
  private classId!: any;

  @Prop({
    type: Number,
    required: false
  })
  private classRelaId!: any;

  @Prop({
    type: Number,
    required: false
  })
  private classStartTime!: any;

  @Prop({
    type: Number,
    required: false
  })
  private classEndTime!: any;

  saveType: any = "";

  updateObj: any = {};

  courseName: string = ""; // 课程名称

  courseType: number = 1;

  studyStartTime0: any = ""; // 上传的学习开始时间

  studyEndTime0: any = ""; // 上传的学习结束时间

  studyStartTime1: any = ""; // 选择已有课程的学习时间

  studyEndTime1: any = ""; // 选择已有课程的学习时间

  loadingInTable: boolean = false;

  disabledContent: boolean = false;
  // 课程内容禁止修改标识
  disabledCourse: boolean = false;

  videoUpdateFlag: boolean = true;

  voiceUpdateFlag: boolean = true;

  docUpdateFlag: boolean = true;

  nowTime: any = ""; // 当前服务器时间

  timeDisabled: boolean = false; // 限制上课开始时间修改标识

  tableData: Array<any> = [];

  choosedCourseList: Array<any> = []; // 选择的课程

  liveParamsDtoList: Array<any> = []; // 放视频音频文档的List

  courseNameQry: any = ""; // 全平台课程筛选条件

  selectTeacherDialog: boolean = false;
  lecturerLibraryId: any = null;
  lecturerName: any = "";
  drawerCor: boolean = false;
  instructorType: any = 1; // 授课讲师类型（1-海尔员工，2-外围讲师）
  submitDisable: boolean = false;

  //当前页
  private currentPage: number = 1;

  //页容量
  private pageSize: number = 10;

  //总条数
  private total: number = 0;

  //视频列表
  videoList: any = [];

  //音频列表
  voiceList: any = [];

  //文档列表
  docList: any = [];

  pickerOptions: any = {
    disabledDate: (time: any) => {
      return this.dealDisabledDate(time);
    }
  };
  // 设置选择今天之前的日期
  private dealDisabledDate(time: any) {
    return time.getTime() < Date.now() - 8.64e7;
  }
  private selectTeacher() {
    this.selectTeacherDialog = true;
  }
  private confirmTeacherPopup(data: any) {
    this.lecturerLibraryId = data.id;
    this.lecturerName = data.lecturerName;
    this.instructorType = 2;
  }
  private delLecturer(id: any) {
    if (id !== localStorage.getItem("accountId")) {
      this.lecturerLibraryId = null;
      this.instructorType = 1;
      this.lecturerName = localStorage.getItem("accountName");
    }
  }
  private addTeacherPopup() {
    this.drawerCor = true;
    this.selectTeacherDialog = false;
  }
  private handleClose(done: any) {
    this.$confirm("确认关闭？")
      .then(_ => {
        done();
        this.selectTeacherDialog = true;
      })
      .catch(_ => {});
  }
  private drawerCloseCor() {
    this.$confirm("确认关闭？")
      .then(_ => {
        this.drawerCor = false;
        this.selectTeacherDialog = true;
      })
      .catch(_ => {});
  }
  private drawerConfirm() {
    this.drawerCor = false;
    this.selectTeacherDialog = true;
  }

  private typeChange(value: any) {
    if (this.courseType === 2) {
      this.getCourseList();
    }
  }
  getVideo(data: any) {
    this.videoList = data;
    console.log("视频", data);
  }
  getVoice(data: any) {
    this.voiceList = data;
    console.log("音频", data);
  }
  getFile(data: any) {
    this.docList = data;
    console.log("文档", data);
  }
  //页码容量变化
  private handleSizeChange(pageSize: number) {
    this.currentPage = 1;
    this.pageSize = pageSize;
    if (this.saveType === "1") return;
    this.getCourseList();
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    if (this.saveType === "1") return;
    this.getCourseList();
  }
  //查询课程列表
  private getCourseList() {
    const params = {
      courseName: this.courseNameQry,
      classId: this.classId,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.loadingInTable = true;
    Http.post(MarkeTing.getClassCourseList, params)
      .then(resp => {
        if (resp.data.success) {
          if (document.getElementById("tableCourse")) {
            //@ts-ignore
            document
              .getElementById("tableCourse")
              .getElementsByClassName(
                "el-table__body-wrapper"
              )[0].scrollTop = 0;
          }
          this.tableData = resp.data.data.list;
          this.total = resp.data.data.total;
        } else {
          this.$message.error(resp.data.errorMsg);
          this.tableData = [];
          this.total = 0;
        }
      })
      .catch(error => {
        this.$message.error("服务器错误");
        this.tableData = [];
        this.total = 0;
      })
      .finally(() => {
        this.loadingInTable = false;
      });
  }
  private courseQry() {
    if (this.saveType === "1") return;
    this.getCourseList();
  }
  //选择
  private handleAdd(data: any) {
    this.choosedCourseList = [
      {
        id: data.id,
        status: data.status
      }
    ];
    this.studyStartTime0 = data.studyStartTime;
    this.studyEndTime0 = data.studyEndTime;
  }

  //判断是否已选
  private existedFilter(data: any, type: any) {
    var flag = false;
    const existedLength2 = this.choosedCourseList.filter(item => {
      return item.id == data.id;
    }).length;
    if (existedLength2 > 0) {
      flag = true;
    }
    return flag;
  }

  private save() {
    if (!this.courseName) {
      this.$message.error("请输入课程名称");
      return;
    }
    if (this.courseType === 1) {
      if (
        (this.studyStartTime1 && !this.studyEndTime1) ||
        (!this.studyStartTime1 && this.studyEndTime1)
      ) {
        this.$message.error("请填写上课时间");
        return;
      }
      if (
        this.studyStartTime1 &&
        this.studyEndTime1 &&
        this.studyStartTime1 > this.studyEndTime1
      ) {
        this.$message.error("上课开始时间必须小于结束时间");
        return;
      }
      // 上课时间不填默认赋值班级开始结束时间
      if (!this.studyStartTime1 && !this.studyStartTime1) {
        this.studyStartTime1 = this.classStartTime;
        this.studyEndTime1 = this.classEndTime;
      }
      if (this.saveType === "1") {
        // 修改的上课时间不能大于班级结束时间
        if (this.studyEndTime1 > this.classEndTime) {
          this.$message.error("上课结束时间必须小于班级结束时间");
          return;
        }
      } else {
        if (
          this.studyStartTime1 < this.classStartTime ||
          this.studyEndTime1 > this.classEndTime
        ) {
          this.$message.error("上课时间必须在班级时间范围内");
          return;
        }
      }
    }
    // 上传资料
    if (this.courseType === 1) {
      /*-----------------拼装课程内容的list---------------------------- */
      this.liveParamsDtoList = [];
      if (this.videoList) {
        this.liveParamsDtoList = this.liveParamsDtoList.concat(this.videoList);
      }
      if (this.voiceList) {
        this.liveParamsDtoList = this.liveParamsDtoList.concat(this.voiceList);
      }
      if (this.docList) {
        this.liveParamsDtoList = this.liveParamsDtoList.concat(this.docList);
      }
      /*-----------------拼装课程内容的list---------------------------- */
      if (this.liveParamsDtoList.length === 0) {
        this.$message.error("请至少维护一个课程内容");
        return;
      }
      const params = {
        coursesRelaId: null, // 班级课程id
        classId: this.classId, // 班级id
        name: this.courseName, // 班级的课程名称
        type: this.courseType, // 课程类型（1-上传资料，2-选择课程）
        studyStartTime: this.studyStartTime1, // 上课开始时间
        studyEndTime: this.studyEndTime1, // 上课结束时间
        instructorType: this.instructorType, // 授课讲师类型
        lecturerLibraryId: this.lecturerLibraryId, // 授课讲师id
        sort: "", // 排序
        liveParamsDtoList: this.liveParamsDtoList, // 媒体list
        courseType: "6"
      };
      if (this.saveType === "1") {
        params.sort = this.updateObj.sort;
        params.coursesRelaId = this.classRelaId;
      }
      this.saveClassCourse(params);
    } else if (this.courseType === 2) {
      if (this.choosedCourseList.length === 0) {
        this.$message.error("请选择一个课程");
        return;
      }
      const params = {
        coursesRelaId: null,
        classId: this.classId,
        name: this.courseName,
        type: this.courseType,
        baseId: this.choosedCourseList[0].id,
        status: this.choosedCourseList[0].status,
        sort: ""
      };
      if (this.saveType === "1") {
        params.sort = this.updateObj.sort;
        params.coursesRelaId = this.classRelaId;
      }
      this.saveClassCourse(params);
    }
  }
  private saveClassCourse(params: any) {
    this.submitDisable = true;
    Http.post(MarkeTing.saveClassCourse, params)
      .then(res => {
        if (res.data.success) {
          this.$emit("confirm", "");
        } else {
          this.submitDisable = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(err => {
        this.submitDisable = false;
      });
  }
  private getClassCourseDetail() {
    Http.get(MarkeTing.getClassCourseDetail, { classRelaId: this.classRelaId })
      .then(res => {
        if (res.data.success) {
          this.updateObj = res.data.data;
          if (this.updateObj.type === "1") {
            this.courseType = Number(this.updateObj.type);
            this.courseName = this.updateObj.name;
            this.studyStartTime1 = this.updateObj.studyStartTime;
            this.studyEndTime1 = this.updateObj.studyEndTime;
            // 当前时间大于班级开始时间，开始时间不可编辑
            if (this.nowTime > this.updateObj.studyStartTime) {
              this.disabledCourse = true;
              this.timeDisabled = true;
            }
            // 授课讲师是否删除 0 否 1是
            if (this.updateObj.lecturerDelFlag === 0) {
              this.lecturerLibraryId = this.updateObj.lecturerLibraryId; // 授课讲师id
              this.instructorType = this.updateObj.instructorType;
              this.lecturerName = this.updateObj.lecturerName; // 授课讲师名称
            } else {
              this.lecturerLibraryId = null;
              this.instructorType = 1;
              this.lecturerName = localStorage.getItem("accountName");
            }
            this.dealMediaList(this.updateObj.liveParamsDtoList);
            // 针对修改的时候,对课程内容的显示隐藏做处理
            if (this.videoList.length == 0 && this.disabledCourse) {
              this.videoUpdateFlag = false; // 视频
            }
            if (this.voiceList.length == 0 && this.disabledCourse) {
              this.voiceUpdateFlag = false; // 音频
            }
            if (this.docList.length == 0 && this.disabledCourse) {
              this.docUpdateFlag = false; // 文档
            }
          } else {
            this.courseType = Number(this.updateObj.type);
            this.courseName = this.updateObj.name;
            this.studyStartTime0 = this.updateObj.studyStartTime;
            this.studyEndTime0 = this.updateObj.studyEndTime;
            // 已选择课程不能继续编辑
            this.tableData = [
              {
                id: this.updateObj.baseId,
                courseName: this.updateObj.courseName,
                lecturerName: this.updateObj.lecturerName,
                studyTerminal: this.updateObj.studyTerminal,
                studyStartTime: this.updateObj.studyStartTime,
                studyEndTime: this.updateObj.studyEndTime,
                deleteFlg: this.updateObj.deleteFlg,
                status: this.updateObj.status
              }
            ];
            this.total = 1;
            this.choosedCourseList = [
              {
                id: this.updateObj.baseId,
                status: this.updateObj.status
              }
            ];
          }
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(err => {});
  }
  private dealMediaList(list: any) {
    if (list) {
      list.forEach((value: any) => {
        if (value.liveType == "1") {
          this.videoList.push(value);
        } else if (value.liveType == "2") {
          this.voiceList.push(value);
        } else if (value.liveType == "3") {
          this.docList.push(value);
        }
      });
    }
  }

  private created(): void {
    this.lecturerName = localStorage.getItem("accountName");
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
    if (this.classRelaId) {
      this.saveType = "1";
    }
    // 修改
    if (this.saveType === "1") {
      this.disabledContent = true;
      this.getClassCourseDetail();
    }
  }
}
