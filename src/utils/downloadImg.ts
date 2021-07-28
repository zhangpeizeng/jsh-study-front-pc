/**
 * 将 base64 转换位 blob 对象
 * blob 存储 2进制对象的容器
 * @export
 * @param {*} base64
 * @returns
 */
const convertBase64UrlToBlob = (base64: any): any => {
  let parts = base64.split(";base64,");
  let contentType = parts[0].split(":")[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; i++) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};

/**
 * 将图片地址转换为 base64 格式
 *
 * @param {*} url
 */
const convertUrlToBase64 = (url: any): any => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
    img.onload = () => {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      let ctx = canvas.getContext("2d");
      // @ts-ignore
      ctx.drawImage(img, 0, 0, img.width, img.height);
      let ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
      let dataURL = canvas.toDataURL("image/" + ext);
      let base64 = {
        dataURL: dataURL,
        type: "image/" + ext,
        ext: ext
      };
      resolve(base64);
    };
  });
};

// 判断浏览器类型
const myBrowser = (): any => {
  let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  if (userAgent.indexOf("OPR") > -1) {
    return "Opera";
  } //判断是否Opera浏览器 OPR/43.0.2442.991
  if (userAgent.indexOf("Firefox") > -1) {
    return "FF";
  }
  if (userAgent.indexOf("Trident") > -1) {
    return "IE";
  } //判断是否IE浏览器  Trident/7.0; rv:11.0
  if (userAgent.indexOf("Edge") > -1) {
    return "Edge";
  } //判断是否Edge浏览器  Edge/14.14393
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  } // Chrome/56.0.2924.87
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } //判断是否Safari浏览器 AppleWebKit/534.57.2 Version/5.1.7 Safari/534.57.2
};

// 判断文件是否为图片类型
const isImage = (ext: any): any => {
  if (
    ext == "png" ||
    ext == "jpg" ||
    ext == "jpeg" ||
    ext == "gif" ||
    ext == "bmp"
  ) {
    return true;
  }
};
/**
 * 下载文件
 *
 * @export
 * @param {*} type 设置接收数据类型 参数 1 或 2
 * @param {*} data type为 1 时 data 为文件地址； type为 2 时 data 为canvas对象
 * @param {*} name 当文件为图片类型时需设置文件名
 */
const download = (type: any, data: any, name: any, base: any): void => {
  let url = data;
  // 通过地址判断是否为图片类型文件
  console.log(url);
  let ext = url.slice(url.lastIndexOf(".") + 1).toLowerCase();
  if (isImage(ext)) {
    let blob = convertBase64UrlToBlob(base);
    console.log(999999999999);
    // 下载
    if (myBrowser() == "IE") {
      window.navigator.msSaveBlob(blob, name + ".jpg");
    } else {
      let a = document.createElement("a");
      a.download = name;
      a.href = URL.createObjectURL(blob);
      a.click();
    }
  } else {
    let a = document.createElement("a");
    a.download = name;
    a.href = url;
    a.click();
  }
};
export { download };
