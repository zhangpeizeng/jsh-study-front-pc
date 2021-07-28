<template>
  <div class="brand-list">
    <el-dialog
      width="60%"
      title="调整"
      :before-close="handleCloseTime"
      :close-on-click-modal="false"
      :visible.sync="dialogTableVisible"
    >
      <el-form :inline="true" label-width="84px" size="mini">
        <el-row type="flex" align="middle" :gutter="10" class="el-row">
          <el-col :span="2" class="text-right">
            <span>直播时间</span>
          </el-col>
          <el-col :span="7.5" class="text-content">
            <el-date-picker
              v-model="liveStartTime1"
              type="datetime"
              placeholder="直播开始时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
            >
            </el-date-picker>
            <span style="margin: 0 10px;">至</span>
            <el-date-picker
              v-model="liveEndTime1"
              type="datetime"
              placeholder="直播结束时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="5" class="text-content word-break">
            <img src="../../../assets/images/icon-help.png" class="icon-tip" />
            <el-tooltip effect="light" placement="bottom">
              <div slot="content">
                <div class="prompt">
                  课程直播的起止时间
                </div>
              </div>
              <span class="prompt">
                课程直播的起止时间
              </span>
            </el-tooltip>
          </el-col>
        </el-row>
        <div style="text-align: center;margin-top: 20px">
          <el-button @click="cancelTime" size="small">取消</el-button>
          <el-button @click="confirmTime" size="small" type="primary"
            >确认</el-button
          >
        </div>
      </el-form>
    </el-dialog>
    <div class="header-form">
      <el-form :inline="true" label-width="84px" size="mini">
        <el-form-item label="课程">
          <el-input
            v-model="courseName"
            clearable
            placeholder="请输入课程名称"
            maxlength="30"
            style="width: 178px;"
            @input="courseName = courseName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程类型">
          <el-select v-model="courseTypeList" multiple placeholder="请选择">
            <el-option
              v-for="item in chosetypelist"
              :key="item.labelCode"
              :label="item.labelName"
              :value="item.labelCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="讲师">
          <el-select
            v-model="lecturerorname"
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="请输入讲师姓名/员工号"
            :remote-method="remoteMethodLec"
            :loading="lecturerLoading"
          >
            <el-option
              v-for="item in lecturerForm"
              :key="item.accountId"
              :label="item.accountName + '(' + item.huiHuiNumber + ')'"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
          <el-button type="" @click="cleanto" plain style="margin-left: 10px;"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="84px" size="mini">
        <el-form-item label="学习终端">
          <el-select v-model="studyTerminal" placeholder="请选择">
            <el-option
              v-for="item in studyTerminalNameList"
              :key="item.terminalCode"
              :label="item.terminalName"
              :value="item.terminalCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="直播时间" class="date-item">
          <el-date-picker
            v-model="liveStartTime"
            type="date"
            value-format="timestamp"
            placeholder="开始时间"
          >
          </el-date-picker>
          <span style="margin: 0 10px;">至</span>
          <el-date-picker
            v-model="liveEndTime"
            type="date"
            value-format="timestamp"
            placeholder="结束时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="body" v-if="shownolist">
      <!--            <div style="">-->
      <!--                <el-button-->
      <!--                        type="primary"-->
      <!--                        size="medium"-->
      <!--                        icon="el-icon-circle-plus-outline"-->
      <!--                        @click="gotoadd"-->
      <!--                >新建课程</el-button-->
      <!--                >-->
      <!--            </div>-->
      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column type="index" label="序号" width="100px">
        </el-table-column>
        <el-table-column label="课程" width="280px">
          <template slot-scope="scope">
            <img
              class="brand-logo"
              :src="scope.row.courseImg"
              v-if="scope.row.courseImg"
            />
            <img
              class="brand-logo"
              src="../../../assets/images/backlogo.png"
              v-if="!scope.row.courseImg"
            />
            <div class="class-img" v-if="scope.row.courseType == '1'">
              录播/文档课
            </div>
            <div class="class-img" v-if="scope.row.courseType == '2'">
              直播课
            </div>
            <div class="class-img" v-if="scope.row.courseType == '3'">
              研讨课
            </div>
            <div class="class-img" v-if="scope.row.courseType == '4'">
              系列课
            </div>
            <div
              class="class-text"
              v-if="
                scope.row.courseType === '2' || scope.row.courseType === '3'
              "
            >
              {{ scope.row.liveStartTime | date("yyyy-MM-dd hh:mm") }}
            </div>
            <div class="brand-text">
              <span>{{ scope.row.courseName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="studyTerminal" label="学习终端">
          <template slot-scope="scope">
            <span v-if="scope.row.studyTerminal != null">{{
              scope.row.studyTerminal
            }}</span>
            <span v-if="scope.row.studyTerminal == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column prop="nameEn" label="讲师">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.lecturerName != null || scope.row.employeeId != null
              "
            >
              {{ scope.row.lecturerName }}（{{ scope.row.employeeId }}）
            </span>
            <span
              v-if="
                scope.row.lecturerName == null && scope.row.employeeId == null
              "
            >
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="nameEn" label="直播时间">
          <template slot-scope="scope">
            <span v-if="scope.row.liveStartTime || scope.row.liveEndTime">
              {{ scope.row.liveStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                scope.row.liveEndTime | date("yyyy-MM-dd hh:mm")
              }}
              <span @click="editTime(scope.row)" class="editLive">
                <i class="el-icon-edit"></i>
              </span>
            </span>
            <span v-if="!scope.row.liveStartTime && !scope.row.liveEndTime">
              -
            </span>
          </template>
        </el-table-column>
        <!--                <el-table-column-->
        <!--                        prop="categoryName"-->
        <!--                        width="300px"-->
        <!--                        align="center"-->
        <!--                        label="状态"-->
        <!--                >-->
        <!--                    <template slot-scope="scope">-->
        <!--                        <span v-if="scope.row.status === 1">草稿</span>-->
        <!--                        <span v-if="scope.row.status === 2">上架</span>-->
        <!--                        <span v-if="scope.row.status === 3">下架</span>-->
        <!--                    </template>-->
        <!--                </el-table-column>-->
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="gotodetail(scope.row)" plain>
              详情
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
    <div class="body" v-if="!shownolist">
      <div
        style="width: 100%;min-height: 500px;padding-top: 182px;text-align: center"
      >
        <img
          src="../../../assets/images/nolist.png"
          style="width: 222px;display: inline-block;"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./course-schedule.ts"></script>

<style lang="scss" scoped>
.editLive {
  color: #1989fa;
}
.brand-list {
  padding: 24px 20px 20px 20px;

  .header-form {
    padding-bottom: 6px;
    border-bottom: 1px solid #dcdfe6;

    .el-button {
      margin-left: 40px;
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  .body {
    padding-top: 20px;
    position: relative;
    &::v-deep .table-header-cell .cell {
      color: #909399;
    }

    .brand-logo {
      width: 100px;
      height: 56px;
      object-position: center;
      border-radius: 2px;
      object-fit: cover;
    }
    .brand-text {
      width: 100%;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .class-img {
      width: 68px;
      height: 16px;
      line-height: 16px;
      background-image: linear-gradient(90deg, #74cdff, #409eff);
      border-radius: 2px 0px 2px 0px;
      position: absolute;
      top: 12px;
      left: 10px;
      color: white;
      font-size: 10px;
      text-align: center;
    }
    .class-text {
      width: 100px;
      height: 16px;
      line-height: 16px;
      background-color: white;
      border-radius: 0px 2px 0px 2px;
      position: absolute;
      top: 52px;
      left: 10px;
      color: #f56c6c;
      font-size: 10px;
      opacity: 0.6;
      object-position: center;
      object-fit: cover;
    }

    .el-pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
  .date-item {
    .el-input__inner {
      width: 130px !important;
    }
    .el-date-editor.el-input {
      width: 130px !important;
    }
  }
}
.content-span {
  color: #909399;
}

.prompt {
  font-size: 12px;
  color: #909399;
}

.icon-tip {
  width: 14px;
  height: 14px;
}
</style>
