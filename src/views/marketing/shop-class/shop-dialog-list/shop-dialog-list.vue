<template>
  <div class="brand-list-to">
    <div class="body">
      <el-table
        :data="tableData"
        header-cell-class-name="table-header-cell"
        stripe
      >
        <el-table-column type="index" label="角色" width="80px">
          <template slot-scope="scope">
            <!--1-讲师，2-学生，3-助理，4-嘉宾，5-督课-->
            <span v-if="scope.row.identityType === '1'">讲师</span>
            <span v-if="scope.row.identityType === '2'">学生</span>
            <span v-if="scope.row.identityType === '3'">助理</span>
            <span v-if="scope.row.identityType === '4'">嘉宾</span>
            <span v-if="scope.row.identityType === '5'">督课</span>
          </template>
        </el-table-column>
        <el-table-column label="上课地址">
          <template slot-scope="scope">
            <span>{{ scope.row.liveUrl }}</span>
            <!--<span style="color: #409EFF;padding-left: 10px;">复制</span>-->
          </template>
        </el-table-column>
        <el-table-column label="" width="60px" align="left">
          <template slot-scope="scope">
            <span
              style="color: #409EFF;margin-left: -10px;cursor: pointer"
              @click="copyyaocode(scope.row.liveUrl)"
              >复制</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="name" label="口令" width="120px">
          <template slot-scope="scope">
            <span>
              {{ scope.row.identityPassword }}
            </span>
            <span
              style="color: #409EFF;padding-left: 10px;cursor: pointer"
              @click="copyyaocode(scope.row.identityPassword)"
              >复制</span
            >
            <!--<span style="color: #C0C4CC;padding-left: 10px;">重置</span>--> </template
          >r
        </el-table-column>
        <el-table-column
          label="操作"
          align="right"
          style="min-width: 220px;"
          width="180px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="gotodetail(scope.row)"
            >
              进入课程
            </el-button>
            <el-button size="mini" @click="copyyaoqing(scope.row)" plain>
              邀请
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" src="./shop-dialog-list.ts"></script>

<style lang="scss" scoped>
.brand-list-to {
  /*padding: 24px 20px 20px 20px;*/
  font-size: 14px;
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
    }

    .el-pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
