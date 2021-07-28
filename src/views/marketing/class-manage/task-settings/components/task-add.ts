import { Component, Prop, Vue } from "vue-property-decorator";
import { UEditor } from "@jsh/helper/components";
import advertPreview from "@/components/advert-manage/advert-preview/advert-preview.vue";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {
    advertPreview,
    UEditor
  }
})
export default class taskAdd extends Vue {
  @Prop({
    type: Number,
    required: false
  })
  id!: any;
  @Prop({
    type: String,
    required: false
  })
  saveType!: any;
  @Prop({
    type: [String, Number],
    required: false
  })
  classId!: any;
  toolbars: any = [
    "cleardoc", // 清空文档
    "|",
    "paragraph", // 段落格式
    "fontsize", // 字体大小
    "bold", // 加粗
    "italic", // 倾斜
    "underline", // 下划线
    "|",
    "forecolor", // 字体颜色
    "backcolor", // 背景颜色
    "|",
    "justifyleft", // 左对齐
    "justifycenter", // 居中对齐
    "justifyright", // 右对齐
    "|",
    "undo", // 撤销
    "redo", // 反向撤销
    "|",
    "135editor" // 135编辑器
  ];
  pattern: any = /<\/?(p|div|br|span|h[123456]|em|u|strong)[^<>]*>/g; //校验富文本内容
  submitTypeDtos: any = []; // 提交形式
  homeWorkList: any = [
    {
      submitType: 0,
      submitName: "图片",
      switchStatus: false,
      requiredStatus: 0
    },
    {
      submitType: 1,
      submitName: "视频",
      switchStatus: false,
      requiredStatus: 0
    },
    {
      submitType: 2,
      submitName: "音频",
      switchStatus: false,
      requiredStatus: 0
    },
    {
      submitType: 3,
      submitName: "文档",
      switchStatus: false,
      requiredStatus: 0
    },
    {
      submitType: 4,
      submitName: "内容描述",
      switchStatus: false,
      requiredStatus: 0
    }
  ];
  nowTime: any = ""; // 当前服务器时间
  private detailObj: any = ""; //作业详情
  private taskTheme: string = ""; // 作业主题
  previewDialog: boolean = false; // 预览
  instancePre: any = ""; // 预览
  taskDescription: string = ""; // 作业内容
  taskStartTime: any = ""; // 开始时间
  taskEndTime: any = ""; // 结束时间
  qualifiedScore: any = ""; // 合格分数
  classStartTime: any = "";
  classEndTime: any = "";
  // 作业禁止修改标识
  disabledTask: boolean = false;
  // 提交时间不能在今天之前
  pickerOptions: any = {
    disabledDate: (time: any) => {
      return this.dealDisabledDate(time);
    }
  };
  // 获取班级开始结束时间
  getClassTime() {
    Http.get(MarkeTing.getclasstime, { classId: this.classId })
      .then(resp => {
        if (resp.data.success) {
          this.classStartTime = resp.data.data.classStartTime;
          this.classEndTime = resp.data.data.classEndTime;
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(e => {
        console.log(e);
        this.$message.error("服务器异常");
      });
  }

  // 设置选择今天之前的日期
  // private dealDisabledDate(time: any) {
  //   if (this.nowTime > this.classStartTime) {
  //     return (
  //       time.getTime() < this.nowTime - 8.64e7 ||
  //       time.getTime() > this.classEndTime
  //     );
  //   } else {
  //     return (
  //       time.getTime() < this.classStartTime ||
  //       time.getTime() > this.classEndTime
  //     );
  //   }
  // }
  private dealDisabledDate(time: any) {
    return time.getTime() < Date.now() - 8.64e7;
  }
  private created(): void {
    // 获取当前服务器时间
    Http.post(MarkeTing.getNowDateTime, {})
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.nowTime = data.data;
          console.log(this.nowTime);
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
    if (this.saveType === "update") {
      this.getClassHomeworkDetail();
    }
    this.getClassTime();
  }
  // 新增修改保存接口
  private saveClassHomework() {
    let params = {
      classId: this.classId, // 班级id
      id: null, // 作业id
      taskStartTime: this.taskStartTime, //开始时间
      taskEndTime: this.taskEndTime, //结束时间
      taskTheme: this.taskTheme, //作业主题
      taskDescription: this.taskDescription, //作业要求
      qualifiedScore: this.qualifiedScore, //合格分
      submitTypeDtos: this.submitTypeDtos //提交形式
    };
    if (this.saveType === "update" && this.id) {
      params.id = this.id; // 修改时传入作业id
    }
    Http.post(MarkeTing.saveClassHomework, params).then(res => {
      if (res.data.success && res.data.data) {
        this.$emit("confirm");
      } else {
        this.$message.error(res.data.errorMsg);
      }
    });
  }
  // 确认
  private determineClick() {
    /*------------------拼装作业提交格式list---------------------------- */
    this.submitTypeDtos = [];
    this.homeWorkList.forEach((value: any) => {
      if (value.switchStatus) {
        this.submitTypeDtos.push({
          submitType: value.submitType,
          requiredStatus: value.requiredStatus
        });
      }
    });
    /*------------------拼装作业提交格式list--------------------------- */
    if (!this.taskTheme) {
      this.$message.error("请输入作业主题");
      return;
    }
    if (!this.taskDescription) {
      this.$message.error("请填写作业要求");
      return;
    }
    if (
      (this.taskStartTime && !this.taskEndTime) ||
      (!this.taskStartTime && this.taskEndTime)
    ) {
      this.$message.error("请填写作业提交时间");
      return;
    }
    if (
      this.taskStartTime &&
      this.taskEndTime &&
      this.taskStartTime > this.taskEndTime
    ) {
      this.$message.error("作业开始时间必须小于结束时间");
      return;
    }
    if (
      this.taskStartTime < this.classStartTime ||
      this.taskEndTime > this.classEndTime
    ) {
      this.$message.error("作业时间必须在班级时间范围内");
      return;
    }
    if (!this.qualifiedScore) {
      this.$message.error("请填写作业合格分");
      return;
    }
    if (this.submitTypeDtos.length == 0) {
      this.$message.error("请选择作业提交格式");
      return;
    }
    this.saveClassHomework();
  }
  // 获取作业详情
  private getClassHomeworkDetail() {
    Http.get(MarkeTing.getClassHomeworkDetail, { id: this.id }).then(res => {
      if (res.data.success && res.data.data) {
        this.detailObj = res.data.data;
        console.log(this.detailObj);
        this.taskTheme = this.detailObj.taskTheme; // 作业主题
        this.qualifiedScore = this.detailObj.qualifiedScore; // 合格分
        if (this.detailObj.taskStartTime && this.detailObj.taskEndTime) {
          this.taskStartTime = this.detailObj.taskStartTime; // 作业提交时间
          this.taskEndTime = this.detailObj.taskEndTime; // 作业提交时间
          if (this.nowTime > this.detailObj.taskStartTime) {
            this.disabledTask = true;
          }
        }
        if (this.detailObj.taskDescription) {
          this.taskDescription = this.detailObj.taskDescription; // 作业要求
        }
        if (this.detailObj.submitTypeDtos.length > 0) {
          this.homeWorkList.forEach((value: any) => {
            value.switchStatus = false;
          });
          this.detailObj.submitTypeDtos.forEach((value: any) => {
            if (value.submitType == 0) {
              this.homeWorkList[0].requiredStatus = value.requiredStatus;
              this.homeWorkList[0].switchStatus = true;
            } else if (value.submitType == 1) {
              this.homeWorkList[1].requiredStatus = value.requiredStatus;
              this.homeWorkList[1].switchStatus = true;
            } else if (value.submitType == 2) {
              this.homeWorkList[2].requiredStatus = value.requiredStatus;
              this.homeWorkList[2].switchStatus = true;
            } else if (value.submitType == 3) {
              this.homeWorkList[3].requiredStatus = value.requiredStatus;
              this.homeWorkList[3].switchStatus = true;
            } else if (value.submitType == 4) {
              this.homeWorkList[4].requiredStatus = value.requiredStatus;
              this.homeWorkList[4].switchStatus = true;
            }
          });
        }
      } else {
        this.$message.error(res.data.errorMsg);
      }
    });
  }

  //关闭
  private btnColse() {
    this.$emit("close");
  }
  // 富文本上传图片
  private savePicture(param: any) {
    return Http.post(MarkeTing.uploadPic, param);
  }
  private uploadImg(formData: any, config: any) {
    return Http.post(MarkeTing.uploadImgFile, formData, config);
  }
  // 获取预览组件实例
  private instancePreview(preview: any) {
    this.instancePre = preview;
  }
  // 预览
  private previewClick(textContent: any) {
    this.previewDialog = true;
    let params = {
      content: textContent
    };
    this.instancePre.showMask(params);
  }
  // 预览关闭
  private closeMask() {
    this.previewDialog = false;
  }
}
