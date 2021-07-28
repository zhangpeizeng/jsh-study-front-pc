import { Component, Vue, Prop } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component({
  components: {}
})
export default class groupsPopup extends Vue {
  @Prop({
    type: Number || String || undefined,
    required: true
  })
  private saveType!: Number; // 编辑标识
  @Prop({
    type: String || Number || undefined,
    required: false
  })
  private id!: String;

  labelCode: any = ""; // 所属学习终端

  options: any = "";

  detailObj: any = "";

  private groupingName: any = "";
  private microList: any = []; // 小微
  private departmentList: any = []; // 部门
  private micro: any = []; // 小微
  private department: any = []; // 部门
  private organizationIdList: any = [];

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
  private submit() {
    if (!this.groupingName) {
      this.$message.error("请填写分组名称");
      return;
    }
    if (!this.labelCode) {
      this.$message.error("请选择学习终端");
      return;
    }
    if (this.department.length == 0) {
      this.$message.error("请选择部门");
      return;
    }
    if (this.micro.length == 0) {
      this.$message.error("请选择小微");
      return;
    }
    // 组装所属组织list 1部门 2小微
    this.organizationIdList = [];
    this.department.forEach((value: any) => {
      this.organizationIdList.push(value);
    });
    this.micro.forEach((value: any) => {
      this.organizationIdList.push(value);
    });
    let params = {
      id: null,
      groupingName: this.groupingName,
      studyTerminal: this.labelCode,
      organizationIdList: this.organizationIdList
    };
    if (this.saveType === 1) {
      params.id = this.detailObj.id;
    }
    Http.post(MarkeTing.groupInsert, params)
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.$emit("confirm");
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }
  private getGroupDetail() {
    Http.get(MarkeTing.getGroupDetail, { id: this.id })
      .then(res => {
        const { data } = res;

        if (data.success && data.data) {
          this.detailObj = data.data;
          this.groupingName = data.data.groupingName; // 分组名
          this.labelCode = data.data.studyTerminal; // 终端
          if (data.data.organization) {
            // 部门组织返显
            data.data.organization.departmentList.forEach((value: any) => {
              this.department.push(value.organizationId);
            });
            // 小微组织返显
            data.data.organization.centerList.forEach((value: any) => {
              this.micro.push(value.organizationId);
            });
          }
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
  }

  private created(): void {
    Http.post(MarkeTing.SearchSysDict, { typeCode: "study_terminal" })
      .then(res => {
        const { data } = res;

        if (data.success) {
          this.options = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
    Http.get(MarkeTing.getOrgCodeList, { type: 1 })
      .then(res => {
        const { data } = res;

        if (data.success && data.data) {
          this.departmentList = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
    Http.get(MarkeTing.getOrgCodeList, { type: 2 })
      .then(res => {
        const { data } = res;

        if (data.success && data.data) {
          this.microList = data.data;
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {
        this.$message.error("服务器错误");
      });
    if (this.saveType === 1) {
      this.getGroupDetail();
    }
  }
}
