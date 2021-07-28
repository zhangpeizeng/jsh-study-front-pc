<template>
  <div>
    <!--学习评定的弹出框-->
    <el-dialog
      @close="closeStudy"
      title="学习评定"
      width="500px"
      custom-class="public-dialog"
      :close-on-click-modal="false"
      :visible.sync="evaluateDialog"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学员:" class="mb-0">
          <div>{{ studentName }}</div>
        </el-form-item>
        <el-form-item label="学习评定" class="mb-0">
          <el-radio-group v-model="resultStatus">
            <el-radio style="width: 80px" :label="2">合格</el-radio>
            <el-radio :label="3">不合格</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="颁发证书" class="mb-0" v-if="resultStatus === 2">
          <el-radio-group v-model="isCertificate">
            <el-radio style="width: 80px" :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          prop="certificateBasePicUrl"
          label="证书底图"
          v-if="isCertificate === 1"
        >
          <div style="display: flex; align-items: start">
            <el-image
              style="width: 151px; height: 101px; margin-right: 15px"
              v-if="form.certificateBasePicUrl"
              :src="form.certificateBasePicUrl"
              fit="fill"
            >
              <el-input v-show="false" v-model="form.pic"></el-input>
            </el-image>
            <div class="certificate d-flex align-items-center">
              <!-- 上传图片 input -->
              <input
                type="file"
                ref="uploadImg"
                v-show="false"
                @change="uploadImg($event)"
              />
              <div class="certificate-pic" @click="picDialog = true">
                选择底图
              </div>
              <div>
                <span
                  class="certificate-pic"
                  @click="handleUploadImg('video', 0)"
                >
                  上传
                </span>
                <!--                            <img-->
                <!--                                    @click="showImg()"-->
                <!--                                    style="width: 14px;height: 14px"-->
                <!--                                    src="../../../../assets/images/icon-help.png"-->
                <!--                                    alt=""-->
                <!--                            />-->
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          prop="certificateName"
          label="证书名称"
          v-if="isCertificate === 1"
        >
          <el-input
            maxlength="20"
            v-model="form.certificateName"
            placeholder="请输入20字以内"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="certificateDesc"
          label="证书内容"
          v-if="isCertificate === 1"
        >
          <el-input
            maxlength="100"
            type="textarea"
            placeholder="请输入100字以内"
            v-model="form.certificateDesc"
          ></el-input>
        </el-form-item>
        <el-row :gutter="20" v-if="isCertificate === 1">
          <el-col :span="12" v-if="gradeList.length">
            <el-form-item label="等级">
              <el-select
                collapse-tags
                multiple
                filterable
                clearable
                v-model="grade"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gradeList"
                  :key="item.id"
                  :label="item.attributeName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="typeList.length">
            <el-form-item label="类型">
              <el-select
                collapse-tags
                multiple
                filterable
                clearable
                v-model="type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.attributeName"
                  :value="item.id"
                >
                </el-option>
              </el-select> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20" v-if="isCertificate === 1">
          <el-col :span="12" v-if="natureList.length">
            <el-form-item label="性质">
              <el-select
                collapse-tags
                multiple
                filterable
                clearable
                v-model="nature"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in natureList"
                  :key="item.id"
                  :label="item.attributeName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          prop="certificateCompany"
          label="发放单位"
          v-if="isCertificate === 1"
        >
          <el-input
            maxlength="13"
            placeholder="请输入13字以内"
            v-model="form.certificateCompany"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 表格 end -->
      <div class="text-center">
        <el-button size="mini" @click="evaluateDialog = false">取消</el-button>
        <el-button size="mini" type="primary" @click="confirm">确定</el-button>
        <el-button
          type="primary"
          plain
          size="mini"
          @click="previewCertificate"
          v-if="isCertificate === 1"
          >预览</el-button
        >
      </div>
    </el-dialog>

    <!--展示一个预览图片-->
    <el-dialog :visible.sync="previewImgDialog" width="50%">
      <div>
        <img style="width: 100%" :src="previewImageUrl" alt="" />
      </div>
    </el-dialog>

    <!--选择证书底图的弹出框-->
    <el-dialog title="选择底图" :visible.sync="picDialog" width="70%">
      <div>
        <div class="pic-item">
          <div
            @click="selectImg(item, index)"
            class="pic"
            v-for="(item, index) in imgList"
            :key="index"
          >
            <img :src="item.certificateUrl" alt="" />
            <div style="text-align: center; padding-top: 10px">
              <!--              <el-radio v-model="radio" :label="item.id">{{item.certificateName}}</el-radio>-->
              <el-radio-group v-model="radio">
                <el-radio :label="item.id">{{ item.certificateName }}</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <div style="text-align: center; padding-top: 20px">
            <el-button size="small" class="cancle" @click="picDialog = false"
              >取 消</el-button
            >
            <el-button
              size="small"
              type="primary"
              class="primary"
              @click="confirmImage()"
              >确 定</el-button
            >
          </div>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./study-evaluate.ts"></script>

<style scoped lang="scss">
.grid-content {
  text-align: right;
}
.certificate-pic {
  display: inline-block;
  cursor: pointer;
  margin-right: 10px;
  text-align: center;
  width: 80px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid rgba(64, 158, 255, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #409eff;
  line-height: 28px;
}
.pic-item {
  display: flex;
  justify-content: space-between;
  .active {
    border: 1px solid #00afdd;
  }
  img {
    width: 216px;
    height: 147px;
  }
}
.text-center {
  margin: 20px 0 0;
}
</style>
