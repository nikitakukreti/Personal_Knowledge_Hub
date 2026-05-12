export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface Resource {
  id: number;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  created_at: string;
  updated_at?: string;
  owner_id: number;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ResourceFormData {
  title: string;
  url: string;
  description: string;
  tags: string[];
}

export interface ApiError {
  detail: string | { msg: string; type: string }[];
}
