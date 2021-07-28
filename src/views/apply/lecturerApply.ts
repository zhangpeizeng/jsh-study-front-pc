import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import UploadImg from "@/components/upload-img-advert/upload-img-advert.vue";
import ApplyTimeline from "@/components/apply/apply-timeline/apply-timeline.vue";
import ApplyPreview from "@/components/apply/apply-preview/apply-preview.vue";

@Component({
  components: {
    UploadImg,
    ApplyTimeline,
    ApplyPreview
  }
})
export default class Login extends Vue {
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
  private lecturerDetail: any = ""; // 讲师详情对象
  private lecturerImg: any = ""; // 讲师头像
  private lecturerDesc: any = ""; // 简介
  private auditDesc: any = ""; // 申请说明
  private organizationDtoList: any = "";
  private packFlag: boolean = false;
  private packText: string = "展开";
  private fileShowList: any = []; // 图片回显list
  private againstReason: string = "";
  private studyTerminals: any = [];
  private terminalsListData: any = [
    {
      terminalCode: "1",
      terminalName: "客户端"
    },
    {
      terminalCode: "2",
      terminalName: "员工端"
    },
    {
      terminalCode: "3",
      terminalName: "直销员端"
    }
  ];
  // private jwtto = require("jwt-decode");
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

  private packClick() {
    this.packFlag = !this.packFlag;
    if (this.packFlag) {
      this.packText = "收起";
    } else {
      this.packText = "展开";
    }
  }

  private closeMask() {
    this.previewDialog = false;
  }
  // 获取预览组件实例
  private instancePreview(preview: any) {
    this.instancePre = preview;
  }
  // 预览
  private previewClick() {
    this.previewDialog = true;
    let params = {
      lecturerName: this.lecturerDetail.lecturerName,
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
    // 审核中,已激活直接关闭当前页
    if (this.lecturerDetail.status == 1 || this.lecturerDetail.status == 2) {
      window.close();
    } else {
      this.$confirm("您还没有进行保存，确认关闭吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          window.close();
        })
        .catch(() => {});
    }
  }

  private save() {
    if (this.department.length == 0) {
      this.$message.error("请选择至少一个部门");
      return;
    }
    if (this.micro.length == 0) {
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
    if (!this.auditDesc) {
      this.$message.error("请填写申请说明");
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
    let params = {
      id: null,
      accountId: this.applyAccountId,
      lecturerName: this.lecturerDetail.lecturerName, // 讲师名
      employeeId: this.lecturerDetail.employeeId, // 工号
      lecturerImg: this.lecturerImg, // 讲师头像
      lecturerTitle: this.lecturerDetail.lecturerTitle, // 头衔
      lecturerDesc: this.lecturerDesc, // 简介
      auditDesc: this.auditDesc, // 申请说明
      organizationDtoList: this.organizationDtoList,
      studyTerminals: this.studyTerminals, // 学习终端
      type: 1
    };
    console.log(params);
    if (this.lecturerDetail.id) {
      params.id = this.lecturerDetail.id;
    }
    Http.postto(MarkeTing.lecturerAdd, params, this.applyToken).then(res => {
      if (res.data.success && res.data.data) {
        window.close();
      } else {
        this.$message.error(res.data.errorMsg);
      }
    });
  }
  private created() {
    const { applyAccountId } = this.$route.query;
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
    Http.getto(
      MarkeTing.lecturerInfoQry,
      { accountId: this.applyAccountId },
      this.applyToken
    ).then(res => {
      if (res.data.success && res.data.data) {
        this.lecturerDetail = res.data.data;
        if (this.lecturerDetail.id) {
          this.lecturerDesc = this.lecturerDetail.lecturerDesc; // 简介
          this.auditDesc = this.lecturerDetail.auditDesc; // 申请说明
          this.lecturerImg = this.lecturerDetail.lecturerImg; // 头像
          this.fileShowList = [{ name: "", url: this.lecturerImg }];
          this.instancePic.showImg(this.fileShowList); // 回显图片
          if (this.lecturerDetail.organization) {
            // 部门组织返显
            this.lecturerDetail.organization.departmentList.forEach(
              (value: any) => {
                this.department.push(value.organizationId);
              }
            );
            // 小微组织返显
            this.lecturerDetail.organization.centerList.forEach(
              (value: any) => {
                this.micro.push(value.organizationId);
              }
            );
          }
          // 返显学习终端
          if (res.data.data.studyTerminalDtos) {
            let studyTerminalDtos = res.data.data.studyTerminalDtos;
            this.studyTerminals = [];
            studyTerminalDtos.forEach((item: any) => {
              this.studyTerminals.push(item.studyTerminalCode);
            });
          }
          if (this.lecturerDetail.status == 2) {
            // 审核中
            this.typeStep = 1;
            this.auditFlag = true;
          } else if (this.lecturerDetail.status == 3) {
            // 已驳回
            this.typeStep = 1;
            this.stepStatus = "error";
            for (
              let i = 0;
              i <= this.lecturerDetail.lecturerLogDtoList.length;
              i++
            ) {
              if (this.lecturerDetail.lecturerLogDtoList[i].status == 2) {
                this.againstReason = this.lecturerDetail.lecturerLogDtoList[
                  i
                ].auditDesc;
                break;
              }
            }
          } else if (this.lecturerDetail.status == 1) {
            // 已激活
            this.typeStep = 2;
            this.auditFlag = true;
          }
        }
      } else {
        this.$message.error(res.data.errorMsg);
      }
    });
  }
}
