export interface AuthAdminProfile {
  adminId: number;
  username: string;
  displayName: string;
  role: string;
}

export interface MockLoginPayload {
  username: string;
}

export interface AdminListItem {
  admin_id: number;
  username: string;
  display_name: string;
}

export interface MockLoginResponse {
  admin_id: number;
  username: string;
  display_name: string;
  role: string;
}
