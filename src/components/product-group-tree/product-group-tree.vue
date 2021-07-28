<template>
  <div class="product-group-tree" style="position: relative">
    <el-popover placement="bottom-start" width="250" trigger="click">
      <div v-scroll style="height: 230px;position: relative">
        <el-tree
          ref="tree"
          :props="{ children: 'children', label: 'name' }"
          :data="productGroupList"
          node-key="id"
          show-checkbox
          @check-change="handleCheckChange"
        >
        </el-tree>
      </div>
      <el-input
        v-model="productGroupNames"
        placeholder="请选择"
        :readonly="true"
        slot="reference"
      >
        <i slot="suffix" class="el-input__icon">
          <i class="el-icon-search color-blue" />
        </i>
      </el-input>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component
export default class ProductGroupTree extends Vue {
  @Prop({
    type: String,
    required: true,
    default: "1"
  })
  private labelCode!: String;

  private productGroupNames: string = "";
  private imgIcon: string = "../../assets/images/bluegou.png";
  private productGroupList: any[] = [];
  private showFlag: boolean = false;

  private showTree() {
    this.showFlag = !this.showFlag;
  }

  private showListDeal(list: any) {
    const checkNodeNameList: any[] = [];
    const checkNodeCodeList: any[] = [];
    list.forEach((item: any) => {
      checkNodeNameList.push(item.classifyName);
      checkNodeCodeList.push(item.id);
      item.name = item.classifyName;
    });
    this.productGroupNames = checkNodeNameList.join(",");
    // dom渲染结束再进行渲染节点
    this.$nextTick(() => {
      //@ts-ignore
      this.$refs["tree"].setCheckedNodes(list);
    });
  }
  private getProductGroupList(labelCode: any, showlist: any) {
    Http.get(MarkeTing.getTreeNode, { studyTerminalCode: labelCode })
      .then(res => {
        const { data } = res;
        if (data.success) {
          const list = data.data;
          list.forEach((item: any) => {
            item.name = item.classifyName;
            item.children.forEach((item1: any) => {
              item1.name = item1.classifyName;
              item1.children.forEach((item2: any) => {
                item2.name = item2.classifyName;
              });
            });
          });
          this.productGroupList = list;
          if (showlist) {
            this.showListDeal(showlist);
          }
        } else {
          this.$message.error(data.errorMsg);
        }
      })
      .catch(err => {});
  }

  // 清空回显
  private clearName() {
    this.productGroupNames = "";
  }

  private handleCheckChange(data: any) {
    //@ts-ignore
    const checkNodeList = this.$refs["tree"].getCheckedNodes(true);
    const checkNodeNameList: any[] = [];
    const checkNodeCodeList: any[] = [];
    checkNodeList.forEach((item: any) => {
      checkNodeNameList.push(item.name);
      checkNodeCodeList.push(item.id);
    });
    this.productGroupNames = checkNodeNameList.join(",");
    this.$emit("check", checkNodeCodeList);
  }

  private created() {
    this.$emit("instance", this);
  }
}
</script>

<style lang="scss" scoped>
.product-group-tree {
  .tree-container {
    width: 250px;
    height: 250px;
    position: absolute;
    top: 38px;
    z-index: 222;
    border: 1px solid rgb(220, 223, 230);
    border-radius: 4px;
    background: #fff;
  }
}
.imgIcon {
  width: 14px;
  height: 14px;
}
.color-blue {
  margin-right: 10px;
  color: #409eff;
}
</style>
