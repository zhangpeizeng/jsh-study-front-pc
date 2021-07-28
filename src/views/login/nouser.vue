<template>
  <div class="vh-100 bg-fff w-100">
    <div
      style="padding-top:calc( 40vh - 170px);text-align: center;width: 100%;"
    >
      <img
        src="../../assets/images/uhome-site-apply-bg.png"
        style="width: 400px;display: inline-block;vertical-align: middle;"
      />
    </div>
    <div style="width: 100%;text-align: center;">
      您还不是讲师，无法访问营销学院。如果需要开通讲师权限，请
      <a style="color: #1989FA;" @click="gotoApply">点击申请</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NoUser extends Vue {
  private applyAccountId: any = "";
  private created() {
    console.log(localStorage.getItem("applyAccountId"));
    this.applyAccountId = localStorage.getItem("applyAccountId");
  }
  private gotoApply() {
    // this.$router.push({
    //   path: "/lecturer-apply",
    //   query: {
    //     applyAccountId: this.applyAccountId
    //   }
    // });
    let newpage = this.$router.resolve({
      path: "/lecturer-apply",
      query: {
        applyAccountId: this.applyAccountId
      }
    });
    window.open(newpage.href, "_blank");
  }
}
</script>

<style lang="scss" scoped></style>
