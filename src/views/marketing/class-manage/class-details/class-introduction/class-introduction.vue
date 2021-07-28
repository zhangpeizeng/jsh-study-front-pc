<!--
@desc：班级描述
@date: 2021-04-06 14:01:34
-->
<template>
  <div class="class-introduction">
    <div class="class-introduction_title-box">
      <!-- 班级名称 -->
      <el-tooltip
        effect="dark"
        :content="classBasicInfo.className"
        placement="top-start"
        show-overflow-tooltip="true"
      >
        <div class="class-introduction_title inline-block ellipsis">
          {{ classBasicInfo.className }}
        </div>
      </el-tooltip>
      <!-- 班级状态：草稿，未开班，进行中，已结课，已结班，已停班-->
      <span class="class-introduction_state blue-style inline-block">
        {{ CLASS_STATE_CN_NAME[classBasicInfo.status] }}
      </span>
    </div>
    <div class="class-introduction_time-box">
      <!-- 学习终端 -->
      <span class="class-introduction_tag-end inline-block">
        {{ TERMINAL_CN_NAME[classBasicInfo.terminalCode] }}
      </span>
      <!-- 一级分类 -->
      <!-- <span
        class="class-introduction_primary-classification blue-style inline-block"
      >
        {{ classBasicInfo.classifyName }}
      </span> -->
      <!-- 班级时间 -->
      <span class="class-introduction_time blue-style inline-block">
        班级时间：{{ classBasicInfo.classStartTime | date("yyyy-MM-dd") }}至{{
          classBasicInfo.classEndTime | date("yyyy-MM-dd")
        }}
      </span>
    </div>
    <div class="class-introduction_teacher-box">
      <!-- 班主任 -->
      <div class="class-introduction_teacher-headmaster inline-block">
        <!-- 班主任头像 -->
        <img
          class="class-introduction_teacher-icon inline-block"
          src="@/assets/images/default_avatar.png"
          alt=""
        />
        <!-- 班主任姓名 -->
        <div class="class-introduction_teacher-des inline-block">
          <div class="class-introduction_teacher-name">
            {{ classBasicInfo.lecturerName }}
          </div>
          <div class="class-introduction_teacher-name">班主任</div>
        </div>
      </div>
      <!-- 辅导员 -->
      <div class="class-introduction_teacher-instructor inline-block">
        <!-- 辅导员头像 -->
        <div class="class-introduction_teacher-icon-box inline-block">
          <img
            v-if="(classBasicInfo.assistantNames || '').split('、').length > 2"
            class="class-introduction_teacher-icon teacher-icon_one"
            src="@/assets/images/default_avatar.png"
            alt=""
          />
          <img
            v-if="(classBasicInfo.assistantNames || '').split('、').length > 1"
            class="class-introduction_teacher-icon teacher-icon_second"
            src="@/assets/images/default_avatar.png"
            alt=""
          />
          <img
            class="class-introduction_teacher-icon teacher-icon_three"
            src="@/assets/images/default_avatar.png"
            alt=""
          />
        </div>
        <!-- 辅导员姓名 -->
        <div class="class-introduction_teacher-des inline-block">
          <el-tooltip
            effect="dark"
            :content="classBasicInfo.assistantNames"
            placement="top-start"
            show-overflow-tooltip="true"
          >
            <div class="class-introduction_teacher-name ellipsis">
              {{ classBasicInfo.assistantNames }}
            </div>
          </el-tooltip>
          <div
            class="class-introduction_teacher-name-link"
            @click="openCounselorManagement"
          >
            {{ `辅导员(${classBasicInfo.assistantCount}人)` }}
          </div>
        </div>
      </div>
    </div>
    <!-- 见证资料 -->
    <div class="class-introduction_materiel-box">
      <div class="class-introduction_materiel inline-block">
        <span class="inline-block">见证资料</span>
        <el-tooltip class=" " content="需要归档的班级资料" placement="bottom">
          <img
            class="class-introduction_materiel-icon inline-block"
            src="@/assets/images/safequsetion.png"
            alt=""
          />
        </el-tooltip>

        <span class="inline-block">：</span>
        <!-- 文件数量 -->
        <span
          class="class-introduction_materiel-num inline-block"
          @click="viewClassMaterial"
        >
          {{ classBasicInfo.classDataCount }}
        </span>
      </div>
      <!-- 上传按钮 -->
      <classUpload
        class="class-introduction_materiel-upload-btn"
        @file="uploadMateriel"
      ></classUpload>
    </div>
    <!-- 见证资料抽屉 -->
    <el-drawer
      title="见证资料"
      :visible.sync="materielDrawerCor"
      direction="rtl"
      size="40%"
      :close-on-press-escape="false"
      :show-close="true"
      :wrapperClosable="false"
      custom-class="public-drawer"
    >
      <witness-data
        :classId="Number(classId)"
        v-if="materielDrawerCor"
        @close="drawerCloseCor"
      >
      </witness-data>
    </el-drawer>
  </div>
</template>

<script lang="ts" src="./class-introduction.ts"></script>

<style lang="scss" scoped>
.class-introduction {
  .inline-block {
    display: inline-block;
    vertical-align: top;
  }
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .blue-style {
    height: 20px;
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
    padding: 4px 7px;
    color: #409eff;
    background: #ecf5ff;
    border: 1px solid #409eff;
    box-sizing: border-box;
  }
  .class-introduction_title-box {
    height: 28px;
    overflow: hidden;
    .class-introduction_title {
      max-width: 400px;
      height: 28px;
      font-size: 20px;
      font-weight: 400;
      color: #000000;
      line-height: 28px;
    }
    .class-introduction_state {
      margin: 4px 0;
    }
  }
  .class-introduction_time-box {
    height: 20px;
    overflow: hidden;
    margin: 10px 0 15px;
    .class-introduction_tag-end {
      padding: 0 7px;
      height: 20px;
      background: #409eff;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      color: #ffffff;
      line-height: 20px;
      margin-right: 10px;
    }
    .class-introduction_time {
      margin-left: 10px;
      color: #c0c4cc;
      background: #f5f7fa;
      border: 1px solid #909399;
    }
  }
  .class-introduction_teacher-box {
    .class-introduction_teacher-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
    .class-introduction_teacher-des {
      padding: 1px 0;
      margin-left: 8px;
    }
    .class-introduction_teacher-name {
      width: 36px;
      height: 17px;
      font-size: 12px;
      font-weight: 400;
      color: #606266;
      line-height: 17px;
    }
    .class-introduction_teacher-headmaster {
      width: 152px;
    }
    .class-introduction_teacher-instructor {
      .class-introduction_teacher-icon-box {
        width: 68px;
        position: relative;
        .class-introduction_teacher-icon {
          position: absolute;
          &.teacher-icon_second {
            left: 16px;
          }
          &.teacher-icon_three {
            left: 32px;
          }
        }
      }
      .class-introduction_teacher-des {
        .class-introduction_teacher-name {
          display: inline-block;
          width: auto;
          max-width: 120px;
        }
        .class-introduction_teacher-name-link {
          height: 14px;
          font-size: 12px;
          font-weight: 400;
          color: #1989fa;
          line-height: 14px;
          margin-top: 2px;
          cursor: pointer;
        }
      }
    }
  }
  .class-introduction_materiel-box {
    margin-top: 15px;
    .class-introduction_materiel {
      height: 20px;
      font-size: 14px;
      font-weight: 400;
      color: #606266;
      line-height: 20px;
      .class-introduction_materiel-icon {
        width: 14px;
        height: 14px;
        margin: 3px;
      }
      .class-introduction_materiel-num {
        color: #409eff;
        cursor: pointer;
      }
    }
    .class-introduction_materiel-upload-btn {
      display: inline-block;
      margin-left: 20px;
    }
  }
}
</style>
