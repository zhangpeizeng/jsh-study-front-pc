// ------ job-management page
import { Component, Prop, Vue } from "vue-property-decorator";
import Axios from "axios";
import {
  Button,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination,
  DatePicker
} from "element-ui";
Vue.use(Input)
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
export default class jobContent extends Vue {
  @Prop({
    type: Number,
    required: false
  })
  id!: any;
  @Prop({
    required: false
  })
  isClass!: any;
  @Prop({
    type: String || Number || undefined,
    required: false
  })
  private accountName!: string;
  bodyLoading: boolean = false;
  //加载状态
  loading: boolean = false;
  //z组织表格加载状态
  gmLoading: boolean = false;
  //学生加载
  studentLoading: boolean = false;
  url: any =
    "https://video.jsh.com/video/46e817a9-171e8ead339-0004-e578-6c9-b7668.mp4";

  //评分
  score: any = "";
  // 详情接口
  submitDetail: any = MarkeTing.getHomeworkSubmitDetail;
  // 批改接口
  correctionConfirmation: any = MarkeTing.insertHomeworkSubmit;
  //评语
  remark: any = "";
  //作业详情
  jobDetails: any = "";
  //作业要求
  requirement: string = "";
  //作业id
  workId: any = "";
  //防抖变量
  shake: boolean = false;
  pictureCollection: any = [];
  videoCollection: any = [];
  audioCollection: any = [];
  documentCollection: any = [];
  options: any = [];
  orgCodeList: any = [];
  downloading: any = false;
  downloadTimer: any = 0;
  // 学员名称
  studentName: any = "";

  //查看视频
  viewVideo(item: any) {
    Http.get(MarkeTing.getRemoteVodAddress, { videoId: item.value })
      .then(res => {
        if (res.data.success) {
          window.open(res.data.data.payInfoList[0].playUrl);
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
            this.downVideo(res.data.data.payInfoList[0].playUrl, 1, 2, "mp4");
          } else {
            this.$message.error(res.data.errorMsg);
          }
        })
        .catch(() => {
          this.$message.error("服务器错误");
        });
    } else if (type === "mp3") {
      this.bodyLoading = true;
      Http.get(MarkeTing.getRemoteVodAddress, { videoId: val })
        .then(res => {
          if (res.data.success) {
            this.downVideo(res.data.data.payInfoList[0].playUrl, 1, 2, "mp3");
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
      if (item.type == 0) {
        //下载图片
        // download(1, item.value, "作业");
        this.downImg(item.value);
        if (index == this.jobDetails.dates.length) {
          this.bodyLoading = false;
        }
      } else if (item.type === 1) {
        this.bodyLoading = true;
        Http.get(MarkeTing.getRemoteVodAddress, { videoId: item.value })
          .then(res => {
            if (res.data.success) {
              this.downVideo(
                res.data.data.payInfoList[0].playUrl,
                index,
                this.jobDetails.dates.length,
                "mp4"
              );
            } else {
              this.$message.error(res.data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error("服务器错误");
          });
      } else if (item.type === 2) {
        this.bodyLoading = true;
        Http.get(MarkeTing.getRemoteVodAddress, { videoId: item.value })
          .then(res => {
            if (res.data.success) {
              this.downVideo(
                res.data.data.payInfoList[0].playUrl,
                index,
                this.jobDetails.dates.length,
                "mp3"
              );
            } else {
              this.$message.error(res.data.errorMsg);
            }
          })
          .catch(() => {
            this.$message.error("服务器错误");
          });
      } else {
        this.downtext(item.value);
      }
    });
  }

  // 获取文件类型
  getFileType(name: any) {
    return name.split("?")[0].split(".")[
      name.split("?")[0].split(".").length - 1
    ];
  }

  // 文档下载
  downtext(val: any): void {
    this.loading = true;
    Http.get(MarkeTing.getdocurl, { etag: val })
      .then(res => {
        this.loading = false;
        if (res.data.success) {
          Http.get(MarkeTing.getpicture, {
            url: encodeURIComponent(res.data.data.url)
          })
            .then(res1 => {
              if (res1.data.success) {
                let base64 = res1.data.data.base64;
                let imgBase64 = "data:/docx;base64," + base64;
                const _now = formatDate(new Date(), "MMdd");
                let saveLink = document.createElement("a");
                saveLink.href = imgBase64;
                saveLink.download =
                  this.studentName +
                  "-" +
                  _now +
                  new Date()
                    .getTime()
                    .toString()
                    .slice(10, 13) +
                  "." +
                  this.getFileType(res.data.data.url);
                saveLink.click();
                this.bodyLoading = false;
              } else {
                this.$message.error(res.data.errorMsg);
                this.bodyLoading = false;
              }
            })
            .catch(() => {
              this.loading = false;
              // this.$message.error("服务器错误");
            });
          this.bodyLoading = false;
        } else {
          this.$message.error(res.data.errorMsg);
          this.bodyLoading = false;
        }
      })
      .catch(() => {
        this.loading = false;
        // this.$message.error("服务器错误");
      });
  }

  convertBase64UrlToBlob(urlData: any) {
    let arr = urlData.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
  //下载图片
  downImg(imgUrl: any): void {
    Http.get(MarkeTing.downloadPhoto, {
      imgUrl: imgUrl
    })
      .then(res => {
        if (res.data.success) {
          let base64 = res.data.data;

          const _now = formatDate(new Date(), "MMdd");
          let type = imgUrl.split(".")[imgUrl.split(".").length - 1];
          let imgBase64 = "data:image/" + type + ";base64," + base64;
          console.log(imgBase64);
          let saveLink = document.createElement("a");
          saveLink.href = URL.createObjectURL(
            this.convertBase64UrlToBlob(imgBase64)
          );
          saveLink.download =
            this.studentName +
            "-" +
            _now +
            new Date()
              .getTime()
              .toString()
              .slice(10, 13) +
            "." +
            type;
          saveLink.click();
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(e => {
        console.log(e);
        this.$message.error("服务器错误");
      });
  }
  //根据url下载视频音频
  downVideo(url: any, index: any, len: any, type: any): void {
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
      const _now = formatDate(new Date(), "MMdd");
      // 将lob对象转换为域名结合式的url
      let blobUrl = window.URL.createObjectURL(res.data);
      let link = document.createElement("a");
      document.body.appendChild(link);
      link.style.display = "none";
      link.href = blobUrl;
      // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
      link.download =
        this.studentName +
        "-" +
        _now +
        new Date()
          .getTime()
          .toString()
          .slice(10, 13) +
        "." +
        type;
      // 自触发click事件
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    });
  }
  // 查看文档
  viewDocument(item: any) {
    window.open(
      location.protocol +
        "//" +
        location.host +
        "/pc/document-browsing?liveId=" +
        item.value
    );
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
  //批改确认
  correctionClick(): void {
    if (this.score == "") {
      this.$message("请输入评分");
    } else {
      this.shake = true;
      Http.post(this.correctionConfirmation, {
        homeworkSubmitId: this.workId,
        score: this.score,
        remark: this.remark
      })
        .then(res => {
          this.shake = false;
          if (res.data.success && res.data.data) {
            this.$message.success("评分成功");
            this.pictureCollection = [];
            this.videoCollection = [];
            this.audioCollection = [];
            this.documentCollection = [];
            this.score = "";
            this.remark = "";
            this.$emit("close");
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
  //查看作业详情
  viewDetails(id: any): void {
    Http.get(this.submitDetail, {
      homeworkSubmitId: id
    })
      .then(res => {
        if (res.data.success) {
          this.jobDetails = res.data.data;
          // 整理数据
          if (this.jobDetails.dates) {
            for (let i = 0; i < this.jobDetails.dates.length; i++) {
              const item = this.jobDetails.dates[i];
              if (item.type == 0) {
                this.pictureCollection.push(item);
              }
              if (item.type == 1) {
                this.videoCollection.push(item);
              }
              if (item.type == 2) {
                this.audioCollection.push(item);
              }
              if (item.type == 3) {
                this.documentCollection.push(item);
              }
            }
          }
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(e => {
        console.log(e);
        this.$message.error("服务器错误");
      });
  }

  //关闭
  private btnColse() {
    this.$emit("close");
  }
  private created(): void {
    if (this.isClass === 1) {
      this.submitDetail = MarkeTing.classGetHomeworkSubmitDetail;
      this.correctionConfirmation = MarkeTing.classInsertHomeworkSubmit;
    }
    this.viewDetails(this.id);
    this.workId = this.id;
    this.studentName = this.accountName;
  }
}
