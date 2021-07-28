// ------ playback-management page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import AliyunUploadVideo from "@/utils/aliyunUploadVideo";
import Axios from "axios";
import { copyText } from "@/utils";
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
  DatePicker,
  Loading
} from "element-ui";
Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(DatePicker);
import Http, { MarkeTing } from "@/request";
@Component
export default class playbackManagement extends Vue {
  @Prop({
    required: true, // 是否必填
    default: "" //默认值
  })
  private classid!: any;
  @Prop({
    type: Array,
    required: false
  })
  detail!: any;
  //下载加载
  bodyLoading: boolean = false;
  //input 显示
  isInput: boolean = false;
  //课程名
  courseName: string = "";
  //加载table
  loading: boolean = false;
  //weihou  id
  vhallLiveId: any = "";
  //表格数据
  tableData: any = [];
  //上传进度
  uploadMsg: any = "0.00%";
  //数据总量
  total: any = 1;
  //第几页
  pages: any = 1;
  //一页多少数据
  rows: any = 10;
  //是否启用编辑
  isEdit: boolean = false;
  //上传的加载
  isUpload: boolean = false;
  // 是否上传成功的显示
  isFile: boolean = false;
  //是否有过上传
  isload: boolean = false;
  taskId: any = "";
  //文件名称
  liveName: any = "";
  //上传时间
  uploadTimeStamp: any = "";
  //上传时间的格式
  uploadTime: any = "";
  //阿里云上传视频id
  liveId: any = "";
  //tab选项卡
  activeName: string = "first";
  //防抖变量
  shake: boolean = false;

  //点击编辑
  edit(): void {
    this.isEdit = true;
    this.$nextTick(function() {
      //DOM 更新了
      (this.$refs.edit as HTMLInputElement).focus();
    });
  }
  //编辑文件名完成
  confirmFile(): void {
    if (this.liveName == "") {
      this.$nextTick(function() {
        //DOM 更新了
        (this.$refs.edit as HTMLInputElement).focus();
      });
      this.$message("你还没有输入名字哦!");
    } else {
      this.isEdit = !this.isEdit;
    }
  }
  //删除上传的视频
  deleteFile(): void {
    this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.liveId = "";
        this.liveName = "";
        this.uploadTimeStamp = "";
        this.uploadTime = "";
        this.saveUload(1);
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
  //上传点击
  uploadClick(): void {
    Http.get(MarkeTing.getLiveCollegeStatus, {
      baseId: this.classid
    })
      .then(res => {
        if (res.data.success && res.data.data) {
          this.isInput = true;
        } else {
          this.isInput = false;
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  //保存上传的内容
  saveUload(type: Number): void {
    this.shake = true;
    Http.post(MarkeTing.insertPlayBack, {
      baseId: this.classid,
      liveId: this.liveId,
      liveName: this.liveName,
      uploadTime: this.uploadTimeStamp,
      taskId: this.taskId
    })
      .then(res => {
        this.shake = false;
        if (res.data.success) {
          if (res.data.data) {
            if (type == 0) {
              this.$message.success("保存成功!");
            } else if (type == 1) {
              this.$message.success("删除成功!");
              this.isFile = false;
            } else {
              this.$message.success("上传成功!");
              this.isFile = true;
              this.isUpload = false;
            }
          }
        } else {
          this.$message.error(res.data.errorMsg);
          this.uploadMsg = res.data.errorMsg;
        }
      })
      .catch(() => {
        this.shake = false;
        this.$message.error("服务器错误");
        this.isUpload = false;
      });
  }
  private uploadVideo(event: any) {
    const file = event.target.files[0];
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    event.target.value = "";
    if (!fileName.match(/^.*\.(avi|mov|rmvb|rm|flv|mp4|sgp)$/i)) {
      this.$message.error("视频格式不正确");
      return;
    }
    new AliyunUploadVideo({
      catId: AliyunUploadVideo.catIds.liveAction,
      file,
      onStarted: () => {
        this.isFile = false;
        this.isUpload = true;
        this.getTableList();
        console.log(file);
      },
      onSuccess: (uploadInfo: any) => {
        Http.get(MarkeTing.transCodeJob, {
          videoId: uploadInfo.videoId
        })
          .then(res => {
            this.taskId = res.data.data;
            console.log(uploadInfo.videoId);
            this.liveId = uploadInfo.videoId;
            this.liveName = file.name;
            this.uploadTimeStamp = new Date();
            this.uploadTime = this.time();
            this.saveUload(3);
          })
          .catch(() => {
            this.$message.error("服务器错误");
          });
      },
      onFailed: () => {
        this.isUpload = false;
        this.isFile = this.isload;
        this.$message.error("上传失败");
      },
      onProgress: (info: any, size: any, percent: any) => {
        console.log(percent);
        this.uploadMsg = (percent * 100).toFixed(2) + "%";
      }
    });
  }
  //关闭
  private btnColse() {
    window.close();
  }
  //是否有上传过的回放
  getPlayBackbyBaseId() {
    Http.get(MarkeTing.getPlayBackbyBaseId, {
      baseId: this.classid
    })
      .then(res => {
        if (res.data.success) {
          if (res.data.data.baseId == null) {
            this.isFile = false;
          } else {
            this.liveName = res.data.data.liveName;
            this.uploadTimeStamp = res.data.data.uploadTime;
            this.uploadTime = this.time(res.data.data.uploadTime);
            this.liveId = res.data.data.liveId;
            this.taskId = res.data.data.taskId;
            this.isFile = true;
            this.isload = true;
          }
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  //获取课程详情
  getTableList(): void {
    //获取列表
    this.loading = true;
    if (this.detail.courseLiveType === "APP") {
      Http.post(MarkeTing.getMuDuPlayList, {
        vhallLiveId: this.detail.vhallLiveId,
        page: this.pages,
        rows: this.rows
      })
        .then(res => {
          if (res.data.success) {
            if (res.data.data == null) {
              this.tableData = [];
              this.loading = false;
            } else {
              this.tableData = res.data.data.list;
              this.total = res.data.data.total;
              this.loading = false;
            }
          } else {
            this.tableData = [];
            this.loading = false;
          }
        })
        .catch(() => {
          this.$message.error("服务器错误");
        });
    } else {
      Http.get(MarkeTing.listPlayBack, {
        vhallLiveId: this.detail.vhallLiveId,
        page: this.pages,
        rows: this.rows
      })
        .then(res => {
          if (res.data.success) {
            if (res.data.data == null) {
              this.tableData = [];
              this.loading = false;
            } else {
              this.tableData = res.data.data.list;
              this.total = res.data.data.total;
              this.loading = false;
            }
          } else {
            this.tableData = [];
            this.loading = false;
          }
        })
        .catch(() => {
          this.$message.error("服务器错误");
        });
    }
  }
  //时间戳转化
  time(time = +new Date()) {
    var date = new Date(time + 8 * 3600 * 1000);
    return date
      .toJSON()
      .substr(0, 19)
      .replace("T", " ")
      .replace(/-/g, "-");
  }
  //下载视频
  down(type: any, row: any): void {
    if (type == 1) {
      this.bodyLoading = true;
      this.downVideo(row.url, "直播回放");
    } else {
      this.bodyLoading = true;
      Http.get(MarkeTing.getRemoteVodAddress, { videoId: this.liveId })
        .then(res => {
          if (res.data.success) {
            console.log(res.data.data.payInfoList[0]);
            this.downVideo(res.data.data.payInfoList[0].playUrl, this.liveName);
            console.log(res.data);
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(() => {
          this.$message.error("服务器错误");
        });
    }
  }
  // 复制链接
  copyUrl(item: any) {
    copyText(item.url, () => {
      this.$message({
        message: "复制成功!",
        type: "success"
      });
    });
  }
  //
  //底部的分页 多少条一页
  onPageSizeChange(pageSize: number): void {
    this.loading = true;
    this.rows = pageSize;
    this.getTableList();
  }
  //底部的分页 第几页
  onCurrentPageChange(pageNum: number): void {
    this.loading = true;
    this.pages = pageNum;
    this.getTableList();
  }
  //不能上传
  unupload() {
    this.$message.error(
      "直播结束后学员可查看您上传的回放视频，请于直播结束后进行上传"
    );
  }
  //根据url下载视频
  downVideo(url: any, name: any): void {
    if (url.indexOf("http") === 0) {
      this.bodyLoading = false;
      var a = document.createElement("a");
      a.download = name;
      a.href = url;
      document.body.append(a); // 修复firefox中无法触发click
      a.click();
      a.remove();
    } else {
      Axios({
        method: "get",
        url: url,
        // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
        responseType: "blob"
      }).then((res: any) => {
        if (!res) {
          return;
        }
        this.bodyLoading = false;
        // 将lob对象转换为域名结合式的url
        let blobUrl = window.URL.createObjectURL(res.data);
        console.log(blobUrl);
        let link = document.createElement("a");
        document.body.appendChild(link);
        link.style.display = "none";
        link.href = blobUrl;
        // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
        link.download = name;
        // 自触发click事件
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      });
    }
  }
  private created(): void {
    //是否上传过视频
    this.getPlayBackbyBaseId();
    // 获取表格数据
    this.getTableList();
    //课程名称
    this.courseName = this.detail.courseName;
    this.uploadClick();
  }
}
