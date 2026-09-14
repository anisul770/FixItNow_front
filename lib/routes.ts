import type { TUserRole } from "./types";

export const DASHBOARD_PATH_BY_ROLE: Record<TUserRole, string> = {
  CUSTOMER: "/dashboard",
  TECHNICIAN: "/technician-dashbaord",
  ADMIN: "/admin-dashboard",
};
