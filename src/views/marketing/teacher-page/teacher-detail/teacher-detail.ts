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
  private auditDesc: any = ""; // 申请说明
  private organizationDtoList: any = "";
  private packFlag: boolean = false;
  private packText: string = "展开";
  private fileShowList: any = []; // 图片回显list
  private againstReason: string = "";
  // private jwtto = require("jwt-decode");

  private packClick() {
    this.packFlag = !this.packFlag;
    if (this.packFlag) {
      this.packText = "收起";
    } else {
      this.packText = "展开";
    }
  }

  getPaperData(data: any) {
    console.log("试卷", data);
    this.lecturerDetail = data;
  }
  private closeMask() {
    this.previewDialog = false;
  }

  /**
   * 教师详情接口
   * @param preview
   */
  private teacherDetail() {
    this.studyTerminals = [];
    this.department = [];
    this.micro = [];
    Http.get(MarkeTing.getlecturerDetail, { id: this.id })
      .then(res => {
        this.status = res.data.data.status;
        this.lecturerDetail.accountId = res.data.data.employeeId;
        this.lecturerDetail.accountName = res.data.data.lecturerName;
        this.lecturerDetail.huiHuiNumber = res.data.data.employeeId;
        this.lecturerDetail.phone = res.data.data.phone;
        this.auditDesc = res.data.data.auditDesc;
        this.lecturerDesc = res.data.data.lecturerDesc;
        this.lecturerImg = res.data.data.lecturerImg;
        this.activities = res.data.data.lecturerLogDtoList;
        this.microList = res.data.data.organization.centerList;
        this.departmentList = res.data.data.organization.departmentList;
        let studyTerminalDtos = res.data.data.studyTerminalDtos;
        this.microList.forEach((item: any) => {
          this.micro.push(item.organizationName);
        });
        this.departmentList.forEach((item: any) => {
          this.department.push(item.organizationName);
        });
        studyTerminalDtos.forEach((item: any) => {
          this.studyTerminals.push(item.studyTerminalName);
        });
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  private close() {
    window.close();
    // this.$router.push({ path: "/lecturer-list" });
  }

  /**
   * 跳转教师编辑
   */
  private revise() {
    this.$route.meta.title = "修改讲师";
    this.$router.push({
      path: "/add-teacher",
      query: {
        id: this.id
      }
    });
  }

  /**
   * 冻结
   */
  private frozen() {
    let message: any = "";
    message = this.status ? "确认冻结？" : "确认解冻？";
    this.$confirm(message, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.post(MarkeTing.updateLecturerStatusById, {
          id: this.id,
          type: 2,
          status: this.status ? 0 : 1,
          auditDesc: ""
        })
          .then(res => {
            if (res.data.success) {
              this.teacherDetail();
            }
          })
          .catch(err => {
            this.$message("失败");
          });
      })
      .catch(() => {});
  }
  private created() {
    const { applyAccountId } = this.$route.query;
    this.id = this.$route.query.id;
    if (this.id) {
      this.teacherDetail();
    }
  }
}
