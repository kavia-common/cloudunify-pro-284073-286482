export type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

/**
 * Supported cloud providers across the application.
 */
export type Provider = 'AWS' | 'Azure' | 'GCP';

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user?: User;
};

/**
 * Organization entity used in organizations listing.
 */
export type Organization = {
  id: string;
  name: string;
  createdAt: string;
};

/**
 * Cloud resource abstraction used in inventory and detail views.
 */
export type Resource = {
  id: string;
  provider: Provider;
  type: string;
  name: string;
  tags: Record<string, string>;
  cost: number;
  status: string;
  createdAt: string;
};
