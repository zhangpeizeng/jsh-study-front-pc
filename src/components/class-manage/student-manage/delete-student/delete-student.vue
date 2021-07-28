<template>
  <div>
    <el-row>
      <el-col :span="2"><div class="grid-content bg-purple">学员:</div></el-col>
      <el-col :span="18"
        ><div class="grid-content bg-purple">{{ studentName }}</div></el-col
      >
    </el-row>
    <!-- 表格 end -->

    <div slot="footer" class="text-center mt-30">
      <el-button size="mini" @click="$emit('cancel')">取消</el-button>
      <el-button size="mini" type="primary" @click="confirm">确定</el-button>
    </div>
  </div>
</template>

<script src="./delete-student.ts"></script>

<style scoped></style>
