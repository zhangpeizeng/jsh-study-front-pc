interface Menu {
  id: number; // 菜单id
  name: string; // 菜单名称
  iconUrl?: string; // 图标链接
  pcUrl: string; // 菜单链接
  code: string; // code码
  pid?: number; // 父级id
  children: Menu[]; // 子级菜单
  sort?: number; //
}

interface CommonMenu {
  id: number; // 常用菜单id
  menuId: number; // 菜单id
  menuName: string; // 菜单名称
  iconUrl?: string; // 菜单图标url
  pcUrl: string; // pcUrl
  promotionUrl?: string; // 推广图表
  ifNewPage?: number;
}

export { Menu, CommonMenu };
