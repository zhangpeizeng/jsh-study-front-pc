<template>
  <div class="brand-list">
    <el-tabs
      id="elTabs"
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
        <!--        <el-form-item label="所属学习终端">-->
        <!--          <el-select-->
        <!--            v-model="studyTerminalName"-->
        <!--            size="mini"-->
        <!--            placeholder="请选择"-->
        <!--            @change="terminalChange"-->
        <!--            style="width: 240px;"-->
        <!--          >-->
        <!--            <el-option-->
        <!--              v-for="item in studyTerminalNameList"-->
        <!--              :key="item.terminalCode"-->
        <!--              :label="item.terminalName"-->
        <!--              :value="item.terminalCode"-->
        <!--            ></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
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
        <el-form-item label="是否必修">
          <el-select
            v-model="isCompulsory"
            placeholder="请选择"
            clearable
            style="width: 240px;"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <product-group-tree
            :label-code="labelCode"
            @check="courseGroupCodes = $event"
            @instance="instanceTree"
            style="width: 240px;"
          ></product-group-tree>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="100px" size="mini">
        <el-form-item label="创建时间" class="date-item">
          <el-date-picker
            v-model="createStartTime"
            type="date"
            value-format="timestamp"
            placeholder="开始日期"
          ></el-date-picker>
          <span style="margin: 0 10px">至</span>
          <el-date-picker
            v-model="createEndTime"
            type="date"
            value-format="timestamp"
            placeholder="结束日期"
            @change="timeChange"
          ></el-date-picker>
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
        <el-form-item label="是否发证书">
          <el-select
            v-model="isIssueCertificates"
            placeholder="请选择"
            clearable
            style="width: 240px;"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="100px" size="mini">
        <el-form-item label="是否发勋章">
          <el-select
            v-model="isAwardMedals"
            placeholder="请选择"
            clearable
            style="width: 240px;"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否布置作业">
          <el-select
            v-model="isAssignWork"
            placeholder="请选择"
            clearable
            style="width: 240px;"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程状态">
          <el-select
            v-model="courseStatus"
            placeholder="请选择"
            clearable
            style="width: 240px;"
          >
            <el-option label="已上架" value="2"></el-option>
            <el-option label="已下架" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="100px" size="mini">
        <el-form-item style="float:right;">
          <el-button type="primary" plain size="mini" @click="onSearch"
            >查询</el-button
          >
          <el-button
            plain
            size="mini"
            @click="cleanto"
            style="margin-left: 10px;"
            >重置</el-button
          >
        </el-form-item>
        <div style="clear: both"></div>
      </el-form>
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
          <!--          <div style="min-width: 200px;padding-right: 4px;">课程名称</div>-->
          <div style="min-width: 200px;padding-left: 8px;">课程名称</div>
          <div style="min-width: 150px;padding-left: 8px;">课型</div>
          <div style="min-width: 100px;padding-left: 8px;">是否必修</div>
          <div style="min-width: 100px;padding-left: 8px;">课程状态</div>
          <div style="min-width: 250px;padding-left: 8px;">分类</div>
          <div style="min-width: 200px;padding-left: 8px;">创建时间</div>
          <div style="min-width: 350px;padding-left: 8px;">学习限制时间</div>
          <div style="min-width: 200px;padding-left: 8px;">讲师</div>
          <div style="min-width: 200px;padding-left: 8px;">讲师所属组织</div>
          <div style="min-width: 120px;padding-left: 8px;">
            投放学员数
            <el-tooltip
              content="当前课程的投放学员数，因激活学员数改变，此数据会动态改变"
              placement="top"
            >
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 100px;padding-left: 8px;">
            学习人数
            <el-tooltip content="产生学习进度的学习人数" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 100px;padding-left: 8px;">
            完课率
            <el-tooltip
              content="完课率=100%学完本课程的学员人数/总学习人数*100%"
              placement="top"
            >
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 180px;padding-left: 8px;">
            人均学习时长（分钟）
            <el-tooltip
              content="人均学习时长=合计所有学员的累计学习时长÷总学习人数"
              placement="top"
            >
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 100px;padding-left: 8px;">
            考试人数
            <el-tooltip content="参与本课程考试的总人数" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 120px;padding-left: 8px;">
            考试平均分
            <el-tooltip
              content="考试平均分=考试总分/考试总人数*100%"
              placement="top"
            >
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 120px;padding-left: 8px;">
            作业提交数
            <el-tooltip content="提交本课程作业的总数" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 120px;padding-left: 8px;">
            作业批改数
            <el-tooltip content="批改本课程作业的总数" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 120px;padding-left: 8px;">
            作业平均分
            <el-tooltip
              content="作业平均分=作业总分/作业批改数*100%"
              placement="top"
            >
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 130px;padding-left: 8px;">
            获得证书人数
            <el-tooltip content="获得本课程证书的总人数" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
          <div style="min-width: 130px;padding-left: 8px;">
            获得勋章人数
            <el-tooltip content="获得本课程勋章的总人数" placement="top">
              <i class="el-icon-question" style="cursor: pointer;"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <!--统计区域-->
      <el-row :gutter="20" style="margin-bottom: 20px;">
        <el-col :span="12">
          <div
            style="width: 100%;height: 80px;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center"
          >
            <div
              style="width: 100%;height: 20px;font-size: 20px;font-family: PingFangSC-Regular, 'PingFang SC';font-weight: 500;color: #303133;line-height: 50px;"
            >
              {{ totalCourseNum }}
            </div>
            <span
              style="width: 100%;height: 16px;font-size: 16px;font-weight: 400;font-family: PingFangSC-Regular, 'PingFang SC';color: #606266;line-height: 80px;"
            >
              课程上架数
              <el-tooltip
                effect="dark"
                placement="bottom-start"
                :enterable="false"
                content="当前学习终端的上架课程数，仅随学习终端而变动此数据"
              >
                <img
                  src="../../../assets/images/icon-help.png"
                  style="width: 14px;height: 14px;"
                />
              </el-tooltip>
            </span>
          </div>
        </el-col>
        <el-col :span="12">
          <div
            style="width: 100%;height: 80px;border-radius: 4px;border: 1px solid #DCDFE6;text-align:center;"
          >
            <div
              style="width: 100%;height: 20px;font-size: 20px;font-family: PingFangSC-Regular, 'PingFang SC';font-weight: 500;color: #303133;line-height: 50px;"
            >
              {{ totalCompletionRate }}
            </div>
            <span
              style="width: 100%;height: 16px;font-size: 16px;font-weight: 400;font-family: PingFangSC-Regular, 'PingFang SC';color: #606266;line-height: 80px;"
            >
              完课率
              <el-tooltip
                effect="dark"
                placement="bottom-end"
                :enterable="false"
                content="当前学习终端，产生学习进度的课程，平均完课率，仅随学习终端而变动此数据"
              >
                <img
                  src="../../../assets/images/icon-help.png"
                  style="width: 14px;height: 14px;"
                />
              </el-tooltip>
            </span>
          </div>
        </el-col>
      </el-row>
      <!--导出按钮区域-->
      <div class="d-flex align-items-end justify-content-between mb-15">
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
      <!--课程统计报表表格区域-->
      <el-table
        v-loading="loading"
        :data="tableData"
        ref="table"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column
          align="left"
          type="index"
          label="序号"
          min-width="70px"
        ></el-table-column>
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
          prop="requiredStatus"
          label="是否必修"
          min-width="100px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.requiredStatus === 1">是</span>
            <span v-if="scope.row.requiredStatus === 0">否</span>
            <span v-if="scope.row.requiredStatus === null"> - </span>
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
          prop="createTime"
          label="创建时间"
          min-width="200px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.createTime !== null">{{
              scope.row.createTime
            }}</span>
            <span v-if="scope.row.createTime === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studyTime"
          label="学习限制时间"
          min-width="350px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.studyTime !== null">{{
              scope.row.studyTime
            }}</span>
            <span v-if="scope.row.studyTime === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="讲师" min-width="200px">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.lecturerName !== null && scope.row.lecturerId !== null
              "
              >{{ scope.row.lecturerName }} ( {{ scope.row.lecturerId }} )</span
            >
            <span
              v-if="
                scope.row.lecturerName === null && scope.row.lecturerId !== null
              "
              >{{ scope.row.lecturerId }}</span
            >
            <span
              v-if="
                scope.row.lecturerName !== null && scope.row.lecturerId === null
              "
              >{{ scope.row.lecturerName }}</span
            >
            <span
              v-if="
                scope.row.lecturerName === null && scope.row.lecturerId === null
              "
            >
              -
            </span>
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
          prop="launchStudentsNum"
          label="投放学员数"
          min-width="120px"
        >
          <template slot="header">
            <span>投放学员数</span>
            <el-tooltip
              effect="dark"
              content="当前课程的投放学员数，因激活学员数改变，此数据会动态改变"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.launchStudentsNum !== null">{{
              scope.row.launchStudentsNum
            }}</span>
            <span v-if="scope.row.launchStudentsNum === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="studyStudentsNum"
          label="学习人数"
          min-width="100px"
        >
          <template slot="header">
            <span>学习人数</span>
            <el-tooltip
              effect="dark"
              content="产生学习进度的学习人数"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.studyStudentsNum !== null">{{
              scope.row.studyStudentsNum
            }}</span>
            <span v-if="scope.row.studyStudentsNum === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="completionRate"
          label="完课率"
          min-width="100px"
        >
          <template slot="header">
            <span>完课率</span>
            <el-tooltip
              effect="dark"
              content="完课率=100%学完本课程的学员人数/总学习人数*100%"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.completionRate !== null">{{
              scope.row.completionRate
            }}</span>
            <span v-if="scope.row.completionRate === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="averageStudyTime"
          label="人均学习时长（分钟）"
          min-width="180px"
        >
          <template slot="header">
            <span>人均学习时长（分钟）</span>
            <el-tooltip
              effect="dark"
              content="人均学习时长=合计所有学员的累计学习时长÷总学习人数"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.averageStudyTime !== null">{{
              scope.row.averageStudyTime
            }}</span>
            <span v-if="scope.row.averageStudyTime === null"> - </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="examNum"
          label="考试人数"
          min-width="100px"
        >
          <template slot="header">
            <span>考试人数</span>
            <el-tooltip
              effect="dark"
              content="参与本课程考试的总人数"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.testStatus === 0"> - </span>
            <span v-if="scope.row.testStatus === 1">
              <span v-if="scope.row.examNum !== null">{{
                scope.row.examNum
              }}</span>
              <span v-if="scope.row.examNum === null"> - </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="averageExamScore"
          label="考试平均分"
          min-width="120px"
        >
          <template slot="header">
            <span>考试平均分</span>
            <el-tooltip
              effect="dark"
              content="考试平均分=考试总分/考试总人数*100%"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.testStatus === 0"> - </span>
            <span v-if="scope.row.testStatus === 1">
              <span v-if="scope.row.averageExamScore !== null">{{
                scope.row.averageExamScore
              }}</span>
              <span v-if="scope.row.averageExamScore === null"> - </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="homeworkSubmitNum"
          label="作业提交数"
          min-width="120px"
        >
          <template slot="header">
            <span>作业提交数</span>
            <el-tooltip
              effect="dark"
              content="提交本课程作业的总数"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === 0"> - </span>
            <span v-if="scope.row.taskStatus === 1">
              <span v-if="scope.row.homeworkSubmitNum !== null">{{
                scope.row.homeworkSubmitNum
              }}</span>
              <span v-if="scope.row.homeworkSubmitNum === null"> - </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="homeworkCorrectNum"
          label="作业批改数"
          min-width="120px"
        >
          <template slot="header">
            <span>作业批改数</span>
            <el-tooltip
              effect="dark"
              content="批改本课程作业的总数"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === 0"> - </span>
            <span v-if="scope.row.taskStatus === 1">
              <span v-if="scope.row.homeworkCorrectNum !== null">{{
                scope.row.homeworkCorrectNum
              }}</span>
              <span v-if="scope.row.homeworkCorrectNum === null"> - </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="averageHomeworkScore"
          label="作业平均分"
          min-width="120px"
        >
          <template slot="header">
            <span>作业平均分</span>
            <el-tooltip
              effect="dark"
              content="作业平均分=作业总分/作业批改数*100%"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.taskStatus === 0"> - </span>
            <span v-if="scope.row.taskStatus === 1">
              <span v-if="scope.row.averageHomeworkScore !== null">{{
                scope.row.averageHomeworkScore
              }}</span>
              <span v-if="scope.row.averageHomeworkScore === null"> - </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="certificateNum"
          label="获得证书人数"
          min-width="130px"
        >
          <template slot="header">
            <span>获得证书人数</span>
            <el-tooltip
              effect="dark"
              content="获得本课程证书的总人数"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.certificateStatus === 0"> - </span>
            <span v-if="scope.row.certificateStatus === 1">
              <span v-if="scope.row.certificateNum !== null">{{
                scope.row.certificateNum
              }}</span>
              <span v-if="scope.row.certificateNum === null"> - </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          prop="medalNum"
          label="获得勋章人数"
          min-width="130px"
        >
          <template slot="header">
            <span>获得勋章人数</span>
            <el-tooltip
              effect="dark"
              content="获得本课程勋章的总人数"
              placement="top"
            >
              <i
                class="el-icon-question"
                style="cursor: pointer;padding-left: 4px;"
              ></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.medalStatus === 0"> - </span>
            <span v-if="scope.row.medalStatus === 1">
              <span v-if="scope.row.medalNum !== null">{{
                scope.row.medalNum
              }}</span>
              <span v-if="scope.row.medalNum === null"> - </span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="onPageSizeChange"
        @current-change="onCurrentPageChange"
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

<script lang="ts" src="./course-statistics-report.ts"></script>

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
  .date-item {
    .el-input__inner {
      width: 130px !important;
    }
    .el-date-editor.el-input {
      width: 130px !important;
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
