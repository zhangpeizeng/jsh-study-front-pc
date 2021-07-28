<template>
  <div class="brand-list">
    <el-tabs
      v-model="studyTerminalName"
      type="card"
      @tab-click="handleClick"
      class="classify-tab"
    >
      <el-tab-pane
        v-for="(item, index) in studyTerminalNameList"
        :key="index"
        :label="item.labelName"
        :name="item.labelCode"
      ></el-tab-pane>
    </el-tabs>
    <div class="header-form">
      <el-form :inline="true" label-width="100px" size="mini">
        <el-form-item v-if="studyTerminalName === '1'" label="中心">
          <el-select
            v-model="centerName"
            clearable
            multiple
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择"
            style="width: 240px;"
            @change="centerChange"
          >
            <el-option
              v-if="gmList.tagList.length > 0"
              label="全选"
              value="all"
            ></el-option>
            <el-option
              v-for="item in gmList.tagList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            studyTerminalName === '2' ||
              studyTerminalName === '3' ||
              studyTerminalName === '4'
          "
          label="公司"
        >
          <el-select
            v-model="centerName"
            clearable
            multiple
            filterable
            collapse-tags
            size="mini"
            placeholder="请选择"
            style="width: 240px;"
            @change="centerChange"
          >
            <el-option
              v-if="gmList.tagList.length > 0"
              label="全选"
              value="all"
            ></el-option>
            <el-option
              v-for="item in gmList.tagList"
              :key="item.tagCodeCollege"
              :label="item.tagName"
              :value="item.tagCodeCollege"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程">
          <el-input
            v-model="courseName"
            clearable
            placeholder="请输入"
            maxlength="40"
            style="width: 240px;"
            @input="courseName = courseName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="学员" v-show="studyTerminalName === '1'">
          <el-select
            v-model="studentorname"
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="姓名/手机号"
            :remote-method="remoteMethodStu"
            :loading="studentLoading"
            style="width: 240px;>"
          >
            <el-option
              v-for="item in studentForm"
              :key="item.accountId"
              :label="item.accountName + '(' + phoneFilter(item.phone) + ')'"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="学员"
          v-show="
            studyTerminalName === '2' ||
              studyTerminalName === '3' ||
              studyTerminalName === '4'
          "
        >
          <el-select
            v-model="studentorname"
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="姓名/学号"
            :remote-method="remoteMethodStuByHui"
            :loading="studentLoading"
            style="width: 240px;>"
          >
            <el-option
              v-for="item in studentForm"
              :key="item.accountId"
              :label="item.accountName + '(' + item.huiHuiNumber + ')'"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="讲师">
          <el-select
            v-model="lecturerorname"
            filterable
            remote
            reserve-keyword
            size="mini"
            placeholder="姓名/员工号"
            :remote-method="remoteMethodLec"
            :loading="lecturerLoading"
            style="width: 240px;"
          >
            <el-option
              v-for="item in lecturerForm"
              :key="item.accountId"
              :label="item.accountName + '(' + item.huiHuiNumber + ')'"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button type="primary" plain size="mini" @click="onSearch"
            >查询</el-button
          >
          <el-button
            plain
            size="mini"
            style="margin-left: 10px;"
            @click="cleanto"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="100px" size="mini"> </el-form>
    </div>
    <!-- 吸顶表头左侧遮盖-->
    <div
      v-if="isShow"
      style="position: fixed;width: 20px;left: 180px;top: 70px;height: 40px;z-index: 12;background:#FFFFFF;padding-right: 20px;color: #FFFFFF;"
    >
      1
    </div>
    <!--吸顶表头-->
    <div
      v-show="isShow"
      style="position: fixed;width: calc(100% - 200px);left: 180px;top: 70px;z-index: 9;background:#FFFFFF;padding-right: 20px;"
    >
      <div
        id="read"
        @scroll="scrollEvent"
        class="no-line-to"
        style="white-space: nowrap;-webkit-overflow-scrolling: touch;height: 40px;overflow-x: auto;overflow-y: hidden;line-height: 40px;text-align: left;color: #909399"
      >
        <div class="d-flex" style="width: 100%;">
          <div style="min-width: 70px;padding-left: 30px;">序号</div>
          <!--          <div style="min-width: 200px;padding-right: 4px;">中心</div>-->
          <div
            v-if="studyTerminalName === '1'"
            style="min-width: 200px;padding-left: 8px;"
          >
            中心
          </div>
          <div
            v-if="
              studyTerminalName === '2' ||
                studyTerminalName === '3' ||
                studyTerminalName === '4'
            "
            style="min-width: 200px;padding-left: 8px;"
          >
            公司
          </div>
          <div
            style="min-width: 200px;padding-left: 8px;"
            v-if="studyTerminalName === '1'"
          >
            公司编码
          </div>
          <div
            style="min-width: 200px;padding-left: 8px;"
            v-if="studyTerminalName === '1'"
          >
            公司/部门
          </div>
          <div style="min-width: 200px;padding-left: 8px;">学员名称</div>
          <div style="min-width: 150px;padding-left: 8px;">学号</div>
          <div style="min-width: 200px;padding-left: 8px;">课程名称</div>
          <div style="min-width: 150px;padding-left: 8px;">课型</div>
          <div style="min-width: 100px;padding-left: 8px;">课程状态</div>
          <div style="min-width: 250px;padding-left: 8px;">分类</div>
          <div style="min-width: 180px;padding-left: 8px;">讲师</div>
          <div style="min-width: 200px;padding-left: 8px;">讲师所属组织</div>
          <div style="min-width: 100px;padding-left: 8px;">
            学习进度
            <el-tooltip content="学员学习此课程的学习进度" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 200px;padding-left: 8px;">
            累计学习时长（分钟）
            <el-tooltip content="学员学习此课程的累计学习时长" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 200px;padding-left: 8px;">
            学习开始时间
            <el-tooltip content="学员首次学习此课程的时间" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 200px;padding-left: 8px;">
            最近一次学习时间
            <el-tooltip content="学员最近一次学习此课程的时间" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 100px;padding-left: 8px;">
            学习次数
            <el-tooltip
              content="学员学习此课程的次数，其中学习进度≤100%为一次，超过则为下一次"
              placement="top"
            >
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 100px;padding-left: 8px;">
            考试分数
            <el-tooltip content="学员学习此课程的考试分数" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 130px;padding-left: 8px;">
            是否提交作业
            <el-tooltip content="学员是否提交此课程的作业" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 100px;padding-left: 8px;">
            作业分数
            <el-tooltip content="学员提交作业的评分" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 130px;padding-left: 8px;">
            是否获得证书
            <el-tooltip content="学员获得此课程证书的结果" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 130px;padding-left: 8px;">
            是否获得勋章
            <el-tooltip content="学员获得此课程勋章的结果" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <!--导出按钮区域-->
      <div class="d-flex justify-content-between align-items-end mb-15">
        <div>
          <el-button
            type="primary"
            size="medium"
            @click="onExportReport('statistics')"
            >导出</el-button
          >
          <el-button
            type="primary"
            size="medium"
            @click="onExportReport('details')"
            >导出-明细</el-button
          >
        </div>
        <div style="color: #909399;font-size: 12px;margin-right: 10px">
          <img
            src="../../../assets/images/icon-help.png"
            style="width:14px;height:14px;margin-right:3px"
          />
          此报表数据统计截止至前一天
        </div>
      </div>

      <!--客户端-学习明细报表表格区域-->
      <el-table
        v-loading="loading"
        :data="tableData"
        ref="table"
        header-cell-class-name="table-header-cell"
        v-if="studyTerminalName === '1'"
      >
        <el-table-column
          align="left"
          type="index"
          label="序号"
          min-width="70px"
        ></el-table-column>
        <el-table-column
          align="left"
          prop="gameName"
          label="中心"
          :show-overflow-tooltip="true"
          min-width="200px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.gameName !== null">{{
              scope.row.gameName
            }}</span>
            <span v-if="scope.row.gameName === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="orgCode"
          label="公司编码"
          min-width="200px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.orgCode !== null">{{
              scope.row.orgCode
            }}</span>
            <span v-if="scope.row.orgCode === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="orgName"
          label="公司/部门"
          min-width="200px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.orgName != null">{{
              scope.row.orgName
            }}</span>
            <span
              v-if="
                (scope.row.orgName != null &&
                  scope.row.departmentName != null) ||
                  (scope.row.orgName == null &&
                    scope.row.departmentName == null)
              "
            >
              -
            </span>
            <span v-if="scope.row.departmentName != null">{{
              scope.row.departmentName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studentName"
          label="学员名称"
          min-width="200px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.studentName !== null">{{
              scope.row.studentName
            }}</span>
            <span v-if="scope.row.studentName === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="huiHuiNumber"
          label="学号"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.huiHuiNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="courseName"
          label="课程名称"
          min-width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.courseName !== null">{{
              scope.row.courseName
            }}</span>
            <span v-if="scope.row.courseName === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="courseType"
          label="课型"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.courseType === '1'">录播/文档课</span>
            <span v-if="scope.row.courseType === '2'">直播课</span>
            <span v-if="scope.row.courseType === '3'">研讨课</span>
            <span v-if="scope.row.courseType === '4'">系列课</span>
            <span v-if="scope.row.courseType === '5'">自建课</span>
            <span v-if="scope.row.courseType === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="status"
          label="课程状态"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">草稿</span>
            <span v-if="scope.row.status === 2">上架</span>
            <span v-if="scope.row.status === 3">下架</span>
            <span v-if="scope.row.status === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="courseClassify"
          label="分类"
          min-width="250px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.courseClassify !== null">{{
              scope.row.courseClassify
            }}</span>
            <span v-if="scope.row.courseClassify === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="lecturerName"
          label="讲师"
          min-width="180px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.lecturerName !== null"
              >{{ scope.row.lecturerName }} （{{ scope.row.lecturerId }}）</span
            >
            <span v-if="scope.row.lecturerName === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="lecturerOrganization"
          label="讲师所属组织"
          min-width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.lecturerOrganization !== null">{{
              scope.row.lecturerOrganization
            }}</span>
            <span v-if="scope.row.lecturerOrganization === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="progress"
          label="学习进度"
          min-width="100px"
        >
          <template slot="header">
            <span>学习进度</span>
            <el-tooltip
              effect="dark"
              content="学员学习此课程的学习进度"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.progress !== null">{{
              scope.row.progress
            }}</span>
            <span v-if="scope.row.progress === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="totalStudyTime"
          label="累计学习时长（分钟）"
          min-width="200px"
        >
          <template slot="header">
            <span>累计学习时长（分钟）</span>
            <el-tooltip
              effect="dark"
              content="学员学习此课程的累计学习时长"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.totalStudyTime !== null">{{
              scope.row.totalStudyTime
            }}</span>
            <span v-if="scope.row.totalStudyTime === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studyStartTime"
          label="学习开始时间"
          min-width="200px"
        >
          <template slot="header">
            <span>学习开始时间</span>
            <el-tooltip
              effect="dark"
              content="学员首次学习此课程的时间"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.studyStartTime !== null">{{
              scope.row.studyStartTime
            }}</span>
            <span v-if="scope.row.studyStartTime === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studyLastTime"
          label="最近一次学习时间"
          min-width="200px"
        >
          <template slot="header">
            <span>最近一次学习时间</span>
            <el-tooltip
              effect="dark"
              content="学员最近一次学习此课程的时间"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.studyLastTime !== null">{{
              scope.row.studyLastTime
            }}</span>
            <span v-if="scope.row.studyLastTime === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studyNumber"
          label="学习次数"
          min-width="100px"
        >
          <template slot="header">
            <span>学习次数</span>
            <el-tooltip
              effect="dark"
              content="学员学习此课程的次数，其中学习进度≤100%为一次，超过则为下一次"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.studyNumber !== null">{{
              scope.row.studyNumber
            }}</span>
            <span v-if="scope.row.studyNumber === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="examScore"
          label="考试分数"
          min-width="100px"
        >
          <template slot="header">
            <span>考试分数</span>
            <el-tooltip
              effect="dark"
              content="学员学习此课程的考试分数"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.examScore !== null">{{
              scope.row.examScore
            }}</span>
            <span v-if="scope.row.examScore === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="homeworkSubmitStatus"
          label="是否提交作业"
          min-width="130px"
        >
          <template slot="header">
            <span>是否提交作业</span>
            <el-tooltip
              effect="dark"
              content="学员是否提交此课程的作业"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.homeworkSubmitStatus === 0">否</span>
            <span v-if="scope.row.homeworkSubmitStatus === 1">是</span>
            <span v-if="scope.row.homeworkSubmitStatus === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="homeworkScore"
          label="作业分数"
          min-width="100px"
        >
          <template slot="header">
            <span>作业分数</span>
            <el-tooltip
              effect="dark"
              content="学员提交作业的评分"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.homeworkScore !== null">{{
              scope.row.homeworkScore
            }}</span>
            <span v-if="scope.row.homeworkScore === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="certificateStatus"
          label="是否获得证书"
          min-width="130px"
        >
          <template slot="header">
            <span>是否获得证书</span>
            <el-tooltip
              effect="dark"
              content="学员获得此课程证书的结果"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.certificateStatus === 0">否</span>
            <span v-if="scope.row.certificateStatus === 1">是</span>
            <span v-if="scope.row.certificateStatus === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="medalStatus"
          label="是否获得勋章"
          min-width="130px"
        >
          <template slot="header">
            <span>是否获得勋章</span>
            <el-tooltip
              effect="dark"
              content="学员获得此课程勋章的结果"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.medalStatus === 0">否</span>
            <span v-if="scope.row.medalStatus === 1">是</span>
            <span v-if="scope.row.medalStatus === null"> - </span>
          </template>
        </el-table-column>
      </el-table>
      <!--直销员端-学习明细报表表格区域-->
      <el-table
        v-loading="loading"
        :data="tableData"
        ref="table"
        header-cell-class-name="table-header-cell"
        v-if="
          studyTerminalName === '2' ||
            studyTerminalName === '3' ||
            studyTerminalName === '4'
        "
      >
        <el-table-column
          align="left"
          type="index"
          label="序号"
          min-width="70px"
        ></el-table-column>
        <el-table-column
          align="left"
          :show-overflow-tooltip="true"
          prop="gameName"
          label="公司"
          min-width="200px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.gameName !== null">{{
              scope.row.gameName
            }}</span>
            <span v-if="scope.row.gameName === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studentName"
          label="学员名称"
          min-width="200px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.studentName !== null">{{
              scope.row.studentName
            }}</span>
            <span v-if="scope.row.studentName === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="huiHuiNumber"
          label="学号"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.huiHuiNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="courseName"
          label="课程名称"
          min-width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.courseName !== null">{{
              scope.row.courseName
            }}</span>
            <span v-if="scope.row.courseName === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="courseType"
          label="课型"
          min-width="150px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.courseType === '1'">录播/文档课</span>
            <span v-if="scope.row.courseType === '2'">直播课</span>
            <span v-if="scope.row.courseType === '3'">研讨课</span>
            <span v-if="scope.row.courseType === '4'">系列课</span>
            <span v-if="scope.row.courseType === '5'">自建课</span>
            <span v-if="scope.row.courseType === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="status"
          label="课程状态"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">草稿</span>
            <span v-if="scope.row.status === 2">上架</span>
            <span v-if="scope.row.status === 3">下架</span>
            <span v-if="scope.row.status === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="courseClassify"
          label="分类"
          min-width="250px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.courseClassify !== null">{{
              scope.row.courseClassify
            }}</span>
            <span v-if="scope.row.courseClassify === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="lecturerName"
          label="讲师"
          min-width="180px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.lecturerName !== null"
              >{{ scope.row.lecturerName }}（{{ scope.row.lecturerId }}）</span
            >
            <span v-if="scope.row.lecturerName === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="lecturerOrganization"
          label="讲师所属组织"
          min-width="200px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.lecturerOrganization !== null">{{
              scope.row.lecturerOrganization
            }}</span>
            <span v-if="scope.row.lecturerOrganization === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="progress"
          label="学习进度"
          min-width="100px"
        >
          <template slot="header">
            <span>学习进度</span>
            <el-tooltip
              effect="dark"
              content="学员学习此课程的学习进度"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.progress !== null">{{
              scope.row.progress
            }}</span>
            <span v-if="scope.row.progress === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="totalStudyTime"
          label="累计学习时长（分钟）"
          min-width="200px"
        >
          <template slot="header">
            <span>累计学习时长（分钟）</span>
            <el-tooltip
              effect="dark"
              content="学员学习此课程的累计学习时长"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.totalStudyTime !== null">{{
              scope.row.totalStudyTime
            }}</span>
            <span v-if="scope.row.totalStudyTime === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studyStartTime"
          label="学习开始时间"
          min-width="200px"
        >
          <template slot="header">
            <span>学习开始时间</span>
            <el-tooltip
              effect="dark"
              content="学员首次学习此课程的时间"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.studyStartTime !== null">{{
              scope.row.studyStartTime
            }}</span>
            <span v-if="scope.row.studyStartTime === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studyLastTime"
          label="最近一次学习时间"
          min-width="200px"
        >
          <template slot="header">
            <span>最近一次学习时间</span>
            <el-tooltip
              effect="dark"
              content="学员最近一次学习此课程的时间"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.studyLastTime !== null">{{
              scope.row.studyLastTime
            }}</span>
            <span v-if="scope.row.studyLastTime === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studyNumber"
          label="学习次数"
          min-width="100px"
        >
          <template slot="header">
            <span>学习次数</span>
            <el-tooltip
              effect="dark"
              content="学员学习此课程的次数，其中学习进度≤100%为一次，超过则为下一次"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.studyNumber !== null">{{
              scope.row.studyNumber
            }}</span>
            <span v-if="scope.row.studyNumber === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="examScore"
          label="考试分数"
          min-width="100px"
        >
          <template slot="header">
            <span>考试分数</span>
            <el-tooltip
              effect="dark"
              content="学员学习此课程的考试分数"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.examScore !== null">{{
              scope.row.examScore
            }}</span>
            <span v-if="scope.row.examScore === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="homeworkSubmitStatus"
          label="是否提交作业"
          min-width="130px"
        >
          <template slot="header">
            <span>是否提交作业</span>
            <el-tooltip
              effect="dark"
              content="学员是否提交此课程的作业"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.homeworkSubmitStatus === 0">否</span>
            <span v-if="scope.row.homeworkSubmitStatus === 1">是</span>
            <span v-if="scope.row.homeworkSubmitStatus === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="homeworkScore"
          label="作业分数"
          min-width="100px"
        >
          <template slot="header">
            <span>作业分数</span>
            <el-tooltip
              effect="dark"
              content="学员提交作业的评分"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.homeworkScore !== null">{{
              scope.row.homeworkScore
            }}</span>
            <span v-if="scope.row.homeworkScore === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="certificateStatus"
          label="是否获得证书"
          min-width="130px"
        >
          <template slot="header">
            <span>是否获得证书</span>
            <el-tooltip
              effect="dark"
              content="学员获得此课程证书的结果"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.certificateStatus === 0">否</span>
            <span v-if="scope.row.certificateStatus === 1">是</span>
            <span v-if="scope.row.certificateStatus === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="medalStatus"
          label="是否获得勋章"
          min-width="130px"
        >
          <template slot="header">
            <span>是否获得勋章</span>
            <el-tooltip
              effect="dark"
              content="学员获得此课程勋章的结果"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.medalStatus === 0">否</span>
            <span v-if="scope.row.medalStatus === 1">是</span>
            <span v-if="scope.row.medalStatus === null"> - </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="onCurrentSizeChange"
        @size-change="onPageSizeChange"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="rows"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    <!--导出至邮箱对话框-->
    <el-dialog
      width="510px"
      title="导出"
      class="emailDialog"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :visible.sync="emailFlag"
    >
      <el-alert
        title="提示：导出内容将以附件形式发送至输入的邮箱，请于10分钟后查看"
        type="info"
        :closable="false"
        show-icon
        style="width: 458px;margin-bottom: 20px;"
      ></el-alert>
      <el-form
        :inline="true"
        label-width="55px"
        size="mini"
        :model="emailForm"
        :rules="emailRules"
        ref="emailFormRef"
      >
        <el-form-item prop="emailAddress" label="邮箱">
          <el-input
            v-model="emailForm.emailAddress"
            clearable
            placeholder="请输入您的邮箱"
            style="width: 403px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确认导出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./learning-detail-report.ts"></script>

<style lang="scss">
.brand-list {
  .el-tabs__item {
    width: 110px !important;
    text-align: center;
  }
}
.emailDialog {
  .el-alert--info.is-light {
    background-color: #ecf5ff !important;
    color: #409eff !important;
  }
}
</style>
<style lang="scss" scoped>
.no-line-to {
  &::-webkit-scrollbar {
    display: none !important;
  }
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
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .el-pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
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
