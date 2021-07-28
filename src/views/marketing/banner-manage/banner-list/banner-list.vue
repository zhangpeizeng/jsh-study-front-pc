<template>
  <div class="banner-list">
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
            <span>banner时间</span>
          </el-col>
          <el-col :span="7.5" class="text-content">
            <el-date-picker
              v-model="startDate"
              type="datetime"
              placeholder="开始时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
            >
            </el-date-picker>
            <span style="margin: 0 10px;">至</span>
            <el-date-picker
              v-model="endDate"
              type="datetime"
              placeholder="结束时间"
              size="small"
              value-format="timestamp"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              prefix-icon="el-icon-date"
            >
            </el-date-picker>
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
    <div>
      <el-tabs
        v-model="labelCode"
        type="card"
        @tab-click="handleClick"
        class="classify-tab"
      >
        <el-tab-pane
          v-for="(item, index) in terminalList"
          :key="index"
          :label="item.labelName"
          :name="item.labelCode"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="header-form">
      <el-form :inline="true" label-width="98px" size="mini">
        <el-form-item :required="true" label="所属机构">
          <el-select
            @change="changeCode"
            v-model="organCode"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.classifyName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input
            v-model="classifyName"
            clearable
            placeholder="请输入名称"
            maxlength="18"
            @input="classifyName = classifyName.replace(/^ +| +$/g, '')"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status" placeholder="请选择" clearable filterable>
            <el-option label="全部" value=""></el-option>
            <el-option label="待生效" value="1"></el-option>
            <el-option label="已生效" value="2"></el-option>
            <el-option label="已结束" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
          <el-button style="margin-left: 10px;" type="" @click="cleanto" plain
            >重置</el-button
          >
        </el-form-item>
        <div style="clear: both"></div>
      </el-form>
    </div>
    <div style="width: 100%;height: 1px;background:#DCDFE6 "></div>
    <div style="padding-top: 20px">
      <el-button
        v-if="options.length > 0"
        type="primary"
        size="medium"
        icon="el-icon-circle-plus-outline"
        @click="toNewTheme"
        >新建banner</el-button
      >
    </div>
    <div class="body">
      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column type="index" label="序号">
          <template slot-scope="scope">
            <div class="table-index">
              <div>
                {{ scope.$index + 1 }}
              </div>
              <div
                class="table-icon"
                v-if="scope.row.status == 1 || scope.row.status == 2"
              >
                <i
                  class="el-icon-arrow-up cursor"
                  @click="tabUp(scope.row, scope.$index)"
                ></i>
                <i
                  class="el-icon-arrow-down cursor"
                  @click="tabDown(scope.row, scope.$index)"
                ></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="广告" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div class="brand-text">
              <span style="padding-right: 10px">
                <img
                  style="width: 150px;height: 64px"
                  :src="scope.row.advertUrl"
                  alt=""
                />
              </span>
              <span>{{ scope.row.advertName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="throwType" label="投放范围" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.throwType === 'A'">公开</span>
            <span v-if="scope.row.throwType === 'C'">部分</span>
            <span v-if="scope.row.throwType === 'D'">部分</span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="有效期" width="300">
          <template slot-scope="scope">
            <span
              >{{ scope.row.startDate | date("yyyy-MM-dd hh:mm") }}至{{
                scope.row.endDate | date("yyyy-MM-dd hh:mm")
              }}</span
            >
            <span
              @click="editTime(scope.row)"
              style="color: #1989fa;padding-left: 8px;"
              class="editLive"
            >
              <i class="el-icon-edit"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="categoryName" label="状态" width="150">
          <template slot-scope="scope">
            <!--            <span v-if="scope.row.status === 1">草稿</span>-->
            <span v-if="scope.row.status === '1'">待生效</span>
            <span v-if="scope.row.status === '2'">已生效</span>
            <span v-if="scope.row.status === '3'">已结束</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
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
  </div>
</template>

<script lang="ts" src="./banner-list.ts"></script>
<style lang="scss">
.banner-list {
  .el-tabs__item {
    width: 110px !important;
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
.banner-list {
  padding: 24px 20px 20px 20px;
  .editLive {
    color: #1989fa;
    padding-left: 8px;
    cursor: pointer;
  }
  .header-form {
    padding-bottom: 6px;
    .title {
      position: relative;
      display: inline-block;
      margin-bottom: 24px;
      padding: 7px 30px 7px 50px;
      color: #303133;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      font-size: 16px;
      background: #f2f2f2;
      border-radius: 0 100px 100px 0;
      margin-left: -20px;

      &::before {
        content: "";
        position: absolute;
        top: 14px;
        left: 22px;
        width: 12px;
        height: 12px;
        background: #555555;
        transform: rotateZ(45deg);
      }
    }
    .el-row {
      margin-bottom: 15px;
      .text-right {
        text-align: right;
        .text-title {
          color: #606266;
        }
      }
      .text-content {
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
        .button-check {
          width: 88px;
          background: #ffffff;
          color: #409eff;
          border: 1px solid #409eff;
          border-radius: 0px 4px 4px 0px;
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
      .certificate-box {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        .certificate-left {
          text-align: right;
          font-size: 14px;
          color: #909399;
        }
        .certificate-right {
          font-size: 14px;
          color: #909399;
        }
        img {
          width: 216px;
          height: 147px;
        }
      }
      .text-img-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .layout-box {
          margin-right: 15px;
          img {
            width: 172px;
            height: 100px;
          }
        }
      }
    }
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

.title {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
  padding: 7px 30px 7px 50px;
  color: #303133;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  font-size: 16px;
  background: #f2f2f2;
  border-radius: 0 100px 100px 0;
  margin-left: -20px;

  &::before {
    content: "";
    position: absolute;
    top: 14px;
    left: 22px;
    width: 12px;
    height: 12px;
    background: #555555;
    transform: rotateZ(45deg);
  }
}
.el-dialog__body {
  padding: 0px;
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
