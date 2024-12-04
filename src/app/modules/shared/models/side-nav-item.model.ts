export interface SideNavItem {
  name: string;
  icon?: string;
  link: string;
  showSubItems?: boolean;
  subItems?: SideNavItem[];
  hidden?: boolean;
  iconClass?: string;
}
