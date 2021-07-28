import { Component, Prop, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import UploadImg from "@/components/upload-img-advert/upload-img-advert.vue";
import ApplyTimeline from "@/components/apply/apply-timeline/apply-timeline.vue";
import ApplyPreview from "@/components/apply/apply-preview/apply-preview.vue";
import SelectTeacher from "@/components/select-teacher/select-teacher.vue";
import groupsPopup from "@/components/student-groups/groups-popup/groups-popup.vue";
import SelectTeacherTs from "@/components/select-teacher/select-teacher.ts";

@Component({
  components: {
    SelectTeacher,
    UploadImg,
    ApplyTimeline,
    ApplyPreview,
    groupsPopup
  }
})
export default class Login extends Vue {
  private addGroupDialog: boolean = false;
  private tableData: any = [];
  private studyTerminals: any = ""; // 终端
  private terminalsListData: any = []; // 终端列表
  private loading: boolean = false;
  private groupingName: any = ""; // 分组名称
  private status: any = ""; // 状态(0-停用，1-启用)
  listCount: number = 100;
  // 默认当前的页面
  currentChange: number = 1;
  // 默认当前页面的数量
  limit: number = 10;

  private created() {
    this.terminalList();
  }
  private confirmAddPopup() {
    this.addGroupDialog = false;
    this.terminalList();
  }
  addStudent() {
    this.addGroupDialog = true;
  }
  /**
   * 获取终端列表
   * @param preview
   */
  private terminalList() {
    Http.post(MarkeTing.SearchSysDict, { typeCode: "study_terminal" })
      .then(res => {
        const { data } = res;

        if (data.success) {
          // this.options = [{"typeName":"终端类型","typeCode":"study_terminal","labelName":"客户端","labelCode":"1","iconUrl":null,"icon":null,"remarks":null},{"typeName":"终端类型","typeCode":"study_terminalDD","labelName":"非客户端","labelCode":"2","iconUrl":null,"icon":null,"remarks":null}]
          this.terminalsListData = data.data;
          // this.studyTerminals = this.terminalsListData[0].labelCode;
          this.groupsList();
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  // 讲师详情 跳转
  private goToDetails(item: any): void {
    let goToDetail = this.$router.resolve({
      path: "/groups-detail",
      query: {
        id: item.id,
        studyTerminal: item.studyTerminal
      }
    });
    window.open(goToDetail.href, "_blank");
  }
  /**
   * 查询
   */
  query() {
    this.currentChange = 1;
    this.groupsList();
  }

  /**
   * 分组列表
   */
  private groupsList() {
    this.loading = true;
    Http.post(MarkeTing.listCustomerGrouping, {
      groupingName: this.groupingName,
      studyTerminal: this.studyTerminals,
      status: this.status,
      pageNum: this.currentChange,
      pageSize: this.limit
    })
      .then(res => {
        this.loading = false;
        if (res.data.success) {
          console.log(res.data.data, "shishishsihsishsihsihsi33333333333333");
          this.tableData = res.data.data.list;
          this.listCount = res.data.data.total;
        }
      })
      .catch(err => {
        this.$message("失败");
      });
  }

  /**
   * 重置按钮
   */
  private reset() {
    this.status = "";
    this.groupingName = "";
    this.studyTerminals = "";
    // this.groupsList();
  }

  /**
   * 教师详情接口
   * @param preview
   */
  // private teacherDetail() {
  //
  //     Http.get(MarkeTing.getlecturerDetail, { id: this.id })
  //         .then(res => {
  //
  //         })
  //         .catch(err => {
  //             this.$message("失败");
  //         });
  // }
  /**
   * 底部跳转页面
   * @param val
   */
  handleSizeChange(val: any) {
    this.limit = val;
    console.log(`每页 ${val} 条1`);
    this.groupsList();
  }

  handleCurrentChange(val: any) {
    console.log(`当前页2: ${val}`);
    this.currentChange = val;
    this.groupsList();
  }

  private close() {
    this.$router.push({ path: "/lecturer-list" });
  }
}
