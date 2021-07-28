import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing, Exchange } from "@/request";
import { downPublicFiles, getFullAddress } from "@/utils";

@Component({
  components: {}
})
export default class groupsImport extends Vue {
  @Prop({
    type: String || Number || undefined,
    required: false
  })
  private studyTerminal!: string;

  @Prop({
    type: String || Number || undefined,
    required: false
  })
  private isType!: string;

  downloading: boolean = false;

  downloadTimer: any = 0;

  problemInfo: string = ""; //下载问题反馈

  invalidCount: number = 0; //失败数量

  totalNumber: number = 0; //总数量

  validCount: number = 0; //成功数量

  arrayList: any = []; //当前导入的数据

  exportDataList: any = [];

  isFlag: boolean = false;

  upFileLoading: boolean = false;

  // 确认导入
  private btnSubmit() {
    let newArrayList: any = [];
    this.exportDataList.forEach((item: any) => {
      if (item.right) {
        newArrayList = newArrayList.concat(item.accountIds);
      }
    });
    this.$emit("confirm", newArrayList);
  }

  btnDelRows(rows: any) {
    console.log(rows);
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      this.exportDataList.splice(rows, 1);
    });
    console.log(this.exportDataList);
  }
  //下载模版
  downTmp(): void {
    if (this.isType == "1") {
      downPublicFiles(
        getFullAddress("/pc/files/company.xlsx"),
        "按公司导入模板"
      );
    } else if (this.isType == "2") {
      downPublicFiles(
        getFullAddress("/pc/files/companyDepartment.xlsx"),
        "按公司部门导入模板"
      );
    } else if (this.isType == "3") {
      downPublicFiles(
        getFullAddress("/pc/files/personnel.xlsx"),
        "按人员导入模板"
      );
    }
    // let hostname = "https://study.yilihuo.com/";
    // if (
    //   Exchange.downloadTmp ==
    //   "jsh-study-service-exchange-dev/api/exchange/page/college/management/download-template"
    // ) {
    //   // hostname = "http://study-dev.ylhtest.com/";
    //   hostname = "http://meet3.ylhtest.com/";
    // } else if (
    //   Exchange.downloadTmp ==
    //   "jsh-study-service-exchange-pre/api/exchange/page/college/management/download-template"
    // ) {
    //   hostname = "https://study-pre.ylhtest.com/";
    // } else {
    //   hostname = "https://study.yilihuo.com/";
    // }
    // let url: any;
    // // if (this.studyTerminal === "1") {
    // url = hostname + Exchange.downloadTmp;
    // // } else if (this.studyTerminal === "3" || this.studyTerminal === "2") {
    // //   url = hostname + Exchange.downloadTmpSale;
    // // }
    // var xmlResquest = new XMLHttpRequest();
    // xmlResquest.open("POST", url, true);
    // xmlResquest.setRequestHeader("Content-type", "application/json");
    // xmlResquest.send(
    //   JSON.stringify({
    //     studyTerminal: this.studyTerminal,
    //     type: this.isType
    //   })
    // );
    // xmlResquest.responseType = "blob";
    // xmlResquest.onload = function(oEvent) {
    //   var content = xmlResquest.response;
    //   var elink = document.createElement("a");
    //   elink.download = "模版下载.xlsx";
    //   elink.style.display = "none";
    //   var blob = new Blob([content]);
    //   elink.href = URL.createObjectURL(blob);
    //   document.body.appendChild(elink);
    //   elink.click();
    //   document.body.removeChild(elink);
    // };
  }
  //导入
  private beforeAvatarUpload(file: any) {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("studyTerminal", this.studyTerminal);
    formData.append("type", this.isType);
    this.upFileLoading = true;
    Http.postMultipartData(MarkeTing.studentImport, formData)
      .then(resp => {
        if (resp.data.success && resp.data.data) {
          this.isFlag = true;
          this.upFileLoading = false;
          this.problemInfo = resp.data.data.url;
          this.invalidCount = resp.data.data.invalidCount;
          this.totalNumber = resp.data.data.totalNumber;
          this.validCount = resp.data.data.validCount;
          this.exportDataList = resp.data.data.all;
        } else {
          this.upFileLoading = false;
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  private created() {}
}
