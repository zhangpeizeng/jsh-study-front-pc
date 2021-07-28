<template>
  <div class="brand-list">
    <div class="header-form">
      <div class="title">基本信息</div>
      <!--课程名称-->
      <el-row type="flex" align="top" :gutter="10" class="el-row">
        <el-col :span="2" class="text-right">
          <span class="text-title">主题名称:</span>
        </el-col>
        <el-col :span="5">
          <span class="text-title">{{ classifyName }}</span>
          <el-tag size="mini" style="margin-left: 10px;" v-if="statusany == '1'"
            >已上架</el-tag
          >
          <el-tag size="mini" style="margin-left: 10px;" v-if="statusany == '0'"
            >已下架</el-tag
          >
        </el-col>
        <el-col :span="3" class="text-right">
          <span class="text-title">所属学习终端:</span>
        </el-col>
        <el-col :span="8">
          <span class="text-title">{{ studyTerminalName }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="title">课程信息</div>
    <div class="body">
      <el-table
        :data="tableData"
        v-loading="loading"
        header-cell-class-name="table-header-cell"
      >
        <el-table-column type="index" label="序号" width="100px">
          <template slot-scope="scope">
            <div class="table-index">
              <div>
                {{ scope.$index + 1 }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课程名称">
          <template slot-scope="scope">
            <div class="brand-text">
              <el-tooltip
                class=" "
                :content="scope.row.courseName"
                placement="top"
              >
                <span>{{ scope.row.courseName }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="nameEn" label="讲师" width="150px">
          <template slot-scope="scope">
            <span v-if="scope">
              {{ scope.row.lecturerName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="categoryName"
          width="200px"
          align="center"
          label="课程状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">草稿</span>
            <span v-if="scope.row.status === 2">已上架</span>
            <span v-if="scope.row.status === 3">已下架</span>
          </template>
        </el-table-column>
        <el-table-column prop="nameEn" label="学习时间">
          <template slot-scope="scope">
            <span v-if="scope.row.studyStartTime || scope.row.studyEndTime">
              {{ scope.row.studyStartTime | date("yyyy-MM-dd hh:mm") }}至{{
                scope.row.studyEndTime | date("yyyy-MM-dd hh:mm")
              }}
            </span>
            <span v-if="!scope.row.studyStartTime && !scope.row.studyEndTime">
              -
            </span>
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
    <!-- 底部按钮 end -->
    <div class="footer-bottom-container">
      <template>
        <el-button size="mini" @click="closeto()">关闭</el-button>
        <!--  仅已下架的状态显示删除 -->
        <el-button size="mini" v-if="statusany === 0" @click="deleteclass"
          >删除</el-button
        >
        <el-button type="primary" size="mini" @click="xiugai">
          修改
        </el-button>
        <el-button
          type="primary"
          plain
          size="mini"
          v-show="statusany === 0"
          @click="upstaus(1)"
          >上架</el-button
        >
        <el-button
          type="primary"
          plain
          size="mini"
          v-show="statusany === 1"
          @click="upstaus(0)"
          >下架</el-button
        >
      </template>
    </div>
  </div>
</template>

<script lang="ts" src="./theme-detail.ts"></script>

<style lang="scss" scoped>
.brand-list {
  padding: 24px 20px 20px 20px;

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
  .cursor {
    cursor: pointer;
  }
}
</style>
