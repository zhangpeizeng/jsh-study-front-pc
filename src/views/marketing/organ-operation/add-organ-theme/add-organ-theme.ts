import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { Exchange, MarkeTing } from "@/request";
import UploadImg from "@/components/upload-img-advert/upload-img-advert.vue";
import ApplyTimeline from "@/components/apply/apply-timeline/apply-timeline.vue";
import ApplyPreview from "@/components/apply/apply-preview/apply-preview.vue";
import SelectTeacher from "@/components/select-teacher/select-teacher.vue";
import groupsPopup from "@/components/student-groups/groups-popup/groups-popup.vue";
import addCourse from "@/components/organ-theme/add-course.vue";
import { formatDate } from "@/utils";
import SelectTeacherTs from "@/components/select-teacher/select-teacher.ts";

@Component({
  components: {
    SelectTeacher,
    UploadImg,
    ApplyTimeline,
    ApplyPreview,
    addCourse,
    groupsPopup
  },
  filters: {
    phone: function(value: any) {
      return value.substr(0, 3) + "****" + value.substr(7);
    }
  }
})
export default class Login extends Vue {
  private labelCode: any = "";
  private selectCourseDialog: any = false; // 添加课程的选择框
  private addGroupDialog: boolean = false;
  private studentTableData: any = [];
  private themeTableData: any = [];
  private detailData: any = "";
  private lecturerLoading: boolean = false;
  private id: any = "";
  private studyTerminal: any = "";
  listCount: number = 0;
  // 默认当前的页面
  currentChange: number = 1;
  // 默认当前页面的数量
  limit: number = 10;
  private downloading: boolean = false; // 导出状态

  private downloadTimer: any = 0; // 导出

  themeTitle: any = "";

  organCode: any = ""; // 所选机构

  organName: any = ""; // 所选机构名字

  saveType: any = "";

  private created() {
    this.organCode = this.$route.query.organCode;
    this.organName = this.$route.query.organName;
    this.labelCode = this.$route.query.labelCode;
    this.studyTerminal = this.$route.query.studyTerminal;
    this.saveType = this.$route.query.saveType;
    this.id = this.$route.query.id;
    if (this.saveType) {
      document.title = "修改主题";
      this.$route.meta.extendBreadcrumbList[2].name = "修改主题";
      this.themeDetail();
    } else {
      document.title = "新建主题";
      this.$route.meta.extendBreadcrumbList[2].name = "新建主题";
    }
  }

  /**
   * 子组件选择课程带过来的数据
   * @param data
   */
  private confirmCoursePopup(data: any) {
    console.log(data, "hhhhhhhhhhhhhhhhhhhhhhh");
    this.studentTableData = this.studentTableData.concat(data);
    this.classifyPage();
  }

  /**
   * 移除一个列表数据
   */
  deletList(index: any) {
    this.$confirm("是否确认移除?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.studentTableData.splice(index, 1);
        this.themeTableData.splice(index, 1);
      })
      .catch(() => {});
  }

  /**
   * 打开选择课程的弹框
   */
  openAddCourse() {
    this.selectCourseDialog = true;
  }

  editStudent() {
    this.addGroupDialog = true;
  }

  // 向上移动
  private tabUp(value: any, index: any) {
    if (index !== 0) {
      let temIndex = 0;
      this.studentTableData.forEach((value1: any, index1: any) => {
        if (value1.baseId == value.baseId) {
          temIndex = index1;
        }
      });
      // 对提交的的list做同样的处理
      this.studentTableData[temIndex] = this.studentTableData.splice(
        temIndex - 1,
        1,
        this.studentTableData[temIndex]
      )[0];
      this.themeTableData[index] = this.themeTableData.splice(
        index - 1,
        1,
        this.themeTableData[index]
      )[0];
    }
  }

  // 向下移动
  private tabDown(value: any, index: any) {
    if (index !== this.themeTableData.length - 1) {
      let temIndex = 0;
      this.studentTableData.forEach((value1: any, index1: any) => {
        if (value1.baseId == value.baseId) {
          temIndex = index1;
        }
      });
      // 对提交的的list做同样的处理
      this.studentTableData[temIndex] = this.studentTableData.splice(
        temIndex + 1,
        1,
        this.studentTableData[temIndex]
      )[0];
      this.themeTableData[index] = this.themeTableData.splice(
        index + 1,
        1,
        this.themeTableData[index]
      )[0];
    }
  }

  /**
   * 立即发布或者保存
   */
  private save() {
    if (this.themeTitle == "") {
      this.$message.error("请填写主题名称");
      return;
    }

    if (this.studentTableData.length == 0) {
      this.$message.error("请添加课程");
      return;
    }
    let courseDtos: any = [];
    this.studentTableData.forEach((item: any, index: any) => {
      courseDtos.push({
        baseId: item.baseId,
        sortNo: index + 1
      });
    });
    const params = {
      studyTerminalCode: this.labelCode,
      id: this.id,
      classifyName: this.themeTitle,
      firstClassifyId: this.organCode,
      courseDtos: courseDtos
    };
    Http.post(MarkeTing.addClassClassifyTheme, params)
      .then(res => {
        if (res.data.success) {
          this.$router.push({
            path: "/theme-list",
            query: {
              code: this.labelCode
            }
          });
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 当前主题详情接口
   * @param preview
   */
  private themeDetail() {
    Http.get(MarkeTing.getClassClassifyThemeDetail, { id: this.id })
      .then(res => {
        if (res.data.success) {
          this.themeTitle = res.data.data.classifyName;
          this.studentTableData = res.data.data.courseDtos;
          this.classifyPage();
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }
  /**
   * 课程分页接口
   */
  classifyPage() {
    let params = {
      courseDtos: this.studentTableData,
      pageNum: this.currentChange,
      pageSize: this.limit
    };
    Http.post(MarkeTing.listChooseColleges, params)
      .then(res => {
        if (res.data.success) {
          this.themeTableData = res.data.data.list;
          this.listCount = res.data.data.total;
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }
  /**
   * 底部跳转页面
   * @param val
   */
  handleSizeChange(val: any) {
    this.limit = val;
    console.log(`每页 ${val} 条1`);
    this.classifyPage();
  }

  handleCurrentChange(val: any) {
    console.log(`当前页2: ${val}`);
    this.currentChange = val;
    this.classifyPage();
  }

  /**
   * 删除
   */
  private deleteGroup() {
    this.$confirm("是否删除", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        Http.get(MarkeTing.updateGroupDelete, {
          id: this.id
        })
          .then(res => {
            if (res.data.success) {
              window.close();
            }
          })
          .catch(err => {
            this.$message("失败");
          });
      })
      .catch(() => {});
  }

  private close() {
    this.$confirm("您还没有保存,确认返回吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.$router.push({
          path: "/theme-list",
          query: {
            code: this.labelCode
          }
        });
      })
      .catch(() => {});
  }
}
