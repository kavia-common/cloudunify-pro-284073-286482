export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user?: User;
};
