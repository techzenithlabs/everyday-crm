export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  role?: {
    name: string;
  };
  status?: number;
  used?: boolean;
  expires_at?: string;
  permission_count?: number;
  user_permissions?: {
    permissions?: Record<number, number[]>;
  };
  user_info?: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    created_at?: string;
    updated_at?: string;
  };
}


export interface UserFields {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  status: 0 | 1;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  current_password?: string;
  user_info?: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  };
}
