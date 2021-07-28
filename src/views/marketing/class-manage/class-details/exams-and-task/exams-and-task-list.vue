<template>
  <div class="exams-and-task-list">
    <el-table
      v-loading="tableLoading"
      class="exams-and-task-table"
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#fff' }"
    >
      <!-- 缺省 -->
      <template slot="empty">
        <div class="exams-and-task_empty">
          <img
            class="exams-and-task_empty-pic"
            src="@/assets/images/table_default.png"
            alt=""
          />
          <span class="exams-and-task_empty-text">暂无数据</span>
        </div>
      </template>
      <el-table-column type="index" label="序号" width="50px">
      </el-table-column>
      <!-- 考试tab显示 -->
      <el-table-column
        :label="isExamsTab ? '考试主题' : '作业主题'"
        :show-overflow-tooltip="true"
        width="144"
      >
        <template slot-scope="scope">
          {{ isExamsTab ? scope.row.examTheme : scope.row.homeworkTheme }}
        </template>
      </el-table-column>
      <el-table-column
        :label="isExamsTab ? '考试时间' : '限制提交时间'"
        width="206"
      >
        <template slot-scope="scope">
          {{
            getTimeInterval(
              isExamsTab
                ? scope.row.examStartTime
                : scope.row.homeworkStartTime,
              isExamsTab ? scope.row.examEndTime : scope.row.homeworkEndTime
            )
          }}
        </template>
      </el-table-column>
      <el-table-column :label="isExamsTab ? '达标分' : '合格分'" width="62">
        <template slot-scope="scope">
          {{
            isExamsTab ? scope.row.totalvalueLimit : scope.row.qualifiedScore
          }}
        </template>
      </el-table-column>
      <el-table-column :label="isExamsTab ? '考试人数' : '提交数'" width="76">
        <template slot-scope="scope">
          {{ isExamsTab ? scope.row.examCount : scope.row.submitCount }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="54">
        <template slot-scope="scope">
          <div class="view-details" @click="handleEdit(scope.row.id)">详情</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" src="./exams-and-task-list.ts"></script>

<style lang="scss" scoped>
.exams-and-task-list {
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .exams-and-task_empty {
    .exams-and-task_empty-pic {
      width: 40px;
    }
    .exams-and-task_empty-text {
      margin-left: 10px;
      font-size: 14px;
      color: #969799;
      line-height: 20px;
    }
  }
  .view-details {
    font-size: 14px;
    font-weight: 400;
    color: #1989fa;
    line-height: 14px;
    cursor: pointer;
  }
}
</style>
