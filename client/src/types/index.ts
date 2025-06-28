export interface Permission {
  id: number;
  name: string;
}

export interface Module {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface ModuleWithPermissions {
  id: number;
  name: string;
  slug: string;
  icon: string;
  permissions: Permission[];
}
