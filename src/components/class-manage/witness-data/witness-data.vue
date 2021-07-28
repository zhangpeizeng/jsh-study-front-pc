<template>
  <div style="padding: 0 20px;">
    <el-table :data="tableData" v-loading="loading" height="570">
      <el-table-column type="index" label="序号" min-width="50px">
      </el-table-column>
      <el-table-column label="上传人" width="190px">
        <template slot-scope="scope">
          <span
            >{{ scope.row.operatorName }}({{ scope.row.operatorCode }})</span
          >
        </template>
      </el-table-column>
      <el-table-column label="上传时间" min-width="120px">
        <template slot-scope="scope">
          <span v-if="scope.row.createTime">
            {{ scope.row.createTime | date("yyyy-MM-dd hh:mm") }}
          </span>
          <span v-if="!scope.row.createTime">
            -
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="left" min-width="100px">
        <template slot-scope="scope">
          <div style="position: relative;">
            <span
              class="cursor-pointer"
              style="color:#1989FA;margin-right:20px"
              @click="toView(scope.row)"
              >查看</span
            >
            <span
              class="cursor-pointer"
              style="color:#1989FA"
              @click="toDel(scope.row)"
              >删除</span
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;margin-top:20px">
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
      title="图片预览"
      :visible.sync="dialogData"
      width="30%"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="public-dialog"
    >
      <el-image
        v-if="dialogData && srcList.length > 0"
        class="witness-img"
        style="width: 100%"
        :src="srcList[0]"
        :preview-src-list="srcList"
      >
      </el-image>
      <div slot="footer" class="text-center">
        <el-button @click="dialogData = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" src="./witness-data.ts" />
<style lang="scss"></style>
