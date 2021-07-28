import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";
import { BrandListTableData, courseTypeList } from "./interface";
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
export default class ShopClassList extends Vue {
  //
  private classifyName: string = "";
  private courseName: string = "";
  //状态
  private status: string = "";
  //课程类型列表
  private courseTypeList = [];
  // 讲师的列表
  private tableDataTeacher = [];
  private chosetypelist: Array<courseTypeList> = [];

  choosesubmit: Array<any> = [];

  classid?: any;
  private loading: boolean = false;

  private loadingn: boolean = false;

  tableDataMain: Array<any> = [];

  options: Array<any> = [];

  colleges: Array<any> = [];

  labelCode: any = ""; // 学习终端

  choosedCourseList: Array<any> = []; // 选择的课程,选择课程

  private total: number = 0;

  private pageNum: number = 1;

  private pageSize: number = 10;

  private total1: number = 0;

  private pageNum1: number = 1;

  private pageSize1: number = 10;

  private dialogTableVisible: boolean = false;

  private tableData: Array<any> = [];
  //防重复点击
  private submitDisable: boolean = false;
  shownolist = true;
  studentForm: any = {
    courseName: "", // 课程名称查询条件
    pageNum: 1,
    pageSize: 10
  };
  studentTotal: any = 1;

  private created(): void {
    this.gettypelist();
    this.classid = this.$route.query.id;
    Http.post(MarkeTing.SearchSysDict, { typeCode: "study_terminal" })
      .then(res => {
        const { data } = res;

        if (data.success) {
          // this.options = [{"typeName":"终端类型","typeCode":"study_terminal","labelName":"客户端","labelCode":"1","iconUrl":null,"icon":null,"remarks":null},{"typeName":"终端类型","typeCode":"study_terminalDD","labelName":"非客户端","labelCode":"2","iconUrl":null,"icon":null,"remarks":null}]
          this.options = data.data;
          // console.log('金鹏测试哈哈哈',this.options)
          this.labelCode = this.options[0].labelCode;
          this.onLoada();
          console.log(this.labelCode, "adsfasdfasdfasdf");
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  private onSearch(): void {
    this.studentForm.pageNum = 1;
    this.choose();
  }
  private addlesson() {
    this.dialogTableVisible = true;
    this.choose();
    this.choosedCourseList = this.choosesubmit;
    // console.log('每次都执行我了')
  }
  private cleanto(): void {
    this.pageNum = 1;
    this.courseTypeList = [];
    this.status = "";
    this.courseName = "";
    // this.onLoad();
  }

  private onpageNumSizeChangeStu(pageSize: number): void {
    this.studentForm.pageSize = pageSize;
    this.choose();
  }

  private onpageNumNumChangeStu(pageNum: number): void {
    this.studentForm.pageNum = pageNum;
    this.choose();
  }

  private onpageNumNumChange1(pageNum: number): void {
    this.pageNum1 = pageNum;
    if (this.pageNum1 > 1) {
      this.choosedCourseList.forEach((item: any, index: any) => {
        if (index + 1 <= (pageNum - 1) * 10) {
          item.delFlg = true;
        }
      });
      // this.choosedCourseList.splice(0,(pageNum-1)*10)
    }
    this.getList();
    // this.getList()
  }
  private onpageNumSizeChange1(pageSize: number): void {
    this.pageSize1 = pageSize;
    this.getList();
  }
  private changeKuhuduan() {
    this.tableDataMain = [];
    this.choosedCourseList = [];
    this.choosesubmit = [];
    this.studentTotal = 0;
    this.choose();
    this.total = 0;
    this.total1 = 0;
  }
  private getList() {
    const params = {
      colleges: this.choosesubmit,
      pageNum: this.pageNum1,
      pageSize: this.pageSize1
    };
    // this.loadingn = true
    Http.post(MarkeTing.themeFenye, params)
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.tableDataMain = data.data.list;
          this.total1 = data.data.total;
        } else {
          this.$message.error(data.errorMsg);
        }
        // this.loadingn = false
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  private onLoad(): void {
    const { pageNum, pageSize, courseName, $message } = this;
    const studyTerminal = this.labelCode;
    this.loading = true;
    Http.post(MarkeTing.searchLesson, {
      pageNum,
      pageSize,
      courseName,
      studyTerminal
    })
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          this.tableData = res.data.data.list;
          this.total = res.data.data.total;
          this.shownolist = true;
          if (!this.tableData || this.tableData.length === 0) {
            this.shownolist = false;
          }
        } else {
          this.shownolist = false;
          $message.error(res.data.errorMsg);
        }

        this.loading = false;
      })
      .catch(err => {
        this.shownolist = false;
        // $message.error("品牌列表获取失败，请稍后重试");
        this.loading = false;
      });
  }
  private choose(): void {
    const $message = this.$message;
    const studyTerminal = this.labelCode;
    this.loading = true;
    const params = {
      pageNum: this.studentForm.pageNum,
      courseName: this.studentForm.courseName,
      pageSize: this.studentForm.pageSize,
      studyTerminal: studyTerminal
    };
    Http.post(MarkeTing.searchLesson, params)
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          this.tableData = res.data.data.list;
          this.studentTotal = res.data.data.total;
          this.tableData.forEach((item: any, index: any) => {
            this.$set(item, "alchoose", false);
            // item.alchoose = false
          });
          if (this.choosedCourseList.length > 0) {
            for (let j = 0; j < this.tableData.length; j++) {
              for (let i = 0; i < this.choosedCourseList.length; i++) {
                if (
                  this.tableData[j].baseId == this.choosedCourseList[i].baseId
                ) {
                  this.$set(this.tableData[j], "alchoose", true);
                }
              }
            }
          }
          console.log(this.tableData);
          // this.shownolist = true;
          // if (!this.tableData || this.tableData.length === 0) {
          //     this.shownolist = false;
          // }
        } else {
          // this.shownolist = false;
          $message.error(res.data.errorMsg);
        }

        this.loading = false;
      })
      .catch(err => {
        this.shownolist = false;
        // $message.error("品牌列表获取失败，请稍后重试");
        this.loading = false;
      });
  }
  private gettypelist(): void {
    Http.post(MarkeTing.SearchSysDict, {
      typeCode: "courses_classify"
    })
      .then(res => {
        console.log(res);
        const { data } = res;
        if (data.success && data.data && data.data.length > 0) {
          this.chosetypelist = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("品牌列表获取失败，请稍后重试");
      });
  }
  private gotoadd(scope: any): void {
    console.log(scope);
    this.$router.push({
      path: "/select-new-course",
      query: {}
    });
  }

  private remove(scope: any, index: any): void {
    this.tableData.forEach((item1, index1) => {
      if (item1.baseId == scope.baseId) {
        this.$set(item1, "alchoose", false);
      }
    });
    this.choosesubmit.forEach((value2: any, index2: any) => {
      if (scope.baseId == value2.baseId) {
        this.choosesubmit.splice(index2, 1);
      }
    });
    this.tableDataMain.splice(index, 1);
    this.choosedCourseList = this.choosesubmit;
  }
  private handleAdddelete(scope: any): void {
    this.choosedCourseList.splice(scope, 1);
    this.tableData.forEach((item: any, index: any) => {
      if (scope == item) {
        this.$set(item, "alchoose", false);
      }
    });
  }
  private handleAdd(scope: any): void {
    this.choosedCourseList.unshift(scope);
    // let item = this.choosedCourseList.indexOf(scope)
    //     this.choosedCourseList.push(scope)
    this.tableData.forEach((item: any, index: any) => {
      console.log("进来for循环了");
      if (scope == item) {
        console.log("确实相等的");
        this.$set(item, "alchoose", true);
        // item.alchoose = true
        // console.log(this.tableData)
      }
    });
    this.$forceUpdate();
    console.log(this.choosedCourseList.length);
    // console.log(this.choosedCourseList)
  }
  private handleAddb(data: any) {
    let arr = [];
    arr.push(data);
    this.choosedCourseList = this.choosedCourseList.concat(arr);
    arr = [];
  }
  //判断是否已选
  private existedFilter(data: any, type: any) {
    var flag = false;
    const existedLength2 = this.choosedCourseList.filter(item => {
      return item.baseId == data.baseId;
    }).length;
    if (existedLength2 > 0) {
      flag = true;
    }
    return flag;
  }
  private handleAdddeleted(data: any) {
    if (this.choosedCourseList.length > 0) {
      this.choosedCourseList.forEach((item: any, index: any) => {
        if (item.baseId == data.baseId) {
          this.choosedCourseList.splice(index, 1);
        }
      });
    }
  }
  private saves() {
    //    保存
    this.dialogTableVisible = false;
    if (this.choosedCourseList.length <= 0) {
      this.$message.error("必须选择一门课程");
      return;
    }
    this.choosesubmit = this.choosedCourseList;
    this.studentForm.pageNum = 1;
    this.studentForm.pageSize = 10;
    this.onLoad();
    this.getList();
  }
  private handleClose() {
    this.dialogTableVisible = false;
    this.studentForm.courseName = "";
    this.studentForm.pageSize = 10;
    this.studentForm.pageNum = 1;
    this.choose();
  }
  private cancel() {
    this.dialogTableVisible = false;
    this.studentForm.courseName = "";
    this.studentForm.pageSize = 10;
    this.studentForm.pageNum = 1;
    this.choose();
  }
  private save() {
    if (!this.classifyName) {
      this.$message.error("请填写主题名称");
      return;
    }
    if (this.choosesubmit.length <= 0) {
      this.$message.error("必须选择一门课程");
      return;
    }
    const baseInfoList: any = [];
    this.choosesubmit.forEach((item: any, index: any) => {
      const bog = {
        relaId: item.relaId,
        baseId: item.baseId,
        sortNo: this.choosesubmit.length - index
      };
      baseInfoList.push(bog);
    });
    let params = {
      id: this.classid,
      studyTerminal: this.labelCode, // 学习终端
      classifyName: this.classifyName, // 主题名称
      baseInfoDtoList: baseInfoList
    };
    this.submitDisable = true;
    Http.post(MarkeTing.addTheme, params)
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.$message.success("修改成功");
          this.$router.push({
            path: "/operation-classification",
            query: {
              labelCode: this.labelCode
            }
          });
        } else {
          this.submitDisable = false;
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.submitDisable = false;
        this.$message.error("服务器错误");
      });
  }
  private back() {
    this.$router.go(-1);
  }
  // 向上移动
  private tabUp(value: any, index: any) {
    if (index !== 0) {
      let temIndex = 0;
      this.choosesubmit.forEach((value1: any, index1: any) => {
        if (value1.baseId == value.baseId) {
          temIndex = index1;
        }
      });
      // 对提交的的list做同样的处理
      this.choosesubmit[temIndex] = this.choosesubmit.splice(
        temIndex - 1,
        1,
        this.choosesubmit[temIndex]
      )[0];
      this.tableDataMain[index] = this.tableDataMain.splice(
        index - 1,
        1,
        this.tableDataMain[index]
      )[0];
    }
  }

  // 向下移动
  private tabDown(value: any, index: any) {
    if (index !== this.tableDataMain.length - 1) {
      let temIndex = 0;
      this.choosesubmit.forEach((value1: any, index1: any) => {
        if (value1.baseId == value.baseId) {
          temIndex = index1;
        }
      });
      // 对提交的的list做同样的处理
      this.choosesubmit[temIndex] = this.choosesubmit.splice(
        temIndex + 1,
        1,
        this.choosesubmit[temIndex]
      )[0];
      this.tableDataMain[index] = this.tableDataMain.splice(
        index + 1,
        1,
        this.tableDataMain[index]
      )[0];
    }
  }
  private onLoada() {
    const $message = this.$message;
    Http.get(MarkeTing.themeDetail, { id: this.classid })
      .then(res => {
        if (res.data.success) {
          console.log(res.data);
          this.colleges = res.data.data.baseInfoList;
          this.tableDataMain = res.data.data.baseInfoList;
          this.choosesubmit = res.data.data.baseInfoList; // 赋值
          console.log(this.tableData);
          this.total = res.data.data.total;
          this.classifyName = res.data.data.classifyName;
          this.labelCode = res.data.data.studyTerminalCode;
          // this.studyTerminalName = res.data.data.studyTerminalName;
          // this.statusany = res.data.data.status
          this.shownolist = true;
          if (!this.tableDataMain || this.tableDataMain.length === 0) {
            this.shownolist = false;
          }
          // this.colleges = this.choosedCourseList
          this.getList();
        } else {
          this.shownolist = false;
          $message.error(res.data.errorMsg);
        }

        this.loading = false;
      })
      .catch(err => {
        this.shownolist = false;
        $message.error("品牌列表获取失败，请稍后重试");
        this.loading = false;
      });
  }
  private clearList() {
    //清空选择的课程
    //   this.choosedCourseList = []
    console.log(this.choosedCourseList);
  }
}
