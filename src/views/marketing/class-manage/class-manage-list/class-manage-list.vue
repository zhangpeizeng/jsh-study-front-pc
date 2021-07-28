<template>
  <div class="brand-list">
    <div class="header-form">
      <el-form :inline="true" label-width="84px" size="mini">
        <el-form-item label="班级">
          <el-input
            v-model="className"
            clearable
            placeholder="请输入班级名称"
            maxlength="40"
            style="width: 240px;"
            @input="className = className.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="status"
            multiple
            collapse-tags
            clearable
            placeholder="请选择"
            style="width: 216px;"
          >
            <el-option
              v-for="item in statusList"
              :key="item.labelCode"
              :label="item.labelName"
              :value="item.labelCode"
            >
            </el-option>
          </el-select>
          <img
            src="../../../../assets/images/icon-help.png"
            class="icon-tip ml-10 cursor-pointer"
            @click="tipClick"
          />
        </el-form-item>
        <el-form-item label="学习终端">
          <el-select
            v-model="studyTerminal"
            clearable
            placeholder="请选择"
            style="width: 240px;"
          >
            <el-option
              v-for="item in studyTerminalNameList"
              :key="item.labelCode"
              :label="item.labelName"
              :value="item.labelCode"
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
        <el-form-item label="创建人">
          <el-select
            style="width: 240px;"
            v-model="createUser"
            filterable
            remote
            reserve-keyword
            clearable
            size="mini"
            placeholder="请输入姓名/员工号"
            :remote-method="remoteMethodCreate"
            :loading="lecturerLoading"
          >
            <el-option
              v-for="item in lecturerCreateForm"
              :key="item.accountId"
              :label="item.accountName + '(' + item.huiHuiNumber + ')'"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班主任">
          <el-select
            style="width: 240px;"
            v-model="lecturerId"
            filterable
            remote
            reserve-keyword
            clearable
            size="mini"
            placeholder="请输入姓名/员工号"
            :remote-method="remoteMethodLec"
            :loading="lecturerLoading"
          >
            <el-option
              v-for="item in lecturerForm"
              :key="item.lecturerId"
              :label="item.accountName + '(' + item.employeeId + ')'"
              :value="item.lecturerId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" class="date-item">
          <el-date-picker
            v-model="createStartTime"
            type="date"
            value-format="timestamp"
            placeholder="开始时间"
          >
          </el-date-picker>
          <span style="margin: 0 10px;">至</span>
          <el-date-picker
            v-model="createEndTime"
            type="date"
            value-format="timestamp"
            placeholder="结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开班时间" class="date-item">
          <el-date-picker
            v-model="classStartTime"
            type="date"
            value-format="timestamp"
            placeholder="开始时间"
          >
          </el-date-picker>
          <span style="margin: 0 10px;">至</span>
          <el-date-picker
            v-model="classEndTime"
            type="date"
            value-format="timestamp"
            placeholder="结束时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <div class="body">
      <div class="mb-15">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-circle-plus-outline"
          @click="gotoadd"
          >新建班级</el-button
        >
      </div>
      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column type="index" label="序号" min-width="50px">
        </el-table-column>
        <el-table-column
          label="班级"
          width="150px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="studyTerminal" label="学习终端" min-width="50px">
          <template slot-scope="scope">
            <span v-if="scope.row.studyTerminal != null">{{
              scope.row.studyTerminal
            }}</span>
            <span v-if="scope.row.studyTerminal == null"> - </span>
          </template>
        </el-table-column>
        <el-table-column label="班主任" min-width="100px">
          <template slot-scope="scope">
            <span
              >{{ scope.row.lecturerName }}（{{
                scope.row.lecturerCode
              }}）</span
            >
          </template>
        </el-table-column>
        <el-table-column label="开班时间" min-width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.classStartTime || scope.row.classEndTime">
              {{ scope.row.classStartTime | date("yyyy-MM-dd") }}至{{
                scope.row.classEndTime | date("yyyy-MM-dd")
              }}
            </span>
            <span v-if="!scope.row.classStartTime && !scope.row.classEndTime">
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" min-width="100px">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.createUserName != null ||
                  scope.row.createUserCode != null
              "
            >
              {{ scope.row.createUserName }}（{{ scope.row.createUserCode }}）
            </span>
            <span
              v-if="
                scope.row.createUserName == null &&
                  scope.row.createUserCode == null
              "
            >
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.createTime">
              {{ scope.row.createTime | date("yyyy-MM-dd") }}
            </span>
            <span v-if="!scope.row.createTime">
              -
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="50px">
          <template slot-scope="scope">
            <span>
              {{ scope.row.statusName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-button size="mini" @click="gotodetail(scope.row)" plain>
              详情
            </el-button>
            <el-button
              size="mini"
              @click="overClass(scope.row)"
              plain
              v-if="scope.row.status == 4"
            >
              结班
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
    <el-dialog
      title=""
      :visible.sync="dialogView"
      width="65%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-image style="width: 100%" :src="classViewImg"> </el-image>
      <div slot="footer" class="text-center">
        <el-button @click="dialogView = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./class-manage-list.ts"></script>

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
