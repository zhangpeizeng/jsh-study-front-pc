/**
 *@desc: 班级详情所需type
 *@date: 2021-14-04 11:30:57
 */

// 班级状态type
enum CLASS_STATE_TYPE {
  DRAFT = 1, // 草稿
  BEFORE_CLASS, // 未开始
  CLASS_IN_PROGRESS, // 进行中
  END_OF_COURSE, // 已结课
  END_OF_CLASS, // 已结班
  CLASS_INTERRUPT // 已停班
}
// 班级状态中文名称
const CLASS_STATE_CN_NAME: string[] = [
  "",
  "草稿",
  "未开始",
  "进行中",
  "已结课",
  "已结班",
  "已停班"
];

// 终端type
enum TERMINAL_TYPE {
  CLIENT = 1, // 客户端
  STAFF, // 员工端
  DIRECT_SELLER, // 直销员端
  POST_SALE // 售后端
}

// 终端中文名称
const TERMINAL_CN_NAME: string[] = [
  "",
  "客户端",
  "员工端",
  "直销员端",
  "售后端"
];

enum COURSE_TYPE {
  RECORD_BROADCAT_DOC = 1,
  DIRECT_SEEDING, // 直播课
  DISCUSS, // 研讨课
  SERIES // 系列课
}

export default {
  CLASS_STATE_TYPE,
  CLASS_STATE_CN_NAME,
  TERMINAL_TYPE,
  TERMINAL_CN_NAME,
  COURSE_TYPE
};
