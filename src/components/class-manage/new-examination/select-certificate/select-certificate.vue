<template>
  <div class="select-certificate">
    <!--展示一个大图片-->
    <el-dialog :visible.sync="dialogImg" width="50%">
      <div>
        <img
          style="width: 100%"
          src="@/assets/images/certificateImg.png"
          alt=""
        />
      </div>
    </el-dialog>
    <!--展示一个预览图片-->
    <el-dialog append-to-body :visible.sync="previewImg" width="50%">
      <div>
        <img style="width: 100%" :src="previewImageUrl" alt="" />
      </div>
    </el-dialog>
    <!--选择证书底图的弹出框-->
    <el-dialog
      append-to-body
      title="选择底图"
      :visible.sync="dialog"
      width="70%"
    >
      <div>
        <div class="pic-item">
          <div
            @click="selectImg(item, index)"
            class="pic"
            v-for="(item, index) in imgList"
            :key="index"
          >
            <img :src="item.certificateUrl" alt="" />
            <div style="text-align: center;padding-top: 10px">
              <!--              <el-radio v-model="radio" :label="item.id">{{item.certificateName}}</el-radio>-->
              <el-radio-group v-model="radio">
                <el-radio :label="item.id">{{ item.certificateName }}</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <div style="text-align: center;padding-top: 20px">
            <el-button class="cancle" @click="dialog = false">取 消</el-button>
            <el-button class="primary" @click="confirmImage()">确 定</el-button>
          </div>
        </span>
      </div>
    </el-dialog>
    <!--证书编辑的弹出框-->
    <el-dialog
      append-to-body
      title="证书编辑"
      :visible.sync="dialogSetting"
      width="530px"
    >
      <el-tabs v-if="codeNum === 1" v-model="isType" @tab-click="handleClick">
        <el-tab-pane label="自定义" name="1" />
        <el-tab-pane label="选择" name="2" />
      </el-tabs>
      <div v-show="isType === '1'">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-form-item prop="certificateBasePicUrl" label="证书底图">
            <div style="display: flex;align-items: start">
              <el-image
                style="width: 151px; height: 101px;margin-right: 15px"
                v-if="form.certificateBasePicUrl"
                :src="form.certificateBasePicUrl"
                fit="fill"
              >
                <el-input v-show="false" v-model="form.pic"></el-input>
              </el-image>
              <div class="certificate">
                <!-- 上传图片 input -->
                <input
                  type="file"
                  ref="uploadImg"
                  v-show="false"
                  @change="uploadImg($event)"
                />
                <div class="certificate-pic" @click="dialog = true">
                  选择底图
                </div>
                <div>
                  <span
                    class="certificate-pic"
                    @click="handleUploadImg('video', 0)"
                  >
                    上传
                  </span>
                  <img
                    @click="showImg()"
                    style="width: 14px;height: 14px"
                    src="@/assets/images/icon-help.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="certificateName" label="证书名称">
            <el-input
              maxlength="20"
              v-model="form.certificateName"
              placeholder="请输入20字以内"
            ></el-input>
          </el-form-item>
          <el-form-item prop="certificateDesc" label="证书内容">
            <el-input
              maxlength="100"
              type="textarea"
              placeholder="请输入100字以内"
              v-model="form.certificateDesc"
            ></el-input>
          </el-form-item>
          <el-row v-if="codeNum === 1 && studyTerminals === '4'" :gutter="20">
            <el-col :span="12">
              <el-form-item label="等级">
                <el-select
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
            <el-col :span="12">
              <el-form-item label="类型">
                <el-select
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
          <el-row v-if="codeNum === 1 && studyTerminals === '4'" :gutter="20">
            <el-col :span="12">
              <el-form-item label="性质">
                <el-select
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
          <el-form-item prop="certificateCompany" label="发放单位">
            <el-input
              maxlength="13"
              placeholder="请输入13字以内"
              v-model="form.certificateCompany"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="isSelect" v-show="isType === '2'">
        <el-row :gutter="20">
          <el-col style="text-align:right" :span="4">
            证书选择
          </el-col>
          <el-col :span="12">
            <div class="certificate-pic" @click="openNewSelectCertificate">
              选择证书
            </div>
          </el-col>
        </el-row>
        <div v-if="form2.certificateName">
          <el-row :gutter="20">
            <el-col style="text-align:right" :span="4">
              证书名称
            </el-col>
            <el-col :span="12">
              <div style="font-size: 14px;color: #909399;">
                {{ form2.certificateName }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col style="text-align:right" :span="4">
              证书编码
            </el-col>
            <el-col :span="12">
              <div style="font-size: 14px;color: #909399;">
                {{ form2.certificateCode }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col style="text-align:right" :span="4">
              证书内容
            </el-col>
            <el-col :span="12">
              <div style="font-size: 14px;color: #909399;">
                {{ form2.certificateDesc }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col style="text-align:right" :span="4">
              等级
            </el-col>
            <el-col :span="12">
              <div style="font-size: 14px;color: #909399;">
                {{ levelStr }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col style="text-align:right" :span="4">
              类型
            </el-col>
            <el-col :span="12">
              <div style="font-size: 14px;color: #909399;">
                {{ typeStr }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col style="text-align:right" :span="4">
              性质
            </el-col>
            <el-col :span="12">
              <div style="font-size: 14px;color: #909399;">
                {{ natureStr }}
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col style="text-align:right" :span="4">
              发放单位
            </el-col>
            <el-col :span="12">
              <div style="font-size: 14px;color: #909399;">
                {{ form2.certificateCompany }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div style="text-align: center">
          <el-button class="cancle" @click="dialogSetting = false"
            >取 消</el-button
          >
          <el-button class="primary" @click="confirm()">确 定</el-button>
          <el-button class="preview" @click="previewCertificate()"
            >预 览</el-button
          >
        </div>
      </span>
    </el-dialog>
    <!--    选择证书-->
    <el-dialog
      append-to-body
      title="选择证书"
      :visible.sync="dialogSelect"
      width="60%"
    >
      <NewSelectCertificate
        ref="NewSelectCertificate"
        :selectObj="form2"
        @confirm="confirmPopup"
        @cancel="dialogSelect = false"
      ></NewSelectCertificate>
    </el-dialog>
  </div>
</template>

<script src="./select-certificate.ts"></script>

<style scoped lang="scss">
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
.certActive {
  display: block !important;
  div {
    margin-top: 10px;
  }
}
.certificate {
  display: flex;
  align-items: center;
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
  .symbol {
    width: 14px;
    height: 14px;
    color: #606266;
    line-height: 14px;
    text-align: center;
  }
}
.isSelect {
  min-height: 380px;
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
}
</style>
<style scoped>
.el-button {
  padding: 6px 10px;
  border-radius: 4px;
}

.cancle {
}

.primary {
  background: rgba(64, 158, 255, 1);
  border-radius: 4px;
  color: white;
}
.preview {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(25, 137, 250, 1);
  background: rgba(230, 241, 252, 1);
  border-radius: 4px;
  border: 1px solid rgba(163, 208, 253, 1);
}
</style>
<style lang="scss">
.select-certificate {
  .el-dialog__body {
    padding: 0px 20px 5px 20px;
  }
  .el-tabs__item {
    font-weight: 600;
    width: 90px;
    text-align: center;
  }
  .isSelect {
    .el-row {
      margin-bottom: 15px;
    }
  }
  .el-form-item {
    margin-bottom: 15px;
  }
}
</style>
