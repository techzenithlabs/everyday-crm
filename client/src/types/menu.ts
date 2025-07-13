export interface MenuItem {
  id: number;
  name: string;
  icon: string;
  path: string;
  parent_id: number | null;
  sort_order: number;
  roleAccess: number[];
  children: MenuItem[];
}
