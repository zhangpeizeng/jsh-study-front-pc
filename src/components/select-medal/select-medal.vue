<template>
  <!--选择勋章的弹出框-->
  <el-dialog
    title="选择勋章"
    :close-on-click-modal="false"
    :visible.sync="dialogSetting"
    width="60%"
  >
    <div class="list">
      <div
        v-for="(item, index) in menuList"
        :key="index"
        class="item"
        :class="{ active: medalList[0].medalName === item.medalName }"
      >
        <div class="title">
          <div class="name">{{ item.medalName }}</div>
          <div
            @click="clickLi(item, index)"
            v-if="medalList[0].medalName !== item.medalName"
            class="chose"
          >
            选择
          </div>
          <div v-if="medalList[0].medalName === item.medalName" class="chose2">
            已选择
          </div>
        </div>
        <div class="content">
          <div
            v-for="(item2, index2) in item.medalTypeList"
            :key="index2"
            class="content-team"
          >
            <div class="pic">
              <img :src="item2.medalTypeUrl" alt="" />
            </div>
            <div class="des">{{ item2.medalTypeName }}</div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <div style="text-align: center">
        <el-button class="cancle" @click="dialogSetting = false"
          >取 消</el-button
        >
        <el-button class="primary" @click="confirm()">确 定</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script src="./select-medal.ts"></script>

<style scoped lang="scss">
.list {
  height: 350px;
  overflow: auto;
  .active {
    background-color: #f5f7fa;
  }
  .item {
    border: 1px solid #f5f7fa;
    margin-right: 10px;
    margin-bottom: 30px;
    .title {
      display: flex;
      justify-content: space-between;
      padding: 17px 10px 17px 25px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(96, 98, 102, 1);
      .name {
      }
      .chose {
        cursor: pointer;
        width: 58px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: rgba(64, 158, 255, 1);
        border-radius: 4px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }
      .chose2 {
        cursor: pointer;
        width: 58px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border-radius: 4px;
        border: 1px solid rgba(220, 223, 230, 1);
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #606266;
      }
    }
  }
  .content {
    display: flex;
    .content-team {
      padding-left: 100px;
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: center;
      .pic {
        img {
          width: 50px;
          height: 50px;
          border-radius: 50px;
        }
      }
      .des {
        padding-top: 11px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(144, 147, 153, 1);
      }
    }
  }
}
</style>
<style scoped>
.el-button {
  padding: 6px 10px;
  border-radius: 4px;
}
.cancle {
}
.primary {
  background: rgba(64, 158, 255, 1);
  border-radius: 4px;
  color: white;
}
</style>
