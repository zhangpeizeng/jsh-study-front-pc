import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import Uploader from "@/components/uploader/uploader.vue";

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
import uploadFile from "@/components/upload-file/upload-file.vue";

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Tabs)
  .use(TabPane);

@Component({
  components: { Uploader, uploadFile }
})
export default class addCoursePopup extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  private updatePopupObj!: any;

  @Prop({
    type: Array,
    required: true
  })
  private studyTerminalList!: any;

  courseName: string = ""; // 课程名称

  courseType: number = 1;

  studyStartTime0: any = ""; // 上传的学习开始时间

  studyEndTime0: any = ""; // 上传的学习结束时间

  studyStartTime1: any = ""; // 选择已有课程的学习时间

  studyEndTime1: any = ""; // 选择已有课程的学习时间

  loadingInTable: boolean = false;

  disabledContent: boolean = false;

  tableData: Array<any> = [];

  choosedCourseList: Array<any> = []; // 选择的课程

  liveParamsDtoList: Array<any> = []; // 放视频音频文档的List

  courseNameQry: any = ""; // 全平台课程筛选条件

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
    this.getCourseList();
  }

  //当前页码变化
  private handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage;
    this.getCourseList();
  }
  //查询课程列表
  private getCourseList() {
    const params = {
      courseName: this.courseNameQry,
      studyTerminalList: this.studyTerminalList,
      pageNum: this.currentPage,
      pageSize: this.pageSize
    };
    this.loadingInTable = true;
    Http.post(MarkeTing.getAllPlatList, params)
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
    this.getCourseList();
  }
  //选择
  private handleAdd(data: any) {
    this.choosedCourseList = [
      {
        id: data.id,
        courseName: data.courseName,
        lecturerName: data.lecturerName,
        studyTerminal: data.studyTerminal,
        courseType: data.courseType,
        studyStartTime: data.studyStartTime,
        studyEndTime: data.studyEndTime,
        deleteFlg: data.deleteFlg,
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
    console.log();
    if (!this.courseName) {
      this.$message.error("请输入课时名称");
      return;
    }
    if (this.courseType === 1) {
      if (
        (this.studyStartTime1 && !this.studyEndTime1) ||
        (!this.studyStartTime1 && this.studyEndTime1)
      ) {
        this.$message.error("请填写学习时间");
        return;
      }
      if (
        this.studyStartTime1 &&
        this.studyEndTime1 &&
        this.studyStartTime1 > this.studyEndTime1
      ) {
        this.$message.error("学习开始时间必须小于结束时间");
        return;
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
        id: null,
        name: this.courseName,
        type: this.courseType, // 课程类型（1-上传资料，2-选择课程）
        studyStartTime: this.studyStartTime1,
        studyEndTime: this.studyEndTime1,
        sort: "",
        liveParamsDtoList: this.liveParamsDtoList,
        courseType: "5"
      };
      if (Object.keys(this.updatePopupObj).length != 0) {
        params.sort = this.updatePopupObj.sort;
        params.id = this.updatePopupObj.id;
      }
      this.$emit("confirm", params);
    } else if (this.courseType === 2) {
      const params = {
        name: this.courseName,
        type: this.courseType,
        courseName: this.choosedCourseList[0].courseName,
        liveCoursesId: this.choosedCourseList[0].id,
        studyTerminal: this.choosedCourseList[0].studyTerminal,
        studyStartTime: this.choosedCourseList[0].studyStartTime,
        studyEndTime: this.choosedCourseList[0].studyEndTime,
        courseType: this.choosedCourseList[0].courseType,
        lecturerName: this.choosedCourseList[0].lecturerName,
        deleteFlg: this.choosedCourseList[0].deleteFlg,
        status: this.choosedCourseList[0].status,
        sort: ""
      };
      if (Object.keys(this.updatePopupObj).length != 0) {
        params.sort = this.updatePopupObj.sort;
      }
      this.$emit("confirm", params);
    }
    this.$emit("cancel");
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
    if (this.updatePopupObj && Object.keys(this.updatePopupObj).length != 0) {
      this.disabledContent = true;
      this.courseName = this.updatePopupObj.name;
      // 页面开关需要number类型
      if (
        this.updatePopupObj.type &&
        typeof this.updatePopupObj.type == "string"
      ) {
        this.courseType = Number(this.updatePopupObj.type);
      } else {
        this.courseType = this.updatePopupObj.type;
      }
      if (this.updatePopupObj.type == 1) {
        this.studyStartTime1 = this.updatePopupObj.studyStartTime;
        this.studyEndTime1 = this.updatePopupObj.studyEndTime;
        if (this.updatePopupObj.liveParamsDtoList) {
          this.dealMediaList(this.updatePopupObj.liveParamsDtoList);
        }
      } else if (this.updatePopupObj.type == 2) {
        this.getCourseList();
        this.studyStartTime0 = this.updatePopupObj.studyStartTime;
        this.studyEndTime0 = this.updatePopupObj.studyEndTime;
        this.choosedCourseList = [
          {
            id: this.updatePopupObj.liveCoursesId,
            courseName: this.updatePopupObj.courseName,
            studyTerminal: this.updatePopupObj.studyTerminal,
            lecturerName: this.updatePopupObj.lecturerName,
            studyStartTime: this.updatePopupObj.studyStartTime,
            studyEndTime: this.updatePopupObj.studyEndTime
          }
        ];
      }
    }
  }
}
