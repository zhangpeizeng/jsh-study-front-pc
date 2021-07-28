<template>
  <div class="brand-list">
    <div class="body">
      <div class="mb-15">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-circle-plus-outline"
          @click="gotoadd()"
          >添加课程</el-button
        >
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column label="序号" width="100px">
          <template slot-scope="scope">
            <div class="table-index">
              <div>
                {{ scope.$index + 1 }}
              </div>
              <div class="table-icon">
                <i
                  class="el-icon-arrow-up cursor"
                  @click="tabUp(scope.row)"
                ></i>
                <i
                  class="el-icon-arrow-down cursor"
                  @click="tabDown(scope.row)"
                ></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="课程名称"
          min-width="250px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.courseName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="授课讲师" min-width="250px">
          <template slot-scope="scope">
            <span>{{ scope.row.lecturerName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="课程状态" min-width="150px">
          <template slot-scope="scope">
            <span v-if="scope.row.deleteFlg === 1">已删除</span>
            <span v-else-if="scope.row.status === 1">草稿 </span>
            <span v-else-if="scope.row.status === 2">上架 </span>
            <span v-else-if="scope.row.status === 3">下架</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="上课时间" min-width="250px">
          <template slot-scope="scope">
            <span
              >{{ scope.row.studyStartTime | date("yyyy-MM-dd hh:mm") }}-{{
                scope.row.studyEndTime | date("yyyy-MM-dd hh:mm")
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="300px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.deleteFlg === 0"
              size="mini"
              @click="gotoDetail(scope.row)"
              plain
            >
              详情
            </el-button>
            <el-button
              v-if="scope.row.deleteFlg === 0"
              size="mini"
              @click="gotoupdate(scope.row)"
              plain
            >
              修改
            </el-button>
            <el-button size="mini" @click="gotoDelete(scope.row)" plain>
              删除
            </el-button>
            <el-button
              size="mini"
              v-if="
                ((scope.row.courseType === '2' &&
                  scope.row.courseLiveType === 'PC') ||
                  scope.row.courseType === '3') &&
                  scope.row.deleteFlg === 0
              "
              @click="goInvite(scope.row)"
              plain
            >
              邀请
            </el-button>
            <el-button
              size="mini"
              @click="appView(scope.row)"
              v-if="
                scope.row.courseType === '2' &&
                  scope.row.courseLiveType === 'APP' &&
                  scope.row.deleteFlg === 0
              "
            >
              APP直播
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="onpageNumNumChange"
        @size-change="onpageNumSizeChange"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <div class="footer-bottom-container">
      <template>
        <el-button size="mini" @click="$router.go(-1)">返回</el-button>
      </template>
    </div>
    <el-drawer
      :title="drawerName"
      :visible.sync="drawerCor"
      direction="rtl"
      size="45%"
      :close-on-press-escape="false"
      :show-close="true"
      custom-class="public-drawer"
      :before-close="handleClose"
      :wrapperClosable="false"
    >
      <class-schedule
        v-if="drawerCor"
        :classStartTime="classStartTime"
        :classEndTime="classEndTime"
        :classRelaId="courseRelaId"
        :classId="classId"
        @close="drawerCloseCor"
        @confirm="drawerConfirm"
      >
      </class-schedule>
    </el-drawer>
    <el-dialog
      title="上课邀请"
      :visible.sync="dialogshow"
      width="60%"
      style="min-width: 900px;"
      center
    >
      <ShopDialogList :tableData="tableDataitem"> </ShopDialogList>
      <span slot="footer">
        <el-button @click="dialogshow = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="APP直播"
      width="836px"
      custom-class="app-dialog"
      :close-on-click-modal="false"
      :visible.sync="appDialog"
    >
      <app-live-popup
        v-if="appDialog"
        :classid="viewId"
        @cancel="appDialog = false"
      >
      </app-live-popup>
    </el-dialog>
  </div>
</template>
<script lang="ts" src="./timetable-setting.ts"></script>
<style lang="scss" scoped>
.brand-list {
  padding: 24px 20px 20px 20px;
}
.body {
  position: relative;
  &::v-deep .table-header-cell .cell {
    color: #909399;
  }
  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
}
.ml-8 {
  margin-left: 8px;
}
.el-icon-caret-top:hover {
  color: #0486fe;
}
.el-icon-caret-bottom:hover {
  color: #0486fe;
}
.cursor {
  cursor: pointer;
}
.table-index {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .table-icon {
    margin-left: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .el-icon-arrow-up:hover {
    color: #0486fe;
  }
  .el-icon-arrow-down:hover {
    color: #0486fe;
  }
  .cursor {
    cursor: pointer;
  }
}
</style>
