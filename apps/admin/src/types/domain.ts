export interface AdminUser {
  id: string;
  name: string;
  email: string;
  roleId: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  role: { id: string; name: string };
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  usersCount: number;
  permissionKeys: string[];
}

export interface Permission {
  id: string;
  key: string;
  description: string | null;
}

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  userEmail: string | null;
  action: string;
  entity: string;
  entityId: string;
  ipAddress: string | null;
  changes: Record<string, { before: unknown; after: unknown }> | null;
  createdAt: string;
}
