<template>
  <!--选择试卷的弹出框-->
  <el-dialog title="课型介绍" :visible.sync="dialogSetting" width="60%">
    <div class="course-introduction">
      <div class="content">
        营销学院可创建录播/文档课、直播课、研讨课和系列课四种课程类型，可根据自身需要，在营销学院管理端创建。
      </div>
      <div class="title">
        1、录播/文档课
      </div>
      <div class="content">
        录播/文档课的学习内容更加丰富，可以将音视频或文档设置为课程，且课程内容没有数量限制，可供学员进行自主学习。
      </div>
      <div class="title">
        2、直播课
      </div>
      <div class="content">
        直播课支持选择PC或APP两种讲师直播方式，适合大型直播、演讲、培训，其中课程一旦上架，直播方式不可更改。
      </div>
      <div class="title">
        (1)PC直播方式：
      </div>
      <div class="content">
        支持讲师或嘉宾同时与1名学员进行音视频互动，其他学员观看数量不受限制。通过营销学院管理端分享的课堂地址和身份口令，讲师、嘉宾、助理、督课角色用户可对应进入课堂。
      </div>
      <div class="des">
        【讲师】支持1名讲师
      </div>
      <div class="content">
        讲师进入讲师端，点击【上课】后，课堂直播正式开始，这时学员端就可以收看讲师的授课。上课中讲师拥有最高管理权限：可以进行文档演示、白板板书、点名等操作；可以根据授课需要，操作学员轮流上麦；讲师还可以对课程中的讨论、成员和公告进行管理，以控制课堂秩序。
      </div>
      <div class="des">
        【嘉宾】支持3名嘉宾
      </div>
      <div class="content">
        嘉宾端提供嘉宾单纯授课功能，不处理与授课无关的讨论、成员、公告等操作。嘉宾进入房间后，可以查看讲师的授课情况。讲师邀请嘉宾上麦后，嘉宾便拥有了授课的权限，可以使用课堂工具，例如文档演示、白板板书等。
      </div>
      <div class="des">【助理】无限制数量</div>
      <div class="content">
        指定助理进入助理端，这样讲师可以只关注授课本身，而让助理处理讨论聊天、成员管理等维护课堂秩序的工作等操作。
      </div>
      <div class="des">
        【督课】支持3名督课
      </div>
      <div class="content">
        督课端可以无痕迹进入课堂，正在上课的讲师和学员均无法察觉。督课身份的设置方便了解课程中的情况，监督授课质量。
      </div>
      <div class="title">
        (2)APP直播方式：
      </div>
      <div class="content">
        直播更灵活，仅可进行聊天互动，无其他功能及直播角色参与。
      </div>
      <div class="title">
        3、 研讨课
      </div>
      <div class="content">
        研讨课适合多人面对面讨论，最多支持4名学员参与音视频连麦互动，其他观看学员数量不限制。通过营销学院管理端分享的课堂地址和身份口令，讲师、助理、督课角色用户可对应进入课堂。
      </div>
      <div class="des">
        【讲师】支持1名讲师
      </div>
      <div class="content">
        讲师进入讲师端，点击【上课】后，课堂直播正式开始，这时学员端就可以收看讲师的授课。上课中讲师拥有最高管理权限：可以进行文档演示、白板板书、点名等操作；可以根据授课需要，操作学员轮流上麦；讲师还可以对课程中的讨论、成员和公告进行管理，以控制课堂秩序。
      </div>
      <div class="des">
        【助理】无限制数量
      </div>
      <div class="content">
        指定助理进入助理端，这样讲师可以只关注授课本身，而让助理处理讨论聊天、成员管理等维护课堂秩序的工作等操作。
      </div>
      <div class="des">
        【督课】支持3名督课
      </div>
      <div class="content">
        督课端可以无痕迹进入课堂，正在上课的讲师和学员均无法察觉。督课身份的设置方便了解课程中的情况，监督授课质量。
      </div>
      <div class="title">
        4、 系列课
      </div>
      <div class="content">
        系列课不限授课方式，可以添加多个不同课型的课时，或添加音视频、文档资料。通过创建系列课，可以将相同主题的课时进行打包，为学员提供完整的、成体系的学习方案。
      </div>
    </div>
  </el-dialog>
</template>

<script src="./course-introduction.ts"></script>

<style scoped lang="scss">
.course-introduction {
  height: 400px;
  overflow: auto;
  .title {
    color: black !important;
    padding: 10px 0px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 500;
    color: rgba(96, 98, 102, 1);
  }
  .des {
    padding: 10px 0px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(96, 98, 102, 1);
  }
  .content {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(96, 98, 102, 1);
  }
}
</style>
<style scoped></style>
