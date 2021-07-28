import Http from "@/request";

type requestType = "get" | "post" | "postFormData";

interface downloadAsyncOptions {
  triggerDownloadUrl: string;
  checkStatusUrl: string;
  downloadUrl: string;
  params: any;
  requestType?: requestType;
}

/**
 * 异步下载
 * 使用示例页面:
 * src/views/order/customer-order/customer-order-list/customer-order-list.vue 订单导出&&订单明细导出
 */
export class DownloadAsync {
  //触发下载url
  private triggerDownloadUrl: string = "";

  //校验状态url
  private checkStatusUrl: string = "";

  //下载文件url
  private downloadUrl: string = "";

  //入参
  private params: any = {};

  //触发下载时的请求类型 - 实际上是Http实例的请求方法 ("post", "get", "postFormData")
  private requestType: string = "post";

  //任务Id
  private taskId: string = "";

  constructor(options: downloadAsyncOptions) {
    //校验 triggerDownloadUrl
    if (options.triggerDownloadUrl === "") {
      throw new Error("请设置triggerDownloadUrl");
    }

    //校验 checkStatusUrl
    if (options.checkStatusUrl === "") {
      throw new Error("请设置checkStatusUrl");
    }

    //校验 downloadUrl
    if (options.checkStatusUrl === "") {
      throw new Error("请设置downlaodUrl");
    }

    this.triggerDownloadUrl = options.triggerDownloadUrl;
    this.checkStatusUrl = options.checkStatusUrl;
    this.downloadUrl = options.downloadUrl;
    this.params = options.params;
    if (options.requestType) {
      this.requestType = options.requestType;
    }
  }

  //触发下载 - 返回一个Promise对象
  triggerDownload() {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      Http[this.requestType](this.triggerDownloadUrl, this.params)
        .then((resp: any) => {
          if (resp.data && resp.data.taskId) {
            this.taskId = resp.data.taskId;
            this.checkDownloadStatus(resolve, reject);
          } else {
            reject("服务器错误!");
          }
        })
        .catch(() => {
          reject("服务器错误!");
        });
    });
  }

  //校验下载状态
  private checkDownloadStatus(resolve: Function, reject: Function) {
    Http.get(this.checkStatusUrl, { taskId: this.taskId }).then(resp => {
      if (resp.data) {
        if (resp.data.status == 9) {
          //完成
          resolve();
          this.downloadFile(resolve, reject, resp.data.fileName);
        } else {
          //未完成，继续调校验状态接口
          const timeout = setTimeout(() => {
            clearTimeout(timeout);
            this.checkDownloadStatus(resolve, reject);
          }, 3000);
        }
      } else {
        reject("服务器错误!");
      }
    });
  }

  //下载文件 - 可以用ajax方式请求数据流，但不知道为啥报错，先用这种window.open的方式吧
  private downloadFile(
    resolve?: Function,
    reject?: Function,
    fileName?: string
  ) {
    window.open(`${this.downloadUrl}?taskId=${this.taskId}`);
    // Http.request({
    //   method: 'get',
    //   url: this.downloadUrl,
    //   params: {
    //     taskId: this.taskId
    //   },
    //   responseType: "blob"
    // }).then(resp => {
    //   const blob = new Blob([resp.data], {type: "application/vnd.ms-excel"});
    //   const a = document.createElement("a");
    //   a.href = URL.createObjectURL(blob);
    //   a.download = fileName;
    //   document.body.appendChild(a);
    //   resolve();
    //   a.click();
    //   a.remove();
    // }).catch(() => {
    //   reject('服务器错误!');
    // }).finally(() => {
    //   console.log('111');
    // })
  }
}
