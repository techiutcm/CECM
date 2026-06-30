import type { BlogRole } from "@/types/blog";

export type StaffPanel = "blog" | "admisiones";

export interface StaffUserRow {
  profileId: string;
  email: string | null;
  fullName: string | null;
  username: string | null;
  department: string;
  title: string | null;
  isActive: boolean;
  roles: BlogRole[];
  createdAt: string;
}

export const STAFF_PANEL_CONFIG: Record<
  StaffPanel,
  { department: string; role: BlogRole; defaultTitle: string; defaultName: string }
> = {
  blog: {
    department: "Blog",
    role: "author",
    defaultTitle: "Editor de Contenido",
    defaultName: "Editor Blog",
  },
  admisiones: {
    department: "Admisiones",
    role: "editor",
    defaultTitle: "Coordinador de Admisiones",
    defaultName: "Admin Admisiones",
  },
};
