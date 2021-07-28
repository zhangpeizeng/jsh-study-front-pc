import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import AliyunUploadVideo from "@/utils/aliyunUploadVideo";

@Component
export default class UploadSourceDialog extends Vue {
  @Prop({
    type: String,
    default: "",
    required: false
  })
  //判断是音频（2）/视频（1）
  liveType!: any;
  @Prop({
    type: String,
    default: "",
    required: false
  })
  //判断从哪个页面传过来的
  sourceType!: any;
  @Prop({
    type: Boolean,
    default: false,
    required: false
  })
  // 是否可编辑
  disabledCourse!: any;
  @Prop({
    type: Array,
    default: [],
    required: false
  })
  // 视频音频的list
  private currentVideoListInDialog!: any;
  private oldList: any = [];
  private uploadLoading: boolean = false;

  // 是否可编辑
  private isEdit: boolean = false;

  //progress进度
  private progress: any = "0%";

  //图片list
  private currentLocalImgListInDialog: any[] = [];

  //图片list
  private currentRemoteImgListInDialog: any[] = [];

  private liveImgList: any[] = [];

  private uploadImgObj: any = null;

  //替换的音频视频的下标
  private replaceIndex: any = 0;

  //删除单个资源
  private deleteSourceItem(type: string, index: number) {
    if (this.disabledCourse) {
      return;
    }
    if (type === "localImg") {
      this.currentLocalImgListInDialog.splice(index, 1);
    } else if (type === "remoteImg") {
      this.currentRemoteImgListInDialog.splice(index, 1);
    } else if (type === "video") {
      this.currentVideoListInDialog.splice(index, 1);
      if (this.liveType === "1") {
        this.$emit("vid", this.currentVideoListInDialog);
      } else {
        this.$emit("vod", this.currentVideoListInDialog);
      }
    }
  }
  //编辑单个资源
  private editSourceItem(type: string, index: number) {
    this.currentVideoListInDialog[index].isEdit = true;
    this.$forceUpdate();
    setTimeout(() => {
      let id: any = document.getElementById("inputIdVideo");
      id.focus();
    }, 500);
  }

  //替换上传音频视频
  replaceSourceItem(item: any, index: number) {
    this.replaceIndex = index;
    (this.$refs.uploadVideoReplace as HTMLElement).click();
  }
  //输入框失去焦点
  private loseBlur(type: string, index: number) {
    this.currentVideoListInDialog[index].isEdit = false;
    this.$forceUpdate();
    console.log(this.currentVideoListInDialog, "kakakakakakakakakakaakakk");
    if (this.liveType === "1") {
      this.$emit("vid", this.currentVideoListInDialog);
    } else {
      this.$emit("vod", this.currentVideoListInDialog);
    }
  }

  //判断实景照片是否被选择
  private checkedLiveImg(imgUrl: string) {
    var flag = false;
    const existImgUrlLength = this.currentRemoteImgListInDialog.filter(item => {
      return item.imageUrl === imgUrl;
    }).length;
    if (existImgUrlLength > 0) {
      flag = true;
    }
    return flag;
  }

  //实景照片选中切换
  private handleCheckLiveImg(imgUrl: string) {
    const index = this.currentRemoteImgListInDialog.findIndex(item => {
      return item.imageUrl === imgUrl;
    });
    if (index !== -1) {
      this.currentRemoteImgListInDialog.splice(index, 1);
    } else {
      this.currentRemoteImgListInDialog.push({
        detailId: null,
        imageUrl: imgUrl,
        imageType: 1,
        detailType: 0,
        videoCode: null,
        videoId: null
      });
    }
  }

  //上传图片 - 实现
  private uploadImg(event: any) {
    if (this.disabledCourse) {
      return;
    }
    const file = event.target.files[0];
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    event.target.value = "";
    //校验
    if (!fileName.match(/^.*\.(jpg|jpeg|png|bmp)$/i)) {
      this.$message.error("图片格式不正确");
      return;
    }
    if (fileSize > 10 * 1024 * 1024) {
      this.$message.error("图片大小不能超过10M");
      return;
    }
    var formData = new FormData();
    formData.append("file", file);
    this.uploadLoading = true;
    Http.postMultipartData(MarkeTing.uploadImgFile, formData)
      .then(resp => {
        if (resp.data.success) {
          if (this.uploadImgObj.type === "img") {
            //上传图片
            this.currentLocalImgListInDialog.push({
              imageUrl: resp.data.data,
              imageType: 1,
              videoCode: null,
              videoId: null,
              detailType: 0
            });
          } else if (this.uploadImgObj.type === "video") {
            //上传视频缩略图
            this.currentVideoListInDialog[this.uploadImgObj.index].imageUrl =
              resp.data.data;
          }
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      })
      .finally(() => {
        this.uploadLoading = false;
      });
  }

  private uploadVideoClick() {
    if (this.disabledCourse) {
      return;
    }
    (this.$refs.uploadVideo as HTMLElement).click();
  }
  //上传视频 - 实现
  private uploadVideo(event: any) {
    let owner = this;
    if (this.disabledCourse) {
      return;
    }
    console.log(this.disabledCourse, "99999999999999");
    const file = event.target.files[0];
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    event.target.value = "";
    if (this.liveType === "1") {
      if (!fileName.match(/^.*\.(avi|mov|rmvb|rm|flv|mp4|sgp|wmv|flv|mkv)$/i)) {
        this.$message.error("视频格式不正确");
        return;
      }
    } else if (this.liveType === "2") {
      if (!fileName.match(/^.*\.(mp3|wav|m4a)$/i)) {
        this.$message.error("音频格式不正确");
        return;
      }
    }
    new AliyunUploadVideo({
      catId: AliyunUploadVideo.catIds.liveAction,
      file,
      onStarted: () => {
        this.uploadLoading = true;
      },
      onSuccess: (uploadInfo: any) => {
        this.uploadLoading = false;
        //视频转码接口
        Http.get(MarkeTing.transCodeJob, {
          videoId: uploadInfo.videoId
        })
          .then(res => {
            console.log(res.data.data, "shishishsihsishsihsihsi33333333333333");
            if (res.data.success) {
              owner.currentVideoListInDialog.push({
                liveType: owner.liveType,
                sourceType: owner.sourceType,
                liveName: file.name,
                liveId: uploadInfo.videoId || null,
                taskId: res.data.data,
                isEdit: true
              });
            }
          })
          .catch(err => {
            this.$message("失败");
          });
        this.$message.success("上传成功");
        this.progress = "0%";
        if (this.liveType === "1") {
          this.$emit("vid", this.currentVideoListInDialog);
        } else {
          this.$emit("vod", this.currentVideoListInDialog);
        }
      },
      onProgress: (info: any, size: any, percent: any) => {
        console.log(percent, "uuuuu");
        let number: any;
        let num: any;
        num = percent * 100;
        number = parseInt(num);
        this.progress = number.toString() + "%";
        console.log(this.progress, "tttttttttttt");
      },
      onFailed: () => {
        this.uploadLoading = false;

        this.$message.error("上传失败");
      }
    });
  }

  //替换上传视频
  private uploadVideoReplace(event: any) {
    let owner = this;
    console.log(
      owner.oldList,
      "oldList11111============================================"
    );
    const file = event.target.files[0];
    const fileName = file.name.toLowerCase();
    const fileSize = file.size;
    event.target.value = "";
    if (this.liveType === "1") {
      if (!fileName.match(/^.*\.(avi|mov|rmvb|rm|flv|mp4|sgp|wmv|flv|mkv)$/i)) {
        this.$message.error("视频格式不正确");
        return;
      }
    } else if (this.liveType === "2") {
      if (!fileName.match(/^.*\.(mp3|wav|m4a)$/i)) {
        this.$message.error("音频格式不正确");
        return;
      }
    }
    new AliyunUploadVideo({
      catId: AliyunUploadVideo.catIds.liveAction,
      file,
      onStarted: () => {
        this.uploadLoading = true;
      },
      onSuccess: (uploadInfo: any) => {
        this.uploadLoading = false;
        //视频转码接口
        Http.get(MarkeTing.transCodeJob, {
          videoId: uploadInfo.videoId
        })
          .then(res => {
            console.log(res.data.data, "shishishsihsishsihsihsi33333333333333");
            if (res.data.success) {
              owner.currentVideoListInDialog[owner.replaceIndex].liveType =
                owner.liveType;
              owner.currentVideoListInDialog[owner.replaceIndex].sourceType =
                owner.sourceType;
              owner.currentVideoListInDialog[owner.replaceIndex].liveName =
                file.name;
              owner.currentVideoListInDialog[owner.replaceIndex].liveId =
                uploadInfo.videoId || null;
              owner.currentVideoListInDialog[owner.replaceIndex].taskId =
                res.data.data;
              owner.currentVideoListInDialog[owner.replaceIndex].isEdit = true;
              owner.currentVideoListInDialog[owner.replaceIndex].oldId =
                owner.oldList[owner.replaceIndex].liveId;
              // owner.currentVideoListInDialog.push({
              //   liveType: owner.liveType,
              //   sourceType: owner.sourceType,
              //   liveName: file.name,
              //   liveId: uploadInfo.videoId || null,
              //   taskId: res.data.data,
              //   isEdit: true
              // });
            }
          })
          .catch(err => {
            this.$message("失败");
          });
        this.$message.success("上传成功");
        console.log(
          owner.currentVideoListInDialog,
          "currentVideoListInDialog============================================"
        );
        console.log(
          owner.oldList,
          "oldList============================================"
        );
        console.log(
          owner.replaceIndex,
          "this.replaceIndex============================================"
        );
        this.progress = "0%";
        if (this.liveType === "1") {
          this.$emit("vid", this.currentVideoListInDialog);
        } else {
          this.$emit("vod", this.currentVideoListInDialog);
        }
      },
      onProgress: (info: any, size: any, percent: any) => {
        console.log(percent, "uuuuu");
        let number: any;
        let num: any;
        num = percent * 100;
        number = parseInt(num);
        this.progress = number.toString() + "%";
        console.log(this.progress, "tttttttttttt");
      },
      onFailed: () => {
        this.uploadLoading = false;

        this.$message.error("上传失败");
      }
    });
  }

  private created() {
    //将资源按本地上传 实景选择 视频分为三类
  }
  mounted() {
    setTimeout(() => {
      console.log(this.currentVideoListInDialog, "currentVideoListInDialog");
      this.oldList = JSON.stringify(this.currentVideoListInDialog);
      this.oldList = JSON.parse(this.oldList);
      console.log(this.oldList, "ttttttttttttttttttttttttttttttttttttttttt");
    }, 3000);
  }
}
