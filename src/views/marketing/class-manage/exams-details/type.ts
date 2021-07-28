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

export default {
  TERMINAL_TYPE,
  TERMINAL_CN_NAME
};
