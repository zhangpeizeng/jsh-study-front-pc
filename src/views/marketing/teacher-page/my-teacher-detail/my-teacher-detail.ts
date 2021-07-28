import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import UploadImg from "@/components/upload-img-advert/upload-img-advert.vue";
import ApplyTimeline from "@/components/apply/apply-timeline/apply-timeline.vue";
import ApplyPreview from "@/components/apply/apply-preview/apply-preview.vue";
import SelectTeacher from "@/components/select-teacher/select-teacher.vue";
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
  private accountId: any = "";
  private isEdit: boolean = false;
  private status: any = 1;
  private studyTerminals: any = []; // 终端
  private studyTerminalsName: any = []; // 终端名称
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
  private isClick: boolean = false; // 防止重复点击
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
   * 数组去重
   * @param preview
   */
  unique(arr: any) {
    // 如果新数组的当前元素的索引值 == 该元素在原始数组中的第一个索引，则返回当前元素
    return arr.filter(function(item: any, index: any) {
      return arr.indexOf(item, 0) === index;
    });
  }
  /**
   * 教师详情接口
   * @param preview
   */
  private teacherDetail() {
    this.studyTerminals = [];
    this.studyTerminalsName = [];
    this.department = [];
    this.micro = [];
    Http.get(MarkeTing.getLecturerByAccountId, { accountId: this.accountId })
      .then(res => {
        this.id = res.data.data.id;
        this.status = res.data.data.status;
        this.lecturerDetail.accountId = res.data.data.employeeId;
        this.lecturerDetail.huiHuiNumber = res.data.data.employeeId;
        this.lecturerDetail.accountName = res.data.data.lecturerName;
        this.lecturerDetail.phone = res.data.data.phone;
        this.auditDesc = res.data.data.auditDesc;
        this.lecturerDesc = res.data.data.lecturerDesc;
        this.lecturerImg = res.data.data.lecturerImg;
        this.fileShowList = [{ name: "", url: this.lecturerImg }];
        this.instancePic.showImg(this.fileShowList); // 回显图片
        this.activities = res.data.data.lecturerLogDtoList;
        this.microList = res.data.data.organization.centerList;
        this.departmentList = res.data.data.organization.departmentList;
        let studyTerminalDtos = res.data.data.studyTerminalDtos;
        this.microList.forEach((item: any) => {
          this.micro.push(item);
        });
        this.departmentList.forEach((item: any) => {
          this.department.push(item);
        });
        studyTerminalDtos.forEach((item: any) => {
          this.studyTerminals.push(item.studyTerminalCode);
        });
        studyTerminalDtos.forEach((item: any) => {
          this.studyTerminalsName.push(item.studyTerminalName);
        });
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

  private save() {
    console.log(this.department);
    if (!this.lecturerDetail.accountName) {
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
        organizationId: value.organizationId
      });
    });
    this.micro.forEach((value: any) => {
      this.organizationDtoList.push({
        type: 2,
        organizationId: value.organizationId
      });
    });
    this.isClick = true;
    let params = {
      id: this.id,
      accountId: this.accountId,
      lecturerName: this.lecturerDetail.lecturerName, // 讲师名
      employeeId: this.lecturerDetail.accountId, // 工号
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
        if (res.data.success && res.data.data) {
          this.$message.success("保存成功");
          this.isClick = false;
          this.teacherDetail();
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(res => {
        this.isClick = false;
      });
  }
  private created() {
    const { applyAccountId } = this.$route.query;
    this.accountId = localStorage.getItem("accountId");
    console.log(
      this.accountId,
      "7777777777777777666666666666655555555555555555"
    );
    this.teacherDetail();
  }
}
