<template>
  <div class="timeline">
    <el-timeline :reverse="false">
      <el-timeline-item
        v-for="(activity, index) in applyList"
        :key="index"
        :timestamp="activity.createTime"
        :color="activity.status == 1 ? '#409EFF' : ''"
      >
        <div class="timeline-name">
          <div class="name-span">{{ activity.submiterName }}</div>
          <div class="name-status status-success" v-if="activity.status == 1">
            审核通过
          </div>
          <div class="name-status status-error" v-if="activity.status == 2">
            已驳回
          </div>
          <div class="name-status status-apply" v-if="activity.status == 3">
            提交申请
          </div>
          <div class="name-status status-success" v-if="activity.status == 4">
            授权
          </div>
        </div>
        <div class="timeline-content d-flex word-break">
          <div>说明：</div>
          <el-tooltip placement="bottom">
            <div
              slot="content"
              v-if="activity.auditDesc"
              :class="{ prompt: activity.auditDesc.length > 25 }"
            >
              <div class="word-break">
                {{ activity.auditDesc }}
              </div>
            </div>
            <div class="word-break" v-if="activity.auditDesc">
              {{ activity.auditDesc }}
            </div>
            <div v-if="!activity.auditDesc">-</div>
          </el-tooltip>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script lang="ts" src="./apply-timeline.ts"></script>

<style lang="scss" scoped>
.prompt {
  width: 300px;
}
.timeline {
  padding: 24px 30px;
  height: 180px;
  overflow-y: scroll;
  .timeline-name {
    display: flex;
    justify-self: start;
    align-items: center;
    .name-span {
      margin-right: 14px;
      color: #303133;
    }
    .name-status {
      padding: 1px 4px;
      display: flex;
      justify-self: start;
      align-items: center;
      font-size: 12px;
    }
    .status-success {
      color: #67c23a;
      border: 1px solid #67c23a;
      background: #f0ffe9;
    }
    .status-error {
      color: #f56c6c;
      border: 1px solid #f56c6c;
      background: #fef0f0;
    }
    .status-apply {
      color: #409eff;
      border: 1px solid #409eff;
      background: #ecf5ff;
    }
  }
  .timeline-content {
    margin-top: 7px;
    color: #909399;
    font-size: 12px;
  }
  .word-break {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
