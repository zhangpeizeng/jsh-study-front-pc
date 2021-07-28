<template>
  <div class="vh-100 bg-fff w-100">
    <div
      style="padding-top:calc( 40vh - 170px);text-align: center;width: 100%;"
    >
      <img
        src="../../assets/images/nologin.png"
        style="width: 220px;display: inline-block;vertical-align: middle;"
      />
    </div>
    <div style="width: 100%;text-align: center;">
      登录已超时,请重新登录后进入
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class NoLogin extends Vue {
  private created() {}
}
</script>

<style lang="scss" scoped></style>
