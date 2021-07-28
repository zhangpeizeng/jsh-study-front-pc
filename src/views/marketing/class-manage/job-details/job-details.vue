<template>
  <div class="brand-list">
    <el-tabs
      v-model="tabsName"
      type="card"
      @tab-click="handleClick"
      class="classify-tab"
    >
      <el-tab-pane label="作业信息" name="1"></el-tab-pane>
      <el-tab-pane label="作业统计" name="2"></el-tab-pane>
    </el-tabs>
    <div v-if="tabsName == '1'" style="width: 60%">
      <div class="d-flex align-items-center justify-content-start mb-15">
        <div class="information-gray">作业主题：{{ detailObj.taskTheme }}</div>
      </div>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="3" class="text-right">
          <span class="text-title">作业要求:</span>
        </el-col>
        <el-col :span="21" class="text-content">
          <span v-html="detailObj.taskDescription" class="content-span"></span>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="3" class="text-right">
          <span class="text-title">合格分:</span>
        </el-col>
        <el-col :span="21" class="text-content">
          <span class="content-span" style="display: inline-block">
            {{ detailObj.qualifiedScore }}分
          </span>
          <div
            style="display: inline-block;color: #F56C6C;width: 90%;margin-left: 10px"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="100分制,作业批改后,当评分大于等于此分数,系统同自动判定合格,小于则判定为不合格"
              placement="top"
            >
              <i class="el-icon-warning-outline"></i>
              <span
                class="font-12 text-truncate"
                style="display: inline-block;width: 100%;vertical-align: text-top;"
              >
                100分制,作业批改后,当评分大于等于此分数,系统同自动判定合格,小于则判定为不合格
              </span>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="3" class="text-right">
          <span class="text-title">提交时间:</span>
        </el-col>
        <el-col :span="21" class="text-content">
          <span
            class="content-span"
            v-if="detailObj.taskStartTime && detailObj.taskEndTime"
          >
            {{ detailObj.taskStartTime | date("yyyy-MM-dd hh:mm:ss") }} 至
            {{ detailObj.taskEndTime | date("yyyy-MM-dd hh:mm:ss") }}
          </span>
          <span class="content-span" v-else>暂未设置考试时间 </span>

          <div
            style="display: inline-block;color: #909399;width: 40%;margin-left: 10px"
          >
            <el-tooltip
              class="item"
              effect="dark"
              content="要求学员课程作业提交的起止时间，提交开始时间前和提交结束时间后学员不可进行作业提交"
              placement="top"
            >
              <i class="el-icon-warning-outline"></i>
              <span
                class="font-12 text-truncate"
                style="display: inline-block;width: 100%;vertical-align: text-top;"
              >
                要求学员课程作业提交的起止时间，提交开始时间前和提交结束时间后学员不可进行作业提交
              </span>
            </el-tooltip>
          </div>
        </el-col>
      </el-row>

      <el-row type="flex" align="middle" :gutter="10" class="el-row">
        <el-col :span="3" class="text-right">
          <span class="text-title">提交形式:</span>
        </el-col>
        <el-col :span="21" class="text-content">
          <span
            class="content-span mr-10"
            v-for="(item, index) in detailObj.submitTypeDtos"
            :key="index"
          >
            <span v-if="item.submitType === 0">
              图片({{ item.requiredStatus === 0 ? "非必填" : "必填" }})
            </span>
            <span v-if="item.submitType === 1">
              视频({{ item.requiredStatus === 0 ? "非必填" : "必填" }})
            </span>
            <span v-if="item.submitType === 2">
              音频({{ item.requiredStatus === 0 ? "非必填" : "必填" }})
            </span>
            <span v-if="item.submitType === 3">
              文档({{ item.requiredStatus === 0 ? "非必填" : "必填" }})
            </span>
            <span v-if="item.submitType === 4">
              内容描述({{ item.requiredStatus === 0 ? "非必填" : "必填" }})
            </span>
          </span>
        </el-col>
      </el-row>
    </div>
    <div v-if="tabsName == '2'">
      <div class="d-flex align-items-center justify-content-start mb-15">
        <div class="information-gray">作业主题：{{ detailObj.taskTheme }}</div>
      </div>
      <div
        style="color: #909399"
        class="mt-10 fs-14"
        v-if="detailObj.taskStartTime && detailObj.taskEndTime"
      >
        提交时间: {{ detailObj.taskStartTime | date("yyyy-MM-dd hh:mm:ss") }} 至
        {{ detailObj.taskEndTime | date("yyyy-MM-dd hh:mm:ss") }}
      </div>
      <div v-else style="color: #909399" class="mt-10 fs-14">
        提交时间: 暂未设置提交时间
      </div>
      <div class="statistical">
        <div class="statistical-item">
          <img src="../../../../assets/images/job-yixue.png" />
          <div class="item-span">
            <div class="number">{{ workInfo.submitCount }}</div>
            <div class="name">已提交作业数</div>
          </div>
        </div>
        <div class="statistical-item">
          <img src="../../../../assets/images/job-pigai.png" />
          <div class="item-span">
            <div class="number">{{ workInfo.correctCount }}</div>
            <div class="name">未批改作业数</div>
          </div>
        </div>
      </div>
      <div>
        <el-tabs v-model="tabType" @tab-click="handleClick1">
          <el-tab-pane label="已提交" name="1">
            <classJobContent
              :id="id"
              :studyTerminal="studyTerminalCode"
            ></classJobContent>
          </el-tab-pane>
          <el-tab-pane label="作业批改情况" name="2">
            <correction :id="id" :terminal="studyTerminalCode"> </correction>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="footer-bottom-container">
      <template>
        <el-button size="mini" @click="close">关闭</el-button>
      </template>
    </div>
  </div>
</template>
<script lang="ts" src="./job-details.ts"></script>

<style lang="scss">
.classify-tab {
  .el-tabs__item {
    width: 110px;
    text-align: center;
  }
}
</style>

<style lang="scss" scoped>
.statistical {
  padding: 20px 0px 20px 0px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  .statistical-item {
    position: relative;
    margin-right: 17px;
    width: 135px;
    height: 120px;
    display: flex;
    margin-bottom: 10px;
    justify-content: center;
    align-items: center;
    img {
      width: 135px;
      height: 120px;
    }
    .item-span {
      position: absolute;
      text-align: center;
      .number {
        color: #000000;
        font-size: 28px;
      }
      .name {
        color: #606266;
        font-size: 16px;
      }
    }
  }
}
.information-gray {
  background: #f2f2f2;
  font-size: 12px;
  color: #606266;
  padding: 5px 14px 4px 14px;
}
.information-blue {
  padding: 4px 7px 3px 7px;
  font-size: 12px;
  color: #409eff;
  background: #ecf5ff;
  margin-left: 10px;
}
.brand-list {
  padding: 24px 20px 20px 20px;
  min-height: 650px;
  .classify-tab {
    padding-bottom: 5px;
  }
  .button-box {
    display: flex;
    padding-bottom: 16px;
  }
  .el-row {
    margin-bottom: 15px;
    .text-right {
      text-align: right;
      .text-title {
        color: #909399;
      }
    }
    .text-content {
      .content-span {
        color: #909399;
      }
      .color-red {
        color: #f56c6c;
      }
      .font-12 {
        font-size: 12px;
      }
    }
    .word-break {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .require-icon {
      font-size: 14px;
      color: #ff0000;
    }
    .content-status {
      margin-left: 7px;
      padding: 4px 7px;
      line-height: 20px;
      background: #ecf5ff;
      color: #409eff;
      font-size: 12px;
      border: 1px solid #409eff;
    }
  }
  .brand-text {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .pagination-container {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
