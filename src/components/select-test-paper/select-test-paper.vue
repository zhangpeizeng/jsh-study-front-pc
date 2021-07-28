<template>
  <!--选择试卷的弹出框-->
  <el-dialog
    title="选择试卷"
    :visible.sync="dialogSetting"
    :close-on-click-modal="false"
    append-to-body
    width="60%"
  >
    <div class="d-flex align-items-center" style="padding-bottom: 20px">
      <div class="pr-10">试卷名称</div>
      <div class="pr-10">
        <el-input
          size="mini"
          style="width: 200px"
          v-model="examName"
          placeholder="请输入"
        >
        </el-input>
      </div>
      <div class="pr-10">
        <el-button size="mini" type="primary" plain @click="paperList()"
          >查询</el-button
        >
      </div>
      <div style="color: #f56c6c; font-size: 12px">
        <img src="../../assets/images/icon-tips.png" alt="" />
        新增试卷后请于10分钟后重新查询~
      </div>
    </div>
    <div>
      <el-button @click="newPaper()" size="small" type="primary"
        >新建</el-button
      >
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
          <el-table-column
            type="index"
            label="序号"
            width="100"
            align="center"
          />
          <el-table-column prop="name" label="试卷名称"> </el-table-column>
          <el-table-column prop="beginDate" label="创建时间"> </el-table-column>
          <el-table-column width="180" label="操作">
            <template slot-scope="scope">
              <el-button @click="preview(scope.row.viewUrl)" size="mini"
                >预览</el-button
              >
              <el-button v-if="itemPaper.qid === scope.row.qid" size="mini"
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
      <div style="padding-top: 15px; text-align: center" class="block">
        <el-pagination
          :current-page="currentChange"
          :page-size="10"
          layout="total, sizes, prev, pager, next,jumper"
          :total="listCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <div style="text-align: center">
        <el-button size="mini" class="cancle" @click="dialogSetting = false"
          >取 消</el-button
        >
        <el-button size="mini" class="primary" @click="confirmPaper()"
          >确 定</el-button
        >
      </div>
    </span>
  </el-dialog>
</template>

<script src="./select-test-paper.ts"></script>

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
