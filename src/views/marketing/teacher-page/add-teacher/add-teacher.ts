import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import UploadImg from "@/components/upload-img-advert/upload-img-advert.vue";
import ApplyTimeline from "@/components/apply/apply-timeline/apply-timeline.vue";
import ApplyPreview from "@/components/apply/apply-preview/apply-preview.vue";
import SelectTeacher from "@/components/select-teacher/select-teacher.vue";
import SelectTeacherTs from "@/components/select-teacher/select-teacher.ts";
@Component({
  components: {
    SelectTeacher,
    UploadImg,
    ApplyTimeline,
    ApplyPreview
  }
})
export default class Login extends Vue {
  private id: any = "";
  private isEdit: boolean = false;
  private status: any = 1;
  private studyTerminals: any = []; // 终端
  private terminalsListData: any = []; // 终端列表
  private stepStatus: string = "success";
  private typeStep: number = 0;
  private previewDialog: boolean = false;
  private instancePre: any = ""; // 预览组件实例
  private microList: any = []; // 小微
  private departmentList: any = []; // 部门
  private micro: any = []; // 小微
  private department: any = []; // 部门
  private instancePic: any = ""; // 图片组件实例
  private activities: any = [];
  private noteImg: string = "750*320";
  private auditFlag: boolean = false; // 审核标识
  private applyAccountId: any = "";
  private applyToken: any = "";
  private lecturerDetail: any = {
    accountId: null,
    orgCode: null,
    accountName: null,
    orgName: null,
    phone: null,
    huiHuiNumber: null
  }; // 讲师详情对象
  private lecturerImg: any = ""; // 讲师头像
  private lecturerDesc: any = ""; // 简介
  private auditDesc: any = null; // 申请说明
  private organizationDtoList: any = "";
  private packFlag: boolean = false;
  options: any = [];
  loading: boolean = false;
  private accountId: any = "";
  private accountValue: any = "";
  private id2: any = "";
  private packText: string = "展开";
  private fileShowList: any = []; // 图片回显list
  private againstReason: string = "";
  // private jwtto = require("jwt-decode");
  private isClick: boolean = false; // 防止重复点击

  private packClick() {
    this.packFlag = !this.packFlag;
    if (this.packFlag) {
      this.packText = "收起";
    } else {
      this.packText = "展开";
    }
  }
  // 选择教师
  private selectTeacher() {
    (this.$refs.paper as SelectTeacherTs).dialogSetting = true;
    (this.$refs.paper as SelectTeacherTs).itemPaper = this.lecturerDetail;
  }
  getPaperData(data: any) {
    console.log("试卷", data);
    this.lecturerDetail = data;
  }
  private closeMask() {
    this.previewDialog = false;
  }
  // 判断全选
  private departmentChange(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.department = [];
      this.departmentList.forEach((value: any) => {
        this.department.push(value.organizationId);
      });
    }
  }
  // 判断全选
  private microChange(valueList: any) {
    let allFlag = false;
    for (let i = 0; i <= valueList.length; i++) {
      if (valueList[i] === "all") {
        allFlag = true;
        break;
      }
    }
    if (allFlag) {
      this.micro = [];
      this.microList.forEach((value: any) => {
        this.micro.push(value.organizationId);
      });
    }
  }
  /**
   * 获取终端列表
   * @param preview
   */
  private terminalList() {
    Http.get(MarkeTing.listStudyTerminal)
      .then(res => {
        this.terminalsListData = res.data.data;
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 教师详情接口
   * @param preview
   */
  private teacherDetail() {
    Http.get(MarkeTing.getlecturerDetail, { id: this.id })
      .then(res => {
        console.log(res.data.data, "7777777777777777777777");
        this.status = res.data.data.status;
        this.lecturerDetail.accountId = res.data.data.accountId;
        this.lecturerDetail.accountName = res.data.data.lecturerName;
        this.lecturerDetail.huiHuiNumber = res.data.data.employeeId;
        this.lecturerDetail.phone = res.data.data.phone;
        this.auditDesc = res.data.data.auditDesc;
        this.lecturerDesc = res.data.data.lecturerDesc;
        this.lecturerImg = res.data.data.lecturerImg;
        this.fileShowList = [{ name: "", url: this.lecturerImg }];
        this.instancePic.showImg(this.fileShowList); // 回显图片
        this.activities = res.data.data.lecturerLogDtoList;
        let microList = res.data.data.organization.centerList;
        let departmentList = res.data.data.organization.departmentList;
        let studyTerminalDtos = res.data.data.studyTerminalDtos;
        // studyTerminals               this.status = res.data.data.status;
        this.micro = [];
        this.department = [];
        microList.forEach((item: any) => {
          this.micro.push(item.organizationId);
        });
        departmentList.forEach((item: any) => {
          this.department.push(item.organizationId);
        });
        this.studyTerminals = [];
        studyTerminalDtos.forEach((item: any) => {
          this.studyTerminals.push(item.studyTerminalCode);
        });
        console.log(
          this.studyTerminals,
          "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        );
      })
      .catch(err => {
        this.$message("失败");
      });
  }
  // 查讲师
  private remoteMethod(query: any) {
    Http.post(MarkeTing.listAccountInfo, {
      searchType: 2,
      nameOrHuiHui: query,
      page: 1,
      rows: 100
    })
      .then(res => {
        const { data } = res;
        if (data.success && data.data) {
          this.options = data.data.list;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  //检查该讲师是否有权限
  private selectAll(i: any) {
    let ref: any = this.$refs.select;
    console.log("22222222222222222222222", this.accountValue);
    this.options.forEach((item: any) => {
      if (item.accountId == i) {
        this.lecturerDetail = item;
      }
    });
    // this.lecturerDetail.huiHuiNumber = i.huiHuiNumber;
    // this.lecturerDetail.accountId = i.accountId;
    // this.lecturerDetail.accountName = i.accountName;
    // this.lecturerDetail.phone = i.phone;
    Http.postFormData(MarkeTing.checkAccount, {
      accountId: i
    })
      .then(res => {
        if (res.data.success) {
          console.log("11111111111111111");
        } else {
          this.options.forEach((item: any, index: any) => {
            if (item.accountId == i) {
              this.options.splice(index, 1);
            }
          });
          this.lecturerDetail.accountId = null;
          this.accountValue = "";
          // ref.query = '';
          this.$message(res.data.errorMsg);
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }
  // 获取预览组件实例
  private instancePreview(preview: any) {
    this.instancePre = preview;
  }
  // 预览
  private previewClick() {
    this.previewDialog = true;
    let params = {
      lecturerName: this.lecturerDetail.accountName,
      lecturerImg: this.lecturerImg,
      lecturerDesc: this.lecturerDesc
    };
    this.instancePre.showMask(params);
  }

  // 获取上传图片组件实例
  private instanceImg(img: any) {
    this.instancePic = img;
  }

  // 图片上传成功
  private fileSuccess(data: any) {
    if (data.length == 0) {
      this.lecturerImg = "";
    } else {
      this.lecturerImg = data[0].url;
    }
  }

  private close() {
    this.$confirm("您还没有保存,确认返回吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$router.push({ path: "/lecturer-list" });
      })
      .catch(() => {});
  }
  private back() {
    this.$router.push({
      path: "/teacher-detail",
      query: {
        id: this.id
      }
    });
  }

  private save() {
    //防止重复点击
    console.log(this.department);
    if (!this.lecturerDetail.accountId) {
      this.$message.error("请选择讲师");
      return;
    }
    if (this.department.length === 0) {
      this.$message.error("请选择至少一个部门");
      return;
    }
    if (this.micro.length === 0) {
      this.$message.error("请选择至少一个小微");
      return;
    }
    if (this.studyTerminals.length === 0) {
      this.$message.error("请选择至少一个终端");
      return;
    }
    if (!this.lecturerDesc) {
      this.$message.error("请填写简介");
      return;
    }
    if (!this.lecturerImg) {
      this.$message.error("请上传头像");
      return;
    }
    // 组装所属组织list 1部门 2小微
    this.organizationDtoList = [];
    this.department.forEach((value: any) => {
      this.organizationDtoList.push({
        type: 1,
        organizationId: value
      });
    });
    this.micro.forEach((value: any) => {
      this.organizationDtoList.push({
        type: 2,
        organizationId: value
      });
    });
    this.isClick = true;
    let params = {
      id: this.id,
      accountId: this.lecturerDetail.accountId,
      lecturerName: this.lecturerDetail.lecturerName, // 讲师名
      employeeId: this.lecturerDetail.huiHuiNumber, // 工号
      lecturerImg: this.lecturerImg, // 讲师头像
      lecturerTitle: "", // 头衔
      lecturerDesc: this.lecturerDesc, // 简介
      auditDesc: this.auditDesc, // 申请说明
      organizationDtoList: this.organizationDtoList,
      status: this.status,
      studyTerminals: this.studyTerminals,
      type: 2
    };
    console.log(params);
    if (this.lecturerDetail.id) {
      params.id = this.lecturerDetail.id;
    }
    Http.post(MarkeTing.lecturerAdd, params)
      .then(res => {
        this.isClick = false;
        if (res.data.success && res.data.data) {
          if (this.isEdit) {
            this.$message.success("保存成功");
          } else {
            this.$message.success("新建成功");
          }
          this.$router.push({ path: "/lecturer-list" });
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(res => {
        this.isClick = false;
      });
  }
  private created() {
    this.terminalList();
    // this.teacherDetail();
    const { applyAccountId } = this.$route.query;
    this.id = this.$route.query.id;
    if (this.id) {
      this.isEdit = true;
      this.$route.meta.title = "修改讲师";
      this.$route.meta.extendBreadcrumbList[2].name = "修改讲师";
      this.teacherDetail();
    } else {
      this.$route.meta.title = "新增讲师";
      this.$route.meta.extendBreadcrumbList[2].name = "新增讲师";
    }
    this.applyAccountId = applyAccountId;
    this.applyToken = localStorage.getItem("oldtoken");
    // console.log(this.jwtto(this.applyToken));
    Http.getto(
      MarkeTing.getOrganizationList,
      { type: 1 },
      this.applyToken
    ).then(res => {
      if (res.data.success && res.data.data) {
        this.departmentList = res.data.data;
      } else {
        this.$message.error(res.data.errorMsg);
      }
    });
    Http.getto(
      MarkeTing.getOrganizationList,
      { type: 2 },
      this.applyToken
    ).then(res => {
      if (res.data.success && res.data.data) {
        this.microList = res.data.data;
      } else {
        this.$message.error(res.data.errorMsg);
      }
    });
  }
  private mounted() {
    this.id = this.$route.query.id;
    if (this.id) {
      this.isEdit = true;
      document.title = "修改讲师";
      this.$forceUpdate();
      this.teacherDetail();
    } else {
      document.title = "新增讲师";
      this.$forceUpdate();
    }
  }
}
