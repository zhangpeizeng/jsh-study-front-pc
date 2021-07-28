<template>
  <div class="brand-list">
    <div class="header-form">
      <el-form :inline="true" label-width="84px" size="mini">
        <el-form-item label="课程">
          <el-input
            v-model="courseName"
            clearable
            placeholder="请输入课程名称"
            maxlength="30"
            style="width: 193px;"
            @input="courseName = courseName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status" placeholder="请选择" clearable filterable>
            <el-option label="草稿" value="1"></el-option>
            <el-option label="已上架" value="2"></el-option>
            <el-option label="已下架" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学习终端">
          <el-select
            @change="changeStudyTerminal"
            v-model="studyTerminal"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in studyTerminalNameList"
              :key="item.terminalCode"
              :label="item.terminalName"
              :value="item.terminalCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="padding-left: 30px"> </el-form-item>
      </el-form>
      <el-form :inline="true" label-width="84px" size="mini">
        <el-form-item v-show="studyTerminal" label="分类">
          <course-classify
            :parentList="keList"
            style="margin-top:-4px"
            @instanceClass="instanceKe"
            @change="keChange"
          ></course-classify>
        </el-form-item>
        <el-form-item label="创建人" label-width="84px">
          <el-select
            v-model="lecturerId"
            filterable
            size="mini"
            remote
            reserve-keyword
            clearable
            placeholder="名称/员工号"
            :remote-method="remoteMethod"
            @clear="lecturerClear"
          >
            <el-option
              v-for="item in options"
              :key="item.accountId"
              :label="item.accountName + '(' + item.huiHuiNumber + ')'"
              :value="item.accountId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" class="date-item">
          <el-date-picker
            v-model="createStartTime"
            type="date"
            value-format="timestamp"
            placeholder="开始时间"
            @change="timeChange('create')"
          >
          </el-date-picker>
          <span style="margin: 0 10px;">至</span>
          <el-date-picker
            v-model="createEndTime"
            type="date"
            value-format="timestamp"
            placeholder="结束时间"
            @change="timeChange('create')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item v-show="packFlag" label="课型">
          <el-select
            v-model="courseTypeList"
            @change="changeCourseType"
            multiple
            placeholder="请选择课型"
          >
            <el-option
              v-for="item in chosetypelist"
              :key="item.labelCode"
              :label="item.labelName"
              :value="item.labelCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!--        :class="{ pR100: packFlag }"-->
        <el-form-item v-show="packFlag" label="授课讲师">
          <el-input
            v-model="lecturerName"
            clearable
            placeholder="请输入"
            maxlength="30"
            style="width: 193px;"
            @input="lecturerName = lecturerName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="packFlag && isLiveShow"
          label="直播时间"
          class="date-item"
        >
          <el-date-picker
            v-model="liveStartTime"
            type="date"
            value-format="timestamp"
            placeholder="开始时间"
            @change="timeChange('live')"
          >
          </el-date-picker>
          <span style="margin: 0 10px;">至</span>
          <el-date-picker
            v-model="liveEndTime"
            type="date"
            value-format="timestamp"
            placeholder="结束时间"
            @change="timeChange('live')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
          <el-button type="" @click="cleanto" plain style="margin-left: 10px;"
            >重置</el-button
          >
        </el-form-item>
        <div style="clear: both"></div>
      </el-form>
      <div
        class="d-flex align-items-center justify-content-between"
        style="margin-right: 10px;"
      >
        <div class="line-dash"></div>
        <div @click="moreClick" style="">
          <img
            src="../../../../assets/images/apply-bottom.png"
            style="width: 11px;height: 11px;margin-right: 5px;cursor: pointer;"
            v-if="!packFlag"
          />
          <img
            src="../../../../assets/images/apply-top.png"
            style="width: 11px;height: 11px;margin-right: 5px;cursor: pointer;"
            v-if="packFlag"
          />
          <span style="color: #2780F8;cursor: pointer;">{{ packText }}</span>
        </div>
      </div>
    </div>
    <div class="mb-15">
      <el-button
        type="primary"
        size="medium"
        icon="el-icon-circle-plus-outline"
        @click="gotoadd"
        >新建课程</el-button
      >
    </div>
    <div class="body" v-if="shownolist">
      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column type="index" label="序号" width="80px">
        </el-table-column>
        <el-table-column label="课程" width="260px">
          <template slot-scope="scope">
            <img
              class="brand-logo"
              :src="scope.row.courseImg"
              v-if="scope.row.courseImg"
            />
            <img
              class="brand-logo"
              src="../../../../assets/images/backlogo.png"
              v-if="!scope.row.courseImg"
            />
            <div class="class-img">{{ scope.row.courseTypeName }}</div>
            <div
              class="class-text"
              v-if="
                scope.row.courseType === '2' || scope.row.courseType === '3'
              "
            >
              {{ scope.row.liveStartTime | date("yyyy-MM-dd hh:mm") }}
            </div>
            <div class="brand-text">
              <!--<el-tooltip-->
              <!--class=" "-->
              <!--:content="scope.row.courseName"-->
              <!--placement="top"-->
              <!--&gt;-->
              <span>{{ scope.row.courseName }}</span>
              <!--</el-tooltip>-->
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="studyTerminal"
          min-width="150px"
          label="学习终端"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.studyTerminal != null">{{
              scope.row.studyTerminal
            }}</span>
            <span v-if="scope.row.studyTerminal == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column label="授课讲师">
          <template slot-scope="scope">
            <span v-if="scope.row.lecturerName != null">
              {{ scope.row.lecturerName }}
            </span>
            <span v-if="scope.row.lecturerName == null">
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="nameEn" min-width="150px" label="创建人">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.createUserName != null || scope.row.employeeId != null
              "
            >
              {{ scope.row.createUserName }}（{{ scope.row.employeeId }}）
            </span>
            <span
              v-if="
                scope.row.createUserName == null && scope.row.employeeId == null
              "
            >
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="nameEn" label="创建时间">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime != null">
              {{ scope.row.createTime | date("yyyy-MM-dd") }}
            </span>
            <span v-if="scope.row.createTime == null">
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="categoryName"
          width="80px"
          align="center"
          label="状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">草稿</span>
            <span v-if="scope.row.status === 2">已上架</span>
            <span v-if="scope.row.status === 3">已下架</span>
          </template>
        </el-table-column>
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
          src="../../../../assets/images/nolist.png"
          style="width: 222px;display: inline-block;"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./shop-class-list.ts"></script>

<style lang="scss" scoped>
.brand-list {
  padding: 24px 20px 20px 20px;

  .header-form {
    padding-bottom: 6px;

    .el-button {
      margin-left: 40px;
      padding-left: 20px;
      padding-right: 20px;
    }
    .line-dash {
      width: 96%;
      border-bottom: 2px dashed #dcdfe6;
    }
    .pR100 {
      padding-right: 100px;
    }
  }

  .body {
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
      /*white-space: nowrap;*/
      /*text-overflow: ellipsis;*/
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
</style>
