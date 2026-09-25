// services/auth.ts
const API_URL = process.env.API_RENDER || 'http://localhost:3000';
import { AuthResponse } from "../types/auth";
import { LoginPayload } from '../types/auth';

export async function loginUser(data: LoginPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  return res.json();
}