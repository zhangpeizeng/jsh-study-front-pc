<template>
  <div class="vh-100 bg-fff w-100">
    <div
      style="padding-top:calc( 40vh - 170px);text-align: center;width: 100%;"
    >
      <img
        src="../../assets/images/dongjie.png"
        style="width: 278px;height:290px;display:inline-block;vertical-align: middle;"
      />
    </div>
    <div style="width: 100%;text-align: center;">
      您的讲师权限被冻结，如有问题
      <el-tooltip class="item" effect="dark" placement="bottom">
        <div slot="content">
          <div
            v-for="(item, index) in phoneList"
            :key="index"
            style="padding-top: 5px"
          >
            <span>{{ item.studyTerminalName }}</span
            >:
            <span>{{ item.phone }}</span>
          </div>
          <!--          <div style="padding-top: 5px">直销员端:32r353453</div>-->
          <!--          <div style="padding-top: 5px">售后端:32r353453</div>-->
        </div>
        <span style="color: #1890ff;cursor: pointer">请联系</span>
      </el-tooltip>
      <!--      <a href="tel:400-833-6666" style="color: #1989FA;">400-833-6666</a>-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Http, { MarkeTing } from "@/request";

@Component
export default class UserFreeze extends Vue {
  phoneList: any = [];
  private created() {
    this.needPhone();
  }

  /**
   * 获取运营电话
   */
  needPhone() {
    Http.get(MarkeTing.listStudyTerminalPhone, { studyTerminal: "" })
      .then(res => {
        console.log(res);
        if (res.data.success) {
          this.phoneList = res.data.data;
        }
      })
      .catch(err => {});
  }
}
</script>

<style lang="scss" scoped></style>
