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
import { downPublicFiles, formatDate, getFullAddress } from "@/utils";

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
export default class addStudent extends Vue {
  @Prop({
    type: String,
    required: true
  })
  private classId!: any;

  @Prop({
    required: true
  })
  private studyTerminal!: any;
  //状态
  private studentName: any = "";

  private dialogFormVisible: any = false;

  private loading: any = false;

  private tableData: any = [];

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  // 默认当前的页面
  currentChange: number = 1;

  exportDataList: any = [];

  // 默认当前页面的数量
  limit: number = 10;

  uuid: any = ""; //当前用户唯一标识

  id: any = ""; // 广告id

  isType: any = "1"; //1按公司导入 2按公司部门导入 3按人员导入
  isType2: any = "1"; //1按公司导入 2按公司部门导入 3按人员导入

  upFileLoading: boolean = false;

  isFlag: boolean = false;

  problemInfo: string = ""; //下载问题反馈

  invalidCount: number = 0; //失败数量

  totalNumber: number = 0; //总数量

  validCount: number = 0; //成功数量

  arrayList: any = []; //当前导入的数据

  arrayPageList: any = []; //当前分页之后的数据

  isExport: any = false; //判断当前是否操作过指定学员数据

  created() {}

  /**
   * 打开指定学员弹框
   */
  private openDialogFormVisible(type: any) {
    this.dialogFormVisible = true;
    this.isType = type;
    this.exportDataList = [];
  }

  /**
   * 切换页
   * @param pageSize
   */
  private handleSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
  }

  private handleCurrentChange(pageNum: number): void {
    this.pageNum = pageNum;
  }

  //下载模版
  downTmp(): void {
    if (this.isType == "1") {
      downPublicFiles(
        getFullAddress("/pc/files/company.xlsx"),
        "按公司导入模板"
      );
    } else if (this.isType == "2") {
      downPublicFiles(
        getFullAddress("/pc/files/companyDepartment.xlsx"),
        "按公司部门导入模板"
      );
    } else if (this.isType == "3") {
      downPublicFiles(
        getFullAddress("/pc/files/personnel.xlsx"),
        "按人员导入模板"
      );
    }
  }

  //导入
  private beforeAvatarUpload(file: any) {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("studyTerminal", this.studyTerminal + "");
    formData.append("searchType", "5");
    formData.append("type", this.isType);
    formData.append("id", this.id);
    this.upFileLoading = true;
    Http.postMultipartData(MarkeTing.importData, formData)
      .then(resp => {
        if (resp.data.success && resp.data.data) {
          this.upFileLoading = false;
          this.isFlag = true;
          this.problemInfo = resp.data.data.url;
          this.invalidCount = resp.data.data.invalidCount;
          this.totalNumber = resp.data.data.totalNumber;
          this.uuid = resp.data.data.uuid;
          this.validCount = resp.data.data.validCount;
          console.log(resp.data.data.all);
          this.exportDataList = resp.data.data.all;
        } else {
          this.upFileLoading = false;
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }
  /**
   * 确定移除学员
   */
  confirm() {
    Http.post(MarkeTing.insertClassStudent, {
      includeList: [
        {
          classId: Number(this.classId),
          uuid: this.uuid
        }
      ]
    })
      .then(res => {
        if (res.data.success) {
          console.log("1111111");
          this.$emit("confirm");
        } else {
          this.$message.error(res.data.errorMsg);
        }
      })
      .catch(() => {
        this.$message.error("服务器错误");
      });
  }

  btnDelRows(rows: any, code: any) {
    console.log(rows);
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      this.exportDataList.splice(rows, 1);
      this.deleteRedisData(code);
    });
    console.log(this.exportDataList);
  }

  //删除
  private btnDel(rows: any, code: any) {
    this.$confirm("确定要删除吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      this.arrayPageList.splice(rows, 1);
      if (this.isExport) {
        this.deleteRedisData(code);
      } else {
        this.deleteCacheThrow(code);
      }
    });
  }

  /**
   * redis中获取导入的分页数据
   */
  redisDataList() {
    let params = {
      uuid: this.uuid,
      searchType: "5",
      terminalCode: this.studyTerminal,
      pageNum: this.currentChange,
      pageSize: this.limit,
      id: this.id
    };
    Http.post(MarkeTing.listRedisCacheThrow, params)
      .then(resp => {
        if (resp.data.success) {
          this.arrayPageList = resp.data.data.list;
          this.total = resp.data.data.total;
          this.isExport = true;
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
  }

  /**
   * 删除删除redis中导入的数据
   */
  deleteRedisData(code: any) {
    let params: any = {};
    if (this.isType === "3") {
      params = {
        type: this.isType,
        searchType: "5",
        terminalCode: this.studyTerminal,
        accountName: code.accountName,
        huiHuiNumber: code.huihuiNumber,
        uuid: this.uuid
      };
    } else {
      params = {
        type: this.isType,
        searchType: "5",
        terminalCode: this.studyTerminal,
        orgCode: code.orgCode,
        orgName: code.orgName,
        departmentName: code.departmentName,
        departmentCode: code.departmentCode,
        uuid: this.uuid
      };
    }
    Http.post(MarkeTing.deleteRedisCacheThrow, params)
      .then(resp => {
        if (resp.data.success) {
          this.redisDataList();
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
  }

  /**
   * 删除删除数据库中中导入的数据
   */
  deleteCacheThrow(code: any) {
    let params = {
      searchType: "5",
      terminalCode: this.studyTerminal,
      dateCode: code.orgCode,
      orgId: code.id,
      id: this.id
    };
    Http.post(MarkeTing.deleteCacheThrow, params)
      .then(resp => {
        if (resp.data.success) {
          console.log("11111");
        } else {
          this.$message.error(resp.data.errorMsg);
        }
      })
      .catch(error => {});
  }
  // 确认导入
  private btnSubmit() {
    let newArrayList: any = [];
    this.exportDataList.forEach((item: any) => {
      if (item.right) {
        if (this.studyTerminal === "1") {
          newArrayList.push({
            orgCode: item.orgCode,
            orgName: item.orgName,
            num: item.count
          });
        } else if (
          this.studyTerminal === "3" ||
          this.studyTerminal === "2" ||
          this.studyTerminal == "4"
        ) {
          newArrayList.push({
            accountName: item.accountName,
            huihuiNumber: item.huihuiNumber,
            status: item.status,
            phone: item.phone,
            accountId: item.accountId
          });
        }
      }
    });
    if (
      this.studyTerminal === "3" ||
      this.studyTerminal === "2" ||
      this.studyTerminal == "4"
    ) {
      newArrayList.forEach((item: any) => {
        if (item.phone) {
          item.phone = item.phone.substr(0, 3) + "****" + item.phone.substr(7);
        }
      });
    }
    // this.arrayList = newArrayList;
    if (newArrayList.length > 0) {
      this.redisDataList();
      this.isType2 = JSON.stringify(this.isType.toString());
      this.isType2 = JSON.parse(this.isType2);
    }
    this.dialogFormVisible = false;
  }
}
