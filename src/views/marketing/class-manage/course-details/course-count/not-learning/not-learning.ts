// ------ job-management page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Axios from "axios";
import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination,
  DatePicker
} from "element-ui";
Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination)
  .use(DatePicker);
import { download } from "@/utils/downloadImg";
import Http, { Exchange, MarkeTing } from "@/request";
import { formatDate } from "@/utils";

@Component({
  components: {}
})
export default class jobManagement extends Vue {
  @Prop({
    type: [Number, String],
    required: false
  })
  classid!: any;
  @Prop({
    required: false
  })
  idClass!: any;
  @Prop({
    type: [Array, Object],
    required: false
  })
  detail!: any;
  @Prop({
    required: false
  })
  terminalCode!: any;

  activeName = "already";
  bodyLoading: boolean = false;
  //加载状态
  loading: boolean = false;
  //z组织表格加载状态
  gmLoading: boolean = false;
  private centerName: any = []; // 中心名称
  private studentForm1: any = [];
  //学生加载
  studentLoading: boolean = false;
  url: any =
    "https://video.jsh.com/video/46e817a9-171e8ead339-0004-e578-6c9-b7668.mp4";
  //学员的信息
  studentIcon: any = "请选择学员";
  //复制学生信息
  studentRow: any = "";
  //复制组织信息
  organizationRow: any = "";
  //组织的信息
  organizationIcon: any = "请选择组织";
  private gmList: any = {
    tagList: [],
    tagTypeCode: "",
    tagTypeName: ""
  }; // 中心

  //查询条件
  form: any = {
    baseId: this.classid,
    orgNameOrCode: "",
    pageNum: 1,
    //一页条数
    pageSize: 10
  };
  // 根据姓名或手机号选择学员
  private remoteMethodStu(query: any) {
    Http.post(MarkeTing.listAccountInfo, {
      searchType: 1,
      nameOrphone: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.studentForm1 = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  // 全选-中心
  private centerChange(valueList: any): void {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.centerName = [];
      this.gmList.tagList.forEach((value: any) => {
        this.centerName.push(value.tagCodeCollege);
      });
    }
  }

  // 获取中心和产业
  private getCenterList(): void {
    Http.get(MarkeTing.getTagList, {
      terminalCode: this.terminalCode == null ? "1" : this.terminalCode
    })
      .then(res => {
        if (res.data.success) {
          if (this.terminalCode == "1" || this.terminalCode == null) {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "member_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
          } else if (this.terminalCode == "3") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "zxy_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
                this.$forceUpdate();
              }
            }
          } else if (this.terminalCode == "2") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "yg_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
              }
            }
            this.$forceUpdate();
          } else if (this.terminalCode == "4") {
            for (let i = 0; i < res.data.data.length; i++) {
              if (res.data.data[i].tagTypeCode == "hcc_gm") {
                this.gmList.tagList = res.data.data[i].tagList;
                this.gmList.tagTypeCode = res.data.data[i].tagTypeCode;
                this.gmList.tagTypeName = res.data.data[i].tagTypeName;
              }
            }
            this.$forceUpdate();
          }
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误11");
      });
  }
  //评分
  score: any = "";
  //评语
  remark: any = "";
  downloadTimer: any = 0;
  //作业要求弹框开关
  dialogFormVisible: boolean = false;
  //作业查看弹框开关
  jobLook: boolean = false;
  //作业批改弹框开关
  jobCorrection: boolean = false;
  downloading: boolean = false;
  //学员选择弹框开关
  studentSelection: boolean = false;
  //组织选择弹框开关
  organizationSelection: boolean = false;

  private organizationForm: any = []; // 组织编码/名称列表

  private organizationLoading: boolean = false; // 组织名称列表加载状态
  //学员名称或手机号筛选条件
  studentForm: any = {
    nameOrphone: "",
    page: 1,
    rows: 10
  };
  // organizationForm: any = {
  //   nameOrCode: "",
  //   page: 1,
  //   rows: 10
  // };
  //学生的显示选择
  studentIndex: any = null;
  //组织的显示选择
  organizationIndex: any = null;
  //表格数据
  tableData: any = [];
  //学员表格数据
  studentTableData: any = [];
  //组织表格数据
  organizationTableData: any = [];
  //作业详情
  jobDetails: any = "";
  //数据总量
  total: any = 10;
  //学生表格总量
  studentTotal: any = 1;
  //组织表格总量
  organizationTotal: any = 1;
  //作业要求
  requirement: string = "";
  //作业id
  workId: any = "";
  //作业名称
  courseName: string = "";
  //防抖变量
  shake: boolean = false;
  //查询
  query(): void {
    console.log(this.form);
    this.loading = true;
    this.getTableList();
  }
  //查询学生列表
  queryStudent(): void {
    this.studentForm.page = 1;
    this.getStudentTableList();
  }
  //查询组织列表
  queryOrganization(): void {
    this.organizationForm.page = 1;
    this.getOrganizationTableList();
  }
  private phoneFilter(value: any) {
    if (value === null || value === undefined || value === "") return "";
    if (value.indexOf("*") > -1) {
      return value;
    }
    const formatValue = value.toString();
    return (
      formatValue.substring(0, 3) +
      "****" +
      formatValue.substring(formatValue.length - 4)
    );
  }
  //选择学生
  studentSelect(row: any, index: any): void {
    this.studentRow = row;
    this.studentIndex = index;
  }
  //确认学生
  confirmStudent(): void {
    if (this.studentRow != "") {
      this.studentIcon =
        this.studentRow.accountName + "/" + this.studentRow.phone;
      this.studentSelection = false;
      this.form.accountId = this.studentRow.accountId;
    } else {
      this.studentSelection = false;
    }
  }
  //选择中心
  organizationSelect(row: any, index: any): void {
    this.organizationRow = row;
    this.organizationIndex = index;
  }
  //确认中心
  confirmOrganization(): void {
    if (this.organizationRow != "") {
      if (this.organizationRow.orgCode == null) {
        this.organizationIcon = this.organizationRow.orgName;
        this.form.orgNameOrCode = this.organizationRow.orgName;
      } else {
        this.organizationIcon =
          this.organizationRow.orgName + "/" + this.organizationRow.orgCode;
        this.form.orgNameOrCode = this.organizationRow.orgCode;
      }
      this.organizationSelection = false;
    } else {
      this.organizationSelection = false;
    }
  }

  // 根据编码或名称选择组织
  private remoteMethodOrg(query: any) {
    Http.post(MarkeTing.getAccountByOrg, {
      nameOrCode: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.organizationForm = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 导出
  exportList(): void {
    const loading = this.$loading({
      lock: true,
      text: "正在导出,请稍后。",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.6)"
    });
    if (this.downloading) {
      this.$message.warning("正在导出中，请稍后");
      return;
    }
    this.downloading = true;
    let owner = this;
    this.form.classId = this.idClass;
    this.form.gmCodeList = this.centerName;
    Http.post(Exchange.classUnstudyArady, this.form)
      .then(resp => {
        if (resp.data && resp.data.taskId) {
          window.clearInterval(Number(owner.downloadTimer));
          let taskId = resp.data.taskId;
          this.downloadTimer = window.setInterval(function() {
            owner.checkDownloadStatus(taskId);
            loading.close();
          }, 2000);
        } else {
          loading.close();
          this.downloading = false;
          owner.$message.error(resp.data.errorMsg);
        }
      })
      .catch(resp => {
        loading.close();
        this.downloading = false;
        owner.$message.error("服务器错误");
      });
  }
  checkDownloadStatus(taskId: string): void {
    let owner = this;
    Http.get(Exchange.classUnstudyZhiL, { taskId: taskId })
      .then(resp => {
        if (resp.data && resp.data.status == 9) {
          window.clearInterval(Number(owner.downloadTimer));
          owner.downloadFile(taskId);
        }
      })
      .catch(resp => {
        this.downloading = false;
        window.clearInterval(Number(owner.downloadTimer));
        owner.$message.error("服务器错误");
      });
  }
  downloadFile(taskId: string): void {
    let owner = this;
    Http.get(
      Exchange.classUnstudyEnd,
      { taskId: taskId },
      {
        responseType: "blob",
        headers: {}
      }
    )
      .then(resp => {
        this.downloading = false;
        const _now = formatDate(new Date(), "yyyyMMddhhmmss");
        const blob = new Blob([resp.data], {
          type: "application/vnd.ms-excel"
        });
        const fileName = "班级统计-未学习";
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          //IE浏览器
          navigator.msSaveBlob(blob, fileName + "_" + _now + ".xlsx");
        } else {
          //非IE浏览器
          const aTag = document.createElement("a");
          document.body.appendChild(aTag);
          aTag.download = fileName + "_" + _now + ".xlsx";
          aTag.href = URL.createObjectURL(blob);
          aTag.click();
          document.body.removeChild(aTag);
        }
      })
      .catch(resp => {
        this.downloading = false;
        owner.$message.error("服务器错误");
      });
  }

  private cleanto(): void {
    this.form.orgNameOrCode = "";
    this.centerName = [];
    this.studentForm = [];
    this.organizationForm = [];
    this.organizationIcon = "请选择组织";
    this.form.pageNum = 1;
    this.form.pageSize = 10;
  }

  //重置
  reset(): void {
    this.form.orgNameOrCode = "";
    this.form.status = "";
    this.form.accountId = "";
    this.organizationRow = "";
    this.studentIcon = "请选择学员";
    this.organizationIcon = "请选择组织";
  }
  //查看
  look(row: any): void {
    this.jobLook = true;
    this.viewDetails(row.id);
    this.workId = row.id;
    console.log(row);
  }
  //批改
  correction(row: any): void {
    this.viewDetails(row.id);
    this.jobCorrection = true;
    this.workId = row.id;
    console.log(row);
  }
  //作业要求获取
  getHomeworkDetail(): void {
    Http.get(MarkeTing.getHomeworkDetail, { collegeId: this.classid })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          if (res.data.data == null) {
            this.requirement = "暂无要求";
          } else {
            this.requirement = res.data.data;
          }
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  //下载一个
  down(type: any, val: any): void {
    if (type === "mp4") {
      this.bodyLoading = true;
      Http.get(MarkeTing.getRemoteVodAddress, { videoId: val })
        .then(res => {
          if (res.data.success) {
            console.log(res.data.data.payInfoList[0].playUrl);
            this.downVideo(res.data.data.payInfoList[0].playUrl, 1, 2);
            console.log(res.data);
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(() => {
          this.$message.error("服务器错误");
        });
    } else {
      //下载图片
      //download(1, val, "作业");
      this.downImg(val);
    }
  }

  //下载全部
  downAll(): void {
    this.jobDetails.dates.forEach((item: any, index: any) => {
      console.log(item);
      if (item.type == 0) {
        //下载图片
        // download(1, item.value, "作业");
        this.downImg(item.value);
        if (index == this.jobDetails.dates.length) {
          this.bodyLoading = false;
        }
      } else {
        this.bodyLoading = true;
        Http.get(MarkeTing.getRemoteVodAddress, { videoId: item.value })
          .then(res => {
            if (res.data.success) {
              console.log(res.data.data.payInfoList[0].playUrl);
              this.downVideo(
                res.data.data.payInfoList[0].playUrl,
                index,
                this.jobDetails.dates.length
              );
              console.log(res.data);
            } else {
              this.$message.error(res.data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error("服务器错误");
          });
      }
    });
  }
  //下载图片
  downImg(imgUrl: any): void {
    let that = this;
    Http.get(MarkeTing.downloadPhoto, {
      imgUrl: imgUrl
    })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          let base64 = res.data.data;
          let type = imgUrl.split(".")[imgUrl.split(".").length - 1];
          let imgBase64 = "data:image/" + type + ";base64," + base64;
          let saveLink = document.createElement("a");
          saveLink.href = imgBase64;
          saveLink.download = "作业." + type;
          saveLink.click();
        } else {
          that.$message.error(res.data.errorMsg);
        }
      })
      .catch(e => {
        console.log(e);
        that.$message.error("服务器错误");
      });
  }
  //批改确认
  correctionClick(): void {
    if (this.score == "") {
      this.$message("请输入评分");
    } else {
      this.shake = true;
      Http.post(MarkeTing.insertHomeworkSubmit, {
        homeworkSubmitId: this.workId,
        score: this.score,
        remark: this.remark
      })
        .then(res => {
          this.shake = false;
          if (res.data.success && res.data.data) {
            console.log(res);
            this.tableData = res.data;
            this.$message.success("评分成功");
            this.getTableList();
            this.jobCorrection = false;
            this.score = "";
            this.remark = "";
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(() => {
          this.shake = false;
          this.$message.error("服务器错误");
        });
    }
  }
  //作业要求
  dialogFormVisibleClick(): void {
    this.dialogFormVisible = true;
    //获取作业要求
    this.getHomeworkDetail();
  }
  //分数控制
  proPortionTest(): void {
    if (Number(this.score > 100)) {
      this.score = 100;
    }
    if (Number(this.score < 0)) {
      this.score = 0;
    }
    this.$forceUpdate();
  }
  //点击选择学生
  studentGet(): void {
    this.studentSelection = true;
    this.studentForm.page = 1;
    this.studentForm.rows = 10;
    this.getStudentTableList();
  }
  //点击选择中心
  gmGet(): void {
    this.organizationSelection = true;
    this.organizationForm.page = 1;
    this.organizationForm.rows = 10;
    this.getOrganizationTableList();
  }
  //获取列表
  getTableList(): void {
    this.shake = true;
    this.loading = true;
    this.form.classId = this.idClass;
    this.form.gmCodeList = this.centerName;
    Http.post(MarkeTing.classDetailNostudy, this.form)
      .then(res => {
        this.shake = false;
        console.log(res);
        if (res.data.success) {
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          this.loading = false;
        } else {
          this.$message.error(res.data.errorMsg);
          this.loading = false;
        }
      })
      .catch(() => {
        this.shake = false;
        this.loading = false;
        this.$message.error("服务器错误");
      });
  }
  //学生获取列表
  getStudentTableList(): void {
    this.studentLoading = true;
    this.shake = true;
    Http.post(MarkeTing.listAccountInfo, this.studentForm)
      .then(res => {
        this.shake = false;
        console.log(res);
        if (res.data.success) {
          this.studentIndex = null;
          this.studentLoading = false;
          this.studentTableData = res.data.data.list;
          this.studentTotal = res.data.data.total;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.shake = false;
        this.$message.error("服务器错误");
      });
  }
  //组织获取列表
  getOrganizationTableList(): void {
    this.organizationIndex = null;
    this.gmLoading = true;
    this.shake = true;
    Http.post(MarkeTing.getAccountByOrg, this.organizationForm)
      .then(res => {
        this.shake = false;
        console.log(res);
        if (res.data.success) {
          this.organizationTableData = res.data.data.list;
          this.organizationTotal = res.data.data.total;
          this.gmLoading = false;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.shake = false;
        this.$message.error("服务器错误");
      });
  }
  //关闭批改弹框closeStudent
  closeWork(): void {
    this.score = "";
    this.remark = "";
  }
  //关闭学生弹框
  closeStudent(): void {
    this.studentForm.nameOrphone = "";
  }
  //关闭组织弹框
  closeGm(): void {
    this.organizationForm.orgNameOrCode = "";
  }
  //点击图片查看大图片
  imgClick(type: any): any {
    if (type === "mp4") {
      //视频不支持预览
      // return [
      //   "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      // ];
    } else {
      return [type];
    }
  }
  //查看作业详情
  viewDetails(id: any): void {
    Http.get(MarkeTing.getHomeworkSubmitDetail, {
      homeworkSubmitId: id
    })
      .then(res => {
        if (res.data.success) {
          console.log(res);
          this.jobDetails = res.data.data;
          console.log(this.jobDetails);
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  // 导出按钮
  export(): void {
    // 导出
    console.log("导出");
  }
  //获取课程详情
  getCourseDetail(): void {
    Http.get(MarkeTing.getCourseDetail, {
      id: this.classid
    })
      .then(res => {
        if (res.data.success) {
          this.courseName = res.data.data.courseName;
          console.log(res.data);
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  //底部的分页 多少条一页
  onPageSizeChange(pageSize: number): void {
    this.loading = true;
    this.form.pageSize = pageSize;
    this.getTableList();
  }
  //底部的分页 第几页
  onCurrentPageChange(pageNum: number): void {
    this.loading = true;
    this.form.pageNum = pageNum;
    this.getTableList();
  }
  //学生底部的分页 多少条一页
  onPageSizeChangeStudent(pageSize: number): void {
    this.studentForm.rows = pageSize;
    this.getStudentTableList();
  }
  //学生底部的分页 第几页
  onCurrentPageChangeStudent(pageNum: number): void {
    this.studentForm.page = pageNum;
    this.getStudentTableList();
  }
  //组织底部的分页 多少条一页
  onPageSizeChangeOrganization(pageSize: number): void {
    this.organizationForm.rows = pageSize;
    this.getOrganizationTableList();
  }
  //组织底部的分页 第几页
  onCurrentPageChangeOrganization(pageNum: number): void {
    this.organizationForm.page = pageNum;
    this.getOrganizationTableList();
  }
  //根据url下载视频
  downVideo(url: any, index: any, len: any): void {
    Axios({
      method: "get",
      url: url,
      // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
      responseType: "blob"
    }).then((res: any) => {
      if (!res) {
        return;
      }
      if (index == len - 1) {
        this.bodyLoading = false;
      }

      // 将lob对象转换为域名结合式的url
      let blobUrl = window.URL.createObjectURL(res.data);
      console.log(blobUrl);
      let link = document.createElement("a");
      document.body.appendChild(link);
      link.style.display = "none";
      link.href = blobUrl;
      // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
      link.download = "作业视频";
      // 自触发click事件
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    });
  }
  // 进度失去焦点事件
  minJin(): void {
    if (this.form.progressLeast > 100) {
      this.form.progressLeast = "";
    }
    if (this.form.progressLeast && this.form.progressMost) {
      if (this.form.progressLeast > this.form.progressMost) {
        this.$message.error("学习进度最小值大于最大值");
      }
    }
  }
  // 最大值
  maxJin(): void {
    if (this.form.progressMost > 100) {
      this.form.progressMost = "";
    }
    if (this.form.progressLeast && this.form.progressMost) {
      if (this.form.progressLeast > this.form.progressMost) {
        this.$message.error("学习进度最小值大于最大值");
      }
    }
  }

  handleClick(tab: any, event: any) {
    console.log(tab, event);
  }
  private created(): void {
    //获取大表格数据
    this.getTableList();
    //获取详细信息
    //this.getCourseDetail();
    //课程名称
    this.courseName = this.detail.courseName;
    this.getCenterList();
  }
}
