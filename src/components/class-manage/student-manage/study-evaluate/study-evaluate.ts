import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import { Form as ElForm } from "element-ui";
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
import { formatDate } from "@/utils";

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
  components: {}
})
export default class deleteStudent extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private classId!: any;
  @Prop({
    type: Number,
    required: true
  })
  private studyTerminalCode!: any;
  studentList: any = [];
  //学员名字
  private studentName: any = "";

  //选中的学员id
  private idList: any = [];

  //状态
  private resultStatus: any = -1;

  //是否颁发证书
  private isCertificate: any = -1;

  //审核说明
  private examineDesc: any = "";

  //学习评定弹框
  evaluateDialog: any = false;

  //底图弹框
  private picDialog: any = false;

  // 上传的图片
  private uploadImgObj: any = null;

  // 上传的图片
  private uploadLoading: boolean = false;

  //选择的底图
  private selectImageUrl: any = null;
  private checkImgIndex: any = null;

  radio: string = "";

  //底图列表
  private imgList: any = [];

  private currentVideoListInDialog: any[] = [];

  // 预览的图片框
  private previewImgDialog: boolean = false;

  //预览图片url
  private previewImageUrl: any = null;

  //证书所有属性
  certificateNatureList: any = [];
  //等级列表
  gradeList: any = [];
  grade: any = [];
  gradeStr: any = "";

  //类型列表
  typeList: any = [];
  type: any = [];
  typeStr: any = "";

  //性质里欸博爱
  natureList: any = [];
  nature: any = [];
  natureStr: any = "";

  //证书属性集合
  attributeBaseIdList: any = [];

  private form: any = {
    certificateBasePicUrl: null,
    certificateUrl: "",
    certificateName: "",
    certificateDesc: "",
    certificateCompany: "",
    natureStr: "",
    typeStr: "",
    gradeStr: ""
  };

  //证书编辑的验证规则
  rules: any = {
    certificateBasePicUrl: [
      { required: true, message: "请上传底图", trigger: "blur" }
    ],
    certificateName: [
      { required: true, message: "请输入证书名称", trigger: "blur" },
      { min: 1, max: 50, message: "长度在 3 到 5 个字符", trigger: "blur" }
    ],
    certificateDesc: [
      { required: true, message: "请填写证书内容", trigger: "blur" }
    ],
    certificateCompany: [
      { required: true, message: "请填写发放单位", trigger: "blur" }
    ],
    region: [{ required: true, message: "请选择活动区域", trigger: "change" }]
  };

  created() {
    // this.certificateUrlList()
  }

  /**
   *
   *
   * 进入页面触发
   *
   *
   */
  onLoad() {
    this.studentList.forEach((item: any) => {
      this.studentName
        ? (this.studentName =
            this.studentName +
            " 、" +
            item.accountName +
            "(" +
            item.huiHuiNumber +
            ")")
        : (this.studentName = item.accountName + "(" + item.huiHuiNumber + ")");
      this.idList.push(item.id);
    });
    this.certificateUrlList();
    this.certificateNature();
  }

  /**
   * 关闭弹框
   */

  closeStudy() {
    this.studentName = "";
    const ref: any = this.$refs["form"];
    ref.resetFields();
  }

  /**
   * 评定 确认按钮
   */
  confirm() {
    if (this.resultStatus < 0) {
      this.$message.error("请选择评定结果");
      return;
    }
    if (this.resultStatus === 2 && this.isCertificate < 0) {
      this.$message.error("请选择是否颁发证书");
      return;
    }
    this.resultStatus;
    this.attributeBaseIdList = this.attributeBaseIdList
      .concat(this.grade)
      .concat(this.nature)
      .concat(this.type);
    Http.post(MarkeTing.updateStudentStudyStatus, {
      classId: this.classId * 1,
      idList: this.idList, //学员表id集合
      studyStatus: this.resultStatus, //学习结果 2-合格，3-不合格）
      certificateStatus: this.isCertificate < 0 ? null : this.isCertificate, //是否颁发证书（0-否，1-是）
      certificateBasePicUrl: this.form.certificateBasePicUrl, //证书底图url
      certificateName: this.form.certificateName, //证书名称
      certificateDesc: this.form.certificateDesc, //证书内容
      certificateCompany: this.form.certificateCompany, //证书内容
      attributeBaseIdList: this.attributeBaseIdList //证书属性id集合
    })
      .then(res => {
        if (res.data.success) {
          console.log("1111111");
          this.$emit("evaluate");
          this.evaluateDialog = false;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  /**
   * 选择底图
   * @param item
   * @param index
   */
  private selectImg(item: any, index: any) {
    this.checkImgIndex = index;
    this.selectImageUrl = item.certificateUrl;
  }

  /**
   * 预览证书
   */
  previewCertificate() {
    let ref: any = this.$refs.form;
    ref.validate((valid: any) => {
      if (valid) {
        const loading = this.$loading({
          lock: true,
          text: "加载中...",
          background: "rgba(0, 0, 0, 0.2)"
        });
        const params = this.form;
        Http.post(MarkeTing.getPreStudyMarketingCertificate, params)
          .then(res => {
            loading.close();
            this.previewImageUrl = res.data.data;
            this.previewImgDialog = true;
          })
          .catch(err => {
            this.$message("失败");
          });
      }
    });
  }

  /**
   * 确定选择的图片的底色
   */
  private confirmImage() {
    this.picDialog = false;
    // this.imageUrl = this.selectImageUrl;
    this.form.certificateBasePicUrl = this.selectImageUrl;
  }

  /**
   * 获取证书底图列表
   * @param event
   */
  certificateUrlList() {
    Http.get(MarkeTing.listStudyMarketingCertificate, { accountId: 1 })
      .then(res => {
        this.imgList = res.data.data;
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 获取证书的属性
   * @param event
   */
  certificateNature() {
    Http.get(MarkeTing.listCertificateAttributeByTerminalCode, {
      studyTerminal: this.studyTerminalCode + ""
    })
      .then(res => {
        this.certificateNatureList = res.data.data;
        this.certificateNatureList.forEach((item: any) => {
          if (item.attributeTypeCode === "level") {
            this.gradeList = item.certificateAttributeDtos;
          } else if (item.attributeTypeCode === "type") {
            this.typeList = item.certificateAttributeDtos;
          } else if (item.attributeTypeCode === "nature") {
            this.natureList = item.certificateAttributeDtos;
          }
        });
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 上传图片 - 触发
   * @param type
   * @param index
   */
  private handleUploadImg(type: string, index: number = 0) {
    this.uploadImgObj = {
      type,
      index
    };
    //@ts-ignore
    this.$refs.uploadImg.click();
  }

  /**
   * 上传图片 - 实现
   * @param event
   */
  private uploadImg(event: any) {
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
          if (this.uploadImgObj.type === "video") {
            //上传图片
            // this.imageUrl = resp.data.data;
            this.form.certificateBasePicUrl = resp.data.data;
            // this.currentLocalImgListInDialog.push({
            //     imageUrl: resp.data.data,
            //     imageType: 1,
            //     videoCode: null,
            //     videoId: null,
            //     detailType: 0
            // });
          } else if (this.uploadImgObj.type === "img") {
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
}
