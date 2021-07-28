// ------home page
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import NewSelectCertificate from "@/components/new-select-certificate/new-select-certificate.vue";
import NewSelectCertificateTs from "@/components/new-select-certificate/new-select-certificate.ts";
import Http, { Default, MarkeTing } from "@/request";
@Component({
  components: {
    NewSelectCertificate
  }
})
export default class SelectTestPaper extends Vue {
  // 监听
  @Watch("codeNum")
  codeNu() {
    //实时监控编辑器内容变化，使父组件
    if (this.codeNum != 1) {
      this.isType = "1";
    }
    if (this.form.certificateName || this.form2.certificateName) {
      this.$message.error("终端修改，请重新编辑证书");
      this.$emit("changeCert");
      this.form = {};
      this.form2 = {};
    }
  }
  @Prop({
    type: Number,
    required: true
  })
  private codeNum!: any;
  //自定义的证书
  // @Prop({
  //   type: Object,
  //   required: true
  // })
  // private form!: any;
  // //选择的证书
  // @Prop({
  //   type: Object,
  //   required: true
  // })
  // private form2!: any;
  form: any = {
    certificateBasePicUrl: null,
    certificateUrl: "",
    certificateName: "",
    certificateDesc: "",
    certificateCompany: "",
    natureStr: "",
    typeStr: "",
    gradeStr: ""
  };
  form2: any = {
    certificateBasePicUrl: null,
    certificateUrl: "",
    certificateName: "",
    certificateDesc: "",
    certificateCompany: ""
  };
  // 证书编辑的form表单
  //证书编辑的dialog框是否展示
  dialogSetting: boolean = false;

  //studyTerminals学习终端
  studyTerminals: any = null;

  //选择证书的dialog框是否展示
  dialogSelect: boolean = false;
  //证书底图列表选择框
  private dialog: boolean = false;
  // 小问号展示的图片框
  private dialogImg: boolean = false;
  // 预览的图片框
  private previewImg: boolean = false;
  private uploadLoading: boolean = false;
  // 上传的图片
  private uploadImgObj: any = null;
  private currentVideoListInDialog: any[] = [];
  private currentLocalImgListInDialog: any[] = [];
  //小问号展示的图片
  private imageUrl: any = null;
  //预览图片url
  private previewImageUrl: any = null;
  //选择的底图
  private selectImageUrl: any = null;
  private checkImgIndex: any = null;
  //底图列表
  private imgList: any = [];
  radio: string = "";
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

  // 菜单列表
  menuList: any;

  // loading
  loading: boolean = false;
  // 是否初始化过页面
  isInit: boolean = false;

  isType: any = "1"; //1自定义  2选择
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

  /**
   * 打开选择证书
   */
  openNewSelectCertificate() {
    this.dialogSelect = true;
    setTimeout(() => {
      let ref = this.$refs.NewSelectCertificate as NewSelectCertificateTs;
      ref.studyTerminals = this.studyTerminals;
      ref.getCourseList();
    }, 500);
  }
  /**
   * 选择证书子组件返回的值
   * @param data
   */
  private confirmPopup(data: any) {
    console.log(data);
    Http.get(MarkeTing.listCertificateLibraryDetail, data)
      .then(res => {
        this.form2 = res.data.data;
        this.handleType(this.form2.certificateAttributes);
      })
      .catch(err => {
        this.$message("失败");
      });
    // this.form2 = data;
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

  /**
   * 处理自定义证书的属性
   */
  handleTypeCustom(list: any) {
    list.forEach((item: any) => {
      this.gradeList.forEach((item2: any) => {
        if (item === item2.id) {
          this.grade.push(item);
        }
      });
      this.typeList.forEach((item2: any) => {
        if (item === item2.id) {
          this.type.push(item);
        }
      });
      this.natureList.forEach((item2: any) => {
        if (item === item2.id) {
          this.nature.push(item);
        }
      });
    });
    console.log(this.grade);
  }

  /**
   * 证书确认编辑完成
   */
  private confirm() {
    if (this.isType === "1") {
      let ref: any = this.$refs.form;
      ref.validate((valid: any) => {
        if (valid) {
          this.createCertificate();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    } else if (this.isType === "2") {
      if (this.form2.certificateName) {
        //form2选择证书
        this.dialogSetting = false;
        this.form2.certificateType = "2";
        this.form2.typeStr = this.typeStr;
        this.form2.gradeStr = this.gradeStr;
        this.form2.natureStr = this.natureStr;
        this.$emit("cert", this.form2);
      } else {
        this.$message.error("请选择证书");
      }
    }
  }

  /**
   * 生成证书
   */
  createCertificate() {
    const loading = this.$loading({
      lock: true,
      text: "加载中...",
      background: "rgba(0, 0, 0, 0.2)"
    });
    // this.form2.certificateLibraryId = '2';
    const params = this.isType === "1" ? this.form : this.form2;
    Http.post(MarkeTing.getPreStudyMarketingCertificate, params)
      .then(res => {
        loading.close();
        this.form.certificateUrl = res.data.data;
        //form是自建课程
        let data: any;
        data = this.form;
        data.typeStr = "";
        data.gradeStr = "";
        data.natureStr = "";
        data.certificateType = "1";
        this.typeList.forEach((item: any) => {
          this.type.forEach((item2: any) => {
            if (item.id === item2) {
              data.typeStr
                ? (data.typeStr = data.typeStr + "、" + item.attributeName)
                : (data.typeStr = data.typeStr + item.attributeName);
            }
          });
        });
        this.gradeList.forEach((item: any) => {
          this.grade.forEach((item2: any) => {
            if (item.id === item2) {
              data.gradeStr
                ? (data.gradeStr = data.gradeStr + "、" + item.attributeName)
                : (data.gradeStr = data.gradeStr + item.attributeName);
            }
          });
        });
        this.natureList.forEach((item: any) => {
          this.nature.forEach((item2: any) => {
            if (item.id === item2) {
              data.natureStr
                ? (data.natureStr = data.natureStr + "、" + item.attributeName)
                : (data.natureStr = data.natureStr + item.attributeName);
            }
          });
        });
        data.attributeBaseIds = [];
        data.attributeBaseIds = data.attributeBaseIds
          .concat(this.grade)
          .concat(this.nature)
          .concat(this.type);
        this.dialogSetting = false;
        this.$emit("cert", data);
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  // async mounted() {}

  private async created() {
    this.certificateUrlList();
    // this.certificateNature();
    console.log(this.menuList, "00000000000000");
  }

  /**
   * 切换tab
   */
  handleClick(tab: any, event: any) {
    console.log(tab, event);
  }

  /**
   * 点击问号展示图片
   */
  showImg() {
    this.dialogImg = true;
  }

  /**
   * 获取证书的属性
   * @param event
   */
  certificateNature() {
    Http.get(MarkeTing.listCertificateAttributeByTerminalCode, {
      studyTerminal: this.studyTerminals
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
   * 预览证书
   */
  previewCertificate() {
    if (this.isType === "1") {
      let ref: any = this.$refs.form;
      ref.validate((valid: any) => {
        if (valid) {
          this.createPreviewCertificate();
        }
      });
    } else if (this.isType === "2") {
      if (this.form2.certificateName) {
        this.previewImageUrl = this.form2.certificateUrl;
        this.previewImg = true;
      } else {
        this.$message.error("请选择证书");
      }
    }
  }

  /**
   * 生成预览的证书
   */
  createPreviewCertificate() {
    const loading = this.$loading({
      lock: true,
      text: "加载中...",
      background: "rgba(0, 0, 0, 0.2)"
    });
    const params = this.isType === "1" ? this.form : this.form2;
    Http.post(MarkeTing.getPreStudyMarketingCertificate, params)
      .then(res => {
        loading.close();
        this.previewImageUrl = res.data.data;
        this.previewImg = true;
      })
      .catch(err => {
        this.$message("失败");
      });
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
            this.imageUrl = resp.data.data;
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
   * 选择底图
   * @param item
   * @param index
   */
  private selectImg(item: any, index: any) {
    this.checkImgIndex = index;
    this.selectImageUrl = item.certificateUrl;
  }

  /**
   * 确定选择的图片的底色
   */
  private confirmImage() {
    this.dialog = false;
    this.imageUrl = this.selectImageUrl;
    this.form.certificateBasePicUrl = this.selectImageUrl;
  }
}
