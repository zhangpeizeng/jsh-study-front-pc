import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import {
  Button,
  Form,
  FormItem,
  Input,
  Option,
  Select,
  Table,
  TableColumn,
  Pagination
} from "element-ui";
import { UEditorBox } from "@jsh/helper/components";
import LayoutDefaultImg1 from "@/assets/images/layout-course1.png";
import LayoutCurrentImg1 from "@/assets/images/layout-course1-current.png";
import LayoutDefaultImg2 from "@/assets/images/layout-course2.png";
import LayoutCurrentImg2 from "@/assets/images/layout-course2-current.png";
import ApplyPreview from "@/components/apply/apply-preview/apply-preview.vue";
import Axios from "axios";

interface options {
  readonly labelCode: string;
  readonly labelName: string;
}

Vue.use(Form)
  .use(FormItem)
  .use(Input)
  .use(Button)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Pagination);

@Component({
  components: { UEditorBox, ApplyPreview }
})
export default class ShopClassDetail extends Vue {
  @Prop({
    type: [Number, String],
    required: false
  })
  classid!: any;
  @Prop({
    type: String,
    required: false
  })
  courseType!: any;

  @Prop({
    type: Object,
    required: false
  })
  detail!: any;

  loading: boolean = false;
  // private detail: any = {};

  //控制发放按钮

  putbuttonshow: boolean = false;

  //上下架状态
  statusany: number = 0;

  goods: any = null; //商品信息

  editor: object = {
    toolbar: [
      "bold",
      "italic",
      "underline",
      { align: "" },
      { align: "center" },
      { align: "right" },
      "clean",
      "image",
      { header: [1, 2, 3, 4, 5, 6, false] }
    ]
  };
  LayoutDefaultImg1: any = LayoutDefaultImg1;

  LayoutCurrentImg1: any = LayoutCurrentImg1;

  LayoutDefaultImg2: any = LayoutDefaultImg2;

  LayoutCurrentImg2: any = LayoutCurrentImg2;
  imgurllist: any;
  // 证书等级
  gradeStr: any = "";
  // 证书性质
  natureStr: any = "";
  // 证书类型
  typeStr: any = "";

  optionsNewsS: Array<any> = [];
  optionsNewsnext: Array<any> = [];
  studyTerminalAndClassifyList: Array<any> = [];
  classClassifyNames: Array<any> = [];
  classClassifyName1: any = "";
  classClassifyName2: any = "";
  classClassifyName3: any = "";
  classClassifyName4: any = "";
  private instancePre: any = ""; // 预览组件实例
  private previewDialog: boolean = false;
  private lecturerObj: any = "";
  private lecturerName: any = ""; // 默认登录人
  private onSearch(): void {
    // this.onLoad();
  }
  // 获取预览组件实例
  private instancePreview(preview: any) {
    this.instancePre = preview;
  }
  // 预览
  private previewClick() {
    Http.get(MarkeTing.getLecturerInfo, {
      baseId: this.detail.id,
      type: "PC"
    }).then(res => {
      const { data } = res;

      if (data.success) {
        this.lecturerObj = data.data;
        this.previewDialog = true;
        let params = {
          lecturerName: this.lecturerObj.lecturerName,
          lecturerImg: this.lecturerObj.lecturerImg,
          lecturerDesc: this.lecturerObj.lecturerDesc
        };
        this.instancePre.showMask(params);
      } else {
        this.$message.error(data.errorMsg);
      }
    });
  }
  private closeMask() {
    this.previewDialog = false;
  }
  private getName(): void {
    Http.post(MarkeTing.SearchSysDict, { typeCode: "study_terminal" })
      .then(res => {
        const { data } = res;

        if (data.success) {
          console.log(data.data.length);
          console.log(data.data);
          this.optionsNewsS = data.data;
          console.log(this.detail);
          for (let j = 0; j < this.optionsNewsS.length; j++) {
            for (let i = 0; i < this.detail.studyTerminals.length; i++) {
              if (
                this.optionsNewsS[j].labelCode == this.detail.studyTerminals[i]
              ) {
                this.optionsNewsnext.push(this.optionsNewsS[j].labelName);
                console.log(this.optionsNewsS[j].labelName);
              }
            }
          }

          // this.options = data.data;
          // this.labelCode = this.options[0].labelCode;
          // this.tree.getProductGroupList(this.labelCode);
          // if (this.saveType == "1") {
          //   this.getDetail();
          // }
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  private onPageSizeChange(rows: number): void {
    // this.onLoad();
  }

  private onPageNumChange(page: number): void {
    // this.onLoad();
  }

  private onLoad(classid: any): void {
    this.loading = true;
    Http.get(MarkeTing.getClassCourseDetailById, {
      id: classid
    })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          this.detail = res.data.data;
          let nowdate = Date.parse(new Date().toString());
          if (this.detail.studyStartTime) {
            if (nowdate >= this.detail.studyStartTime) {
              this.putbuttonshow = true;
            }
          } else {
            this.putbuttonshow = true;
          }
          this.statusany = this.detail.status;
          if (this.courseType === "1") {
            if (
              this.detail.productCodeList &&
              this.detail.productCodeList.length !== 0
            ) {
              this.getgoods(this.detail.productCodeList);
            }
          }
          if (
            this.detail.certificateRelaList &&
            this.detail.certificateRelaList.length > 0
          ) {
            this.imgurllist = [];
            this.detail.certificateRelaList.forEach((imgurl: any) => {
              this.imgurllist.push(imgurl.certificateUrl);
            });
          }
        } else {
          this.$message.error(res.data.errorMsg);
        }

        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  }
  /**
   * 处理选择证书的属性
   */
  handleType(list: any) {
    list.forEach((item: any) => {
      if (item.attributeTypeCode === "type") {
        this.typeStr = item.certificateAttributeStr;
      } else if (item.attributeTypeCode === "nature") {
        this.natureStr = item.certificateAttributeStr;
      } else if (item.attributeTypeCode === "level") {
        this.gradeStr = item.certificateAttributeStr;
      }
    });
  }
  private upstaus(status: number): void {
    this.$confirm(`是否确认${status === 2 ? "上架" : "下架"}`, "提示", {
      confirmButtonText: `确认${status === 2 ? "上架" : "下架"}`,
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        Http.get(MarkeTing.updatecollegemarketingbasebyid, {
          id: this.classid,
          status: status
        })
          .then(res => {
            console.log(res);
            if (res.data.success) {
              console.log("成功");
              this.onLoad(this.classid);
            } else {
              this.$message.error(res.data.errorMsg);
            }
            this.loading = false;
          })
          .catch(err => {
            // this.$message.error("品牌列表获取失败，请稍后重试");
            this.loading = false;
          });
      })
      .catch(() => {
        console.log("取消");
      });
  }
  private deleteclass(): void {
    this.$confirm(`是否确认删除课程`, "提示", {
      confirmButtonText: `确认删除`,
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.loading = true;
        Http.get(MarkeTing.deletecollegemarketingbasebyid, {
          id: this.classid
        })
          .then(res => {
            console.log(res);
            if (res.data.success) {
              console.log("成功");
              window.close();
            } else {
              this.$message.error(res.data.errorMsg);
            }
            this.loading = false;
          })
          .catch(err => {
            // this.$message.error("品牌列表获取失败，请稍后重试");$router.go(-1)
            this.loading = false;
          });
      })
      .catch(() => {
        console.log("取消");
      });
  }
  private getgoods(productCode: any): void {
    Http.post(MarkeTing.listskuinfobyproductcode, productCode)
      .then(res => {
        if (res.data.success) {
          this.goods = res.data.data;
          console.log("成功");
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(err => {
        // this.$message.error("品牌列表获取失败，请稍后重试");$router.go(-1)
      });
  }
  private gotodetail(): void {
    let newpage = this.$router.resolve({
      path: "/medal-issue",
      query: {
        classid: this.classid,
        studyTerminals: this.detail.studyTerminals
      }
    });
    window.open(newpage.href, "_blank");
  }
  private gotodetailedit(): void {
    if (this.courseType === "1") {
      this.$router.push({
        path: "/add-recorded-course",
        query: {
          type: "1",
          id: this.classid,
          courseType: this.courseType
        }
      });
    } else if (this.courseType === "2") {
      this.$router.push({
        path: "/add-live-course",
        query: {
          type: "1",
          id: this.classid,
          courseType: this.courseType
        }
      });
    } else if (this.courseType === "3") {
      this.$router.push({
        path: "/add-discussion-course",
        query: {
          type: "1",
          id: this.classid,
          courseType: this.courseType
        }
      });
    } else if (this.courseType === "4") {
      this.$router.push({
        path: "/add-series-course",
        query: {
          type: "1",
          id: this.classid,
          courseType: this.courseType
        }
      });
    }
  }
  private goback(): void {
    // this.$router.go(-1);
    this.$router.push({
      path: "/shop-class-list",
      query: {}
    });
  }
  private closeto(): void {
    window.close();
  }

  private onConfirmed(): void {
    this.onSearch();
    this.$emit("after-add");
  }
  goToPaperPreview() {
    window.open(this.detail.examUrl);
  }
  //下载一个
  down(val: any): void {
    this.loading = true;
    Http.get(MarkeTing.getRemoteVodAddress, { videoId: val })
      .then(res => {
        if (res.data.success) {
          this.downVideo(res.data.data.payInfoList[0].playUrl, 1, 2);
        } else {
          this.loading = false;
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.loading = false;
        // this.$message.error("服务器错误");
      });
  } //下载一个
  downtext(val: any): void {
    this.loading = true;
    Http.get(MarkeTing.getdocurl, { etag: val })
      .then(res => {
        this.loading = false;
        if (res.data.success) {
          console.log(res.data.data.url);
          window.open(res.data.data.url);
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.loading = false;
        // this.$message.error("服务器错误");
      });
  }
  //根据url下载视频
  downVideo(url: any, index: any, len: any): void {
    Axios({
      method: "get",
      url: url,
      // 必须显式指明响应类型是一个Blob对象，这样生成二进制的数据，才能通过window.URL.createObjectURL进行创建成功
      responseType: "blob"
    })
      .then((res: any) => {
        if (!res) {
          return;
        }
        if (index == len - 1) {
          this.loading = false;
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
      })
      .catch(() => {
        this.loading = false;
        // this.$message.error("服务器错误");
      });
  }

  private created(): void {
    console.log(this.classid, this.courseType);
    console.log(this.detail);
    this.lecturerName = localStorage.getItem("accountName");
    if (this.detail.attributeBaseDtos) {
      this.handleType(this.detail.attributeBaseDtos);
    }
    for (let i = 0; i < this.detail.terminalAndClassifyList.length; i++) {
      this.studyTerminalAndClassifyList[
        i
      ] = this.detail.terminalAndClassifyList[i];
      this.classClassifyNames[i] = this.studyTerminalAndClassifyList[
        i
      ].classClassifyNames;
    }
    if (
      this.classClassifyNames == null ||
      this.classClassifyNames.length == 0
    ) {
      this.classClassifyName1 = "";
    } else if (this.classClassifyNames.length == 1) {
      if (this.classClassifyNames[0] != null) {
        this.classClassifyName1 = this.classClassifyNames[0].toString();
      } else {
        this.classClassifyName1 = "";
      }
    } else if (this.classClassifyNames.length == 2) {
      if (this.classClassifyNames[0] != null) {
        this.classClassifyName1 = this.classClassifyNames[0].toString();
      } else {
        this.classClassifyName1 = "";
      }
      if (this.classClassifyNames[1] != null) {
        this.classClassifyName2 = this.classClassifyNames[1].toString();
      } else {
        this.classClassifyName2 = "";
      }
    } else if (this.classClassifyNames.length == 3) {
      if (this.classClassifyNames[0] != null) {
        this.classClassifyName1 = this.classClassifyNames[0].toString();
      } else {
        this.classClassifyName1 = "";
      }
      if (this.classClassifyNames[1] != null) {
        this.classClassifyName2 = this.classClassifyNames[1].toString();
      } else {
        this.classClassifyName2 = "";
      }
      if (this.classClassifyNames[2] != null) {
        this.classClassifyName3 = this.classClassifyNames[2].toString();
      } else {
        this.classClassifyName3 = "";
      }
    } else if (this.classClassifyNames.length == 4) {
      if (this.classClassifyNames[0] != null) {
        this.classClassifyName1 = this.classClassifyNames[0].toString();
      } else {
        this.classClassifyName1 = "";
      }
      if (this.classClassifyNames[1] != null) {
        this.classClassifyName2 = this.classClassifyNames[1].toString();
      } else {
        this.classClassifyName2 = "";
      }
      if (this.classClassifyNames[2] != null) {
        this.classClassifyName3 = this.classClassifyNames[2].toString();
      } else {
        this.classClassifyName3 = "";
      }
      if (this.classClassifyNames[3] != null) {
        this.classClassifyName4 = this.classClassifyNames[3].toString();
      } else {
        this.classClassifyName4 = "";
      }
    }
    this.getName();
    let nowdate = Date.parse(new Date().toString());
    if (this.detail.studyStartTime) {
      if (nowdate >= this.detail.studyStartTime) {
        this.putbuttonshow = true;
      }
    } else {
      this.putbuttonshow = true;
    }
    this.statusany = this.detail.status;
    if (this.courseType === "1") {
      if (
        this.detail.productCodeList &&
        this.detail.productCodeList.length !== 0
      ) {
        this.getgoods(this.detail.productCodeList);
      }
    }
    if (
      this.detail.certificateRelaList &&
      this.detail.certificateRelaList.length > 0
    ) {
      this.imgurllist = [];
      this.detail.certificateRelaList.forEach((imgurl: any) => {
        this.imgurllist.push(imgurl.certificateUrl);
      });
    }
    // this.onLoad(this.classid);
  }
}
