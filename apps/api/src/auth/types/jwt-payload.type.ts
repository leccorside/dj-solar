export interface JwtPayload {
  sub: string;
  email: string;
  roleId: string;
  roleName: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  roleId: string;
  roleName: string;
}
