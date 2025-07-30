// client/types/index.ts

export interface User {
  id: string;
  email: string;
  // password?: string; // We usually don't send password to frontend
  createdAt: string; // Dates will come as strings from API
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:MM
  location: string;
  createdBy?: { // Could be included from backend
    id: string;
    email: string;
  };
  createdById: string; // The ID of the user who created it
  createdAt: string;
  updatedAt: string;
}

// Response types for API calls
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface EventsResponse {
  events: Event[];
}

export interface SingleEventResponse {
  event: Event;
}