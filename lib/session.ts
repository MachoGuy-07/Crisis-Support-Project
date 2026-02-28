import type { UserRole } from "@/lib/types/dashboard";

const EMAIL_KEY = "crisis-support-user-email";
const ROLE_KEY = "crisis-support-user-role";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getUserEmail(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(EMAIL_KEY);
}

export function setUserEmail(email: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(EMAIL_KEY, email.trim().toLowerCase());
}

export function getUserRole(): UserRole | null {
  if (!isBrowser()) return null;
  const role = window.localStorage.getItem(ROLE_KEY);
  if (role === "victim" || role === "volunteer") return role;
  return null;
}

export function setUserRole(role: UserRole) {
  if (!isBrowser()) return;
  window.localStorage.setItem(ROLE_KEY, role);
}

export function clearUserRole() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ROLE_KEY);
}

export function clearSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(EMAIL_KEY);
  window.localStorage.removeItem(ROLE_KEY);
}
