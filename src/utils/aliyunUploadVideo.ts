import AliyunUpload from "indoing-aliyun-vod-upload-js";
import Http, { MarkeTing } from "@/request";

interface AliyunUploadVideoOptions {
  timeout?: number;
  partSize?: number;
  parallel?: number;
  retryCount?: number;
  retryDuration?: number;
  region?: string;
  catId: string | number;
  file: File;
  onStarted?: Function;
  onProgress?: Function;
  onSuccess?: Function;
  onFailed?: Function;
  onEnd?: Function;
}

//按环境设置不同分类id
let catIds = {
  introduce: "",
  good: "",
  brandIntroduce: "",
  liveAction: "",
  packageProduct: "",
  schoolMarketing: ""
};
const serverSuffix = process.env.VUE_APP_SERVER_SUFFIX;
if (serverSuffix === "-dev") {
  //dev
  catIds = {
    introduce: "1000121994",
    good: "1000121996",
    brandIntroduce: "1000121997",
    liveAction: "1000121998",
    packageProduct: "1000121999",
    schoolMarketing: "1000135917"
  };
} else if (serverSuffix === "-pre") {
  //pre
  catIds = {
    introduce: "1000122001",
    good: "1000122003",
    brandIntroduce: "1000122004",
    liveAction: "1000122005",
    packageProduct: "1000122006",
    schoolMarketing: "1000135918"
  };
} else if (serverSuffix === "") {
  //生产
  catIds = {
    introduce: "1000122007",
    good: "1000122008",
    brandIntroduce: "1000122009",
    liveAction: "1000122010",
    packageProduct: "1000122011",
    schoolMarketing: "1000135920"
  };
}

export default class AliyunUploadVideo {
  static catIds = catIds;

  private userId: string | number = "1378205287806568";
  private uploader: any;
  private timeout: number;
  private partSize: number;
  private parallel: number;
  private retryCount: number;
  private retryDuration: number;
  private region: string = "";
  private catId: string | number | null;
  private file: File | null;
  private onStarted: Function | null;
  private onProgress: Function | null;
  private onSuccess: Function | null;
  private onFailed: Function | null;
  private onEnd: Function | null;

  constructor(options: AliyunUploadVideoOptions) {
    const {
      timeout = 60000,
      partSize = 1048576,
      parallel = 5,
      retryCount = 3,
      retryDuration = 2,
      region = "",
      catId = null,
      file = null,
      onStarted = null,
      onProgress = null,
      onSuccess = null,
      onFailed = null,
      onEnd = null
    } = options;
    this.timeout = timeout;
    this.partSize = partSize;
    this.parallel = parallel;
    this.retryCount = retryCount;
    this.retryDuration = retryDuration;
    this.region = region;
    this.catId = catId;
    this.file = file;
    this.onStarted = onStarted;
    this.onProgress = onProgress;
    this.onSuccess = onSuccess;
    this.onFailed = onFailed;
    this.onEnd = onEnd;

    // 校验catId
    if (this.catId === null || this.catId === "") {
      throw new Error("请设置视频分类Id");
    }

    // 校验文件
    if (this.file === null) {
      throw new Error("请设置文件file");
    }

    this.initUploader();
    this.addFile(this.file);
    this.startUpload();
  }

  //创建上传对象
  initUploader() {
    console.log("1111111111111");
    this.uploader = new AliyunUpload.Vod({
      timeout: this.timeout,
      partSize: this.partSize,
      parallel: this.parallel,
      retryCount: this.retryCount,
      retryDuration: this.retryDuration,
      region: this.region,
      userId: this.userId,
      // 开始上传
      onUploadstarted: (uploadInfo: any) => {
        console.log("开始上传1111111111111");
        // 开始上传的回调
        if (this.onStarted) {
          this.onStarted(uploadInfo);
        }
        console.log("接口调用token");
        // 获取上传视频token
        this.getUploadVideoInfo()
          .then((resp: any) => {
            console.log("开始上传1111111111111");
            const {
              success,
              data: { accessKeyId, accessKeySecret, securityToken }
            } = resp.data;
            if (success) {
              uploadInfo.videoInfo.TemplateGroupId =
                "049f77bb4e8bada7474cf5a642e73d18";
              this.uploader.setSTSToken(
                uploadInfo,
                accessKeyId,
                accessKeySecret,
                securityToken
              );
            } else {
              if (this.onFailed) {
                this.onFailed("获取上传视频token失败", null, null, null);
              }
            }
          })
          .catch(() => {
            if (this.onFailed) {
              this.onFailed("获取上传视频token失败", null, null, null);
            }
          });
      },
      // 文件上传成功
      onUploadSucceed: (uploadInfo: any) => {
        console.log("文件上传成功111111111111111111");
        if (this.onSuccess) {
          this.onSuccess(uploadInfo);
        }
      },
      // 文件上传失败
      onUploadFailed: (uploadInfo: any, code: any, message: any) => {
        console.log("文件上传失败111111111111111111");
        if (this.onFailed) {
          this.onFailed("视频上传失败", uploadInfo, code, message);
        }
      },
      // 文件上传进度
      onUploadProgress: (
        uploadInfo: any,
        totalSize: any,
        loadedPercent: any
      ) => {
        console.log("onUploadProgress111111111111111111");
        if (this.onProgress) {
          this.onProgress(uploadInfo, totalSize, loadedPercent);
        }
      },
      // 上传凭证超时
      onUploadTokenExpired: (uploadInfo: any) => {
        this.getUploadVideoInfo()
          .then((resp: any) => {
            const {
              success,
              data: { accessKeyId, accessKeySecret, securityToken }
            } = resp.data;
            if (success) {
              this.uploader.resumeUploadWithSTSToken(
                uploadInfo,
                accessKeyId,
                accessKeySecret,
                securityToken
              );
            } else {
              if (this.onFailed) {
                this.onFailed("获取上传视频token失败", null, null, null);
              }
            }
          })
          .catch(() => {
            if (this.onFailed) {
              this.onFailed("获取上传视频token失败", null, null, null);
            }
          });
      },
      // 上传完成
      onUploadEnd: (uploadInfo: any) => {
        if (this.onEnd) {
          this.onEnd(uploadInfo);
        }
      }
    });
  }

  //添加文件
  addFile(file: File) {
    this.uploader.addFile(
      file,
      null,
      null,
      null,
      JSON.stringify({ Vod: { CatId: this.catId } })
    );
  }

  //开始上传
  startUpload() {
    this.uploader.startUpload();
  }

  //停止上传
  stopUpload() {
    this.uploader.stopUpload();
  }

  // 获取视频上传token及信息
  getUploadVideoInfo() {
    return Http.get(MarkeTing.getUploadVideoInfo);
  }
}
