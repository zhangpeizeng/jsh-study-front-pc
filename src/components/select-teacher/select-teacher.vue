<template>
  <!--选择教师的弹出框-->
  <el-dialog title="选择讲师" :visible.sync="dialogSetting" width="60%">
    <div class="d-flex align-items-center" style="padding-bottom: 20px">
      <div class="pr-10">讲师</div>
      <div class="pr-10">
        <el-input
          size="mini"
          style="width: 200px"
          v-model="examName"
          placeholder="请输入名称/员工号"
        >
        </el-input>
      </div>
      <div class="pr-10">
        <el-button size="mini" type="primary" plain @click="paperList()"
          >查询</el-button
        >
      </div>
    </div>
    <div>
      <template>
        <el-table
          :data="paperListData"
          stripe
          fit
          highlight-current-row
          height="300"
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="100" />
          <el-table-column prop="accountName" label="讲师名称">
          </el-table-column>
          <el-table-column prop="huiHuiNumber" label="员工号">
          </el-table-column>
          <el-table-column prop="phone" label="讲师手机号"> </el-table-column>
          <el-table-column width="180" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="itemPaper.accountId === scope.row.accountId"
                size="mini"
                >已选择</el-button
              >
              <el-button
                v-else
                @click="selectPaper(scope.row)"
                size="mini"
                type="primary"
                >选择</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!--页面分页-->
      <div style="padding-top: 15px;text-align: center;" class="block">
        <el-pagination
          :current-page="currentChange"
          :page-size="10"
          layout="total, sizes, prev, pager, next,jumper"
          :total="listCount"
          :page-sizes="[10, 20, 50, 100]"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!--    <span slot="footer" class="dialog-footer">-->
    <!--      <div style="text-align: center">-->
    <!--        <el-button size="mini" class="cancle" @click="dialogSetting = false"-->
    <!--          >取 消</el-button-->
    <!--        >-->
    <!--        <el-button size="mini" class="primary" @click="confirmPaper()"-->
    <!--          >确 定</el-button-->
    <!--        >-->
    <!--      </div>-->
    <!--    </span>-->
  </el-dialog>
</template>

<script src="./select-teacher.ts"></script>

<style scoped lang="scss">
.tips {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 30px;
  img {
    width: 14px;
    height: 14px;
    vertical-align: middle;
  }
  span {
    margin-left: 5px;
    vertical-align: middle;
  }
}
.left {
  text-align: left;
}

.right {
  text-align: right;
}
</style>
<style scoped>
/deep/.el-dialog__body {
  padding: 0px 20px 30px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.cancle {
}

.primary {
  background: rgba(64, 158, 255, 1);
  border-radius: 4px;
  color: white;
}
</style>
