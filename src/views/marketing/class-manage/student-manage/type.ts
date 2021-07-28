// 学员状态
const STATUE_LIST = [
  {
    labelName: "报名待审核",
    labelCode: 1
  },
  {
    labelName: "报名审核通过",
    labelCode: 2
  },
  {
    labelName: "报名审核驳回",
    labelCode: 3
  },
  {
    labelName: "待学员确认",
    labelCode: 4
  },
  {
    labelName: "学员已拒绝",
    labelCode: 5
  },
  {
    labelName: "已加入",
    labelCode: 6
  },
  // {
  //   labelName: "已移除",
  //   labelCode: 7
  // },
  {
    labelName: "待老师评定",
    labelCode: 9
  },
  {
    labelName: "老师已评定",
    labelCode: 10
  }
];
//学生来源列表
const SOURCE_LIST = [
  {
    labelName: "自主报名",
    labelCode: 1
  },
  {
    labelName: "邀请加入",
    labelCode: 2
  }
];

// 班级状态type
enum CLASS_STATE_TYPE {
  DRAFT = 1, // 草稿
  BEFORE_CLASS, // 未开始
  CLASS_IN_PROGRESS, // 进行中
  END_OF_COURSE, // 已结课
  END_OF_CLASS, // 已结班
  CLASS_INTERRUPT // 已停班
}

// 评定状态 对应后端数据studyStatus
enum ASSESSMENT_STATUS {
  TO_BE_EVALUATED_BY_TEACHER = 1,
  QUALIFIED,
  UN_QUALIFIED
}

const ASSESSMENT_STATUS_CN_NAME = ["", "", "合格", "不合格"];

// 1-报名待审核，2-审核通过，3-审核驳回，4-待确认，5-已拒绝，6-已加入，9-待评定，10-已评定
enum CLASS_STUDENT_STATUS {
  REFISTRATION_TO_BE_APPROVED = 1, // 报名待审核
  REFISTRATION_APPROVED, // 报名审核通过
  REFISTRATION_REVIEW_REJECTED, // 报名审核驳回
  TO_BE_CONFIRMED_BY_STUDENT, // 待学员确认
  STUDENT_REJECTED, // 学员已拒绝
  JOINED, // 已加入
  REMOVED, // 已移除
  UNINTERESTED, // 不感兴趣
  TO_BE_EVALUATED_BY_TEACHER,
  EVALUATED_BY_TEACHER
}

// 学员状态中文名称
const CLASS_STUDENT_STATUS_CN_NAME = [
  "",
  "报名待审核",
  "报名审核通过",
  "报名审核驳回",
  "待学员确认",
  "学员已拒绝",
  "已加入",
  "已移除",
  "不感兴趣",
  "待老师评定",
  "老师已评定"
];

// 终端type
enum TERMINAL_TYPE {
  CLIENT = 1, // 客户端
  STAFF, // 员工端
  DIRECT_SELLER, // 直销员端
  POST_SALE // 售后端
}

export default {
  STATUE_LIST,
  SOURCE_LIST,
  CLASS_STATE_TYPE,
  TERMINAL_TYPE,
  CLASS_STUDENT_STATUS,
  CLASS_STUDENT_STATUS_CN_NAME,
  ASSESSMENT_STATUS,
  ASSESSMENT_STATUS_CN_NAME
};
