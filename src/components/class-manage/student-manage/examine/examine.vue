<template>
  <div>
    <el-row class="pb-15" :gutter="20">
      <el-col :span="4"><div class="grid-content bg-purple">学员:</div></el-col>
      <el-col :span="18"
        ><div>{{ studentName }}</div></el-col
      >
    </el-row>
    <el-row class="pb-15" :gutter="20">
      <el-col :span="4"
        ><div class="grid-content bg-purple">审核结果</div></el-col
      >
      <el-col :span="18">
        <el-radio-group v-model="resultStatus">
          <el-radio :label="2">通过</el-radio>
          <el-radio :label="3">驳回</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4"
        ><div class="grid-content bg-purple">
          <span style="color: red" v-if="resultStatus === 3">*</span>
          说明
        </div></el-col
      >
      <el-col :span="18">
        <el-input
          type="textarea"
          maxlength="150"
          :rows="4"
          placeholder="最多输入150个字"
          v-model="examineDesc"
        >
        </el-input>
      </el-col>
    </el-row>
    <!-- 表格 end -->

    <div slot="footer" class="text-center mt-30">
      <el-button size="mini" @click="$emit('cancel')">取消</el-button>
      <el-button size="mini" type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script src="./examine.ts"></script>

<style scoped lang="scss">
.grid-content {
  text-align: right;
}
</style>
