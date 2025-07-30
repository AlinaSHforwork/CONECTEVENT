// server/src/types.ts

export interface User {
  id: string;
  email: string;
  password?: string; // Optional because we might not always return it
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description?: string; // Optional based on your schema
  eventDate: Date;
  eventTime: Date;
  location: string;
  createdBy: User; // This will be the User object if we include it
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

// Custom Request interface to include user information after authentication
import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string; // Will store the authenticated user's ID
}