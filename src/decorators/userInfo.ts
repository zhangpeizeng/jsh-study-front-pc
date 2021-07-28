/**
 * 获取用户信息的装饰器 在实例初始化时赋值
 *
 * 使用方式:
 * @UserInfo
 * userInfo!:UserInfoData;
 *
 * @UserInfo()
 * userInfo!:UserInfoData;
 *
 * @UserInfo('id')
 * userId!:number;
 */

/**
 * 取userInfo上指定属性值或userInfo值
 * @param target
 * @param {string} prop
 * @constructor
 */
function UserInfo(target: any, prop: string): void;
/**
 * 取整个userInfo值
 * @param {string} key
 * @returns {(target: any, prop: string) => void}
 * @constructor
 */
function UserInfo(key?: string): (target: any, prop: string) => void;
/**
 * 装饰器实现
 * @param keyOrTarget
 * @param prop
 * @returns {any}
 * @constructor
 */
function UserInfo(keyOrTarget?: any, prop?: any): any {
  const userInfo = localStorage.getItem("userInfo") as string;
  if (!!keyOrTarget && typeof keyOrTarget !== "string") {
    keyOrTarget[prop] = JSON.parse(userInfo);
  } else {
    return function(target: any, prop: string) {
      const userInfoData: UserInfoData = JSON.parse(userInfo);
      if (!keyOrTarget) {
        target[prop] = userInfoData;
      } else {
        target[prop] = userInfoData[keyOrTarget];
      }
    };
  }
}

interface Member {
  id: number;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
}
interface UserInfoData {
  id: number;
  userName: string;
  userPhone: string;
  userNick: string;
  userEmail: string;
  userIp: string;
  wxName: string;
  userType: string;
  member: Member;
  [p: string]: number | string | Member;
}

export { UserInfo, UserInfoData };
