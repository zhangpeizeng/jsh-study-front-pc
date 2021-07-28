import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {}
})
export default class studentDetail extends Vue {
  private code: any = "";
  private id: any = ""; // 学员ID
  private created(): void {
    this.id = this.$route.query.id;
    this.code = this.$route.query.code;
    if (this.id) {
      this.getStudentDetail();
    }
  }
  private studentInfo: any = {
    accountName: "", // 学员名称
    huiHuiNumber: null, // 学员学号
    phone: null, // 手机号
    orgCode: null, // 组织编码
    orgName: null, // 组织名称
    studyTerminal: null, // 所属学习终端
    groupingName: null, // 所属分组
    createTime: null, // 激活时间
    twoDepartmentName: "",
    departmentName: ""
  }; // 基本信息

  private studentLabel: any = {
    gmName: null, // 中心
    product: null, // 产业
    brand: null, // 品牌类型
    channel: null, // 大渠道
    customerType: null, // 客户类型
    levelName: null, //等级
    role: null //角色
  }; // 学员标签

  private status: any = 1; // 冻结/解冻状态

  // 获取学员详情
  private getStudentDetail(): void {
    this.studentInfo = {};
    this.studentLabel = {};
    Http.get(MarkeTing.getStudentDetail, {
      id: this.id
    })
      .then(res => {
        if (res.data.success) {
          this.studentInfo.departmentName = res.data.data.departmentName;
          this.studentInfo.type = res.data.data.type;
          this.studentInfo.accountName = res.data.data.accountName;
          this.studentInfo.huiHuiNumber = res.data.data.huiHuiNumber;
          this.studentInfo.twoDepartmentName = res.data.data.twoDepartmentName;
          this.studentInfo.phone = res.data.data.phone;
          this.studentInfo.orgCode = res.data.data.orgCode;
          this.studentInfo.orgName = res.data.data.orgName;
          this.studentInfo.studyTerminal = res.data.data.studyTerminal;
          this.studentInfo.groupingName = res.data.data.groupingName;
          this.studentInfo.createTime = res.data.data.createTime;
          this.studentLabel.gmName = res.data.data.gmName;
          this.studentLabel.levelName = res.data.data.levelName;
          this.studentLabel.product = res.data.data.product;
          this.studentLabel.brand = res.data.data.brand;
          this.studentLabel.channel = res.data.data.channel;
          this.studentLabel.customerType = res.data.data.customerType;
          this.studentLabel.role = res.data.data.role;
          this.status = res.data.data.status;
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  // 冻结/解冻学员
  private frozen(): void {
    let message: any = "";
    message = this.status === "1" ? "确认冻结？" : "确认解冻？";
    this.$confirm(message, "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      Http.get(MarkeTing.updateStudentStatus, {
        id: this.id,
        status: this.status === "1" ? 0 : 1
      })
        .then(res => {
          this.getStudentDetail();
        })
        .catch(() => {
          this.$message.error("服务器出错");
        });
    });
  }

  //跳转到修改页面
  private reviseStudent() {
    this.$router.push({
      path: "/open-student",
      query: {
        saveType: "1",
        id: this.id,
        code: this.code
      }
    });
  }

  // 关闭学员详情页
  private close(): void {
    window.close();
  }
}
