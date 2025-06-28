import {
  Home,
  CalendarDays,
  Users2,
  Zap,
  CheckSquare,
  FileText,
  Wallet,
  UserPlus,
  ShieldCheck,
  FolderKanban,
  Briefcase,
  Book,
  Users,
} from "lucide-react";

export interface RouteItem {
  path: string;
  name: string;
  icon: React.ElementType;
  roleAccess: number[]; // Role IDs allowed (1 = Admin, etc.)
  exact?: boolean;
}

export const routesConfig: RouteItem[] = [
  {
    path: "/dashboard",
    name: "Home",
    icon: Home,
    roleAccess: [1, 2, 3], // All roles
  },
  {
    path: "/calendar",
    name: "Calendar",
    icon: CalendarDays,
    roleAccess: [1, 2],
  },
  {
    path: "/clients",
    name: "Clients",
    icon: Users2,
    roleAccess: [1, 2],
  },
  {
    path: "/leads",
    name: "Leads",
    icon: Zap,
    roleAccess: [1, 2],
  },
  {
    path: "/projects",
    name: "Projects",
    icon: CheckSquare,
    roleAccess: [1, 2, 3],
  },
  {
    path: "/invoices",
    name: "Invoices",
    icon: FileText,
    roleAccess: [1],
  },
  {
    path: "/payroll",
    name: "Payroll",
    icon: Wallet,
    roleAccess: [1],
  },
  {
    path: "/admin/teams",
    name: "Team",
    icon: Users,
    roleAccess: [1],
  },
  {
    path: "/admin/users/invite",
    name: "Invite User",
    icon: UserPlus,
    roleAccess: [1],
  },
];
