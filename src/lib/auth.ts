import crypto from "crypto";
import type { NextRequest } from "next/server";
import type { CollectionName, Role } from "@/lib/types";

export const sessionCookieName = "aura_admin_session";

export type AdminUser = {
  email: string;
  name: string;
  role: Role;
  password: string;
};

export type Session = Omit<AdminUser, "password"> & {
  expiresAt: number;
};

const users: AdminUser[] = [
  {
    email: "admin@aurawellness.local",
    name: "Aura Admin",
    role: "Admin",
    password: process.env.ADMIN_PASSWORD ?? "admin123",
  },
  {
    email: "manager@aurawellness.local",
    name: "Studio Manager",
    role: "Manager",
    password: process.env.MANAGER_PASSWORD ?? "manager123",
  },
  {
    email: "staff@aurawellness.local",
    name: "Front Desk Staff",
    role: "Staff",
    password: process.env.STAFF_PASSWORD ?? "staff123",
  },
];

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? "change-this-secret-before-production";
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function sign(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createSession(user: AdminUser): string {
  const payload: Session = {
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt: Date.now() + 1000 * 60 * 60 * 8,
  };
  const body = base64Url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifySession(token?: string | null): Session | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature || sign(body) !== signature) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Session;
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function authenticate(email: string, password: string): AdminUser | null {
  const user = users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  const expected = Buffer.from(user.password);
  const received = Buffer.from(password);
  if (expected.length !== received.length) return null;
  return crypto.timingSafeEqual(expected, received) ? user : null;
}

export function getSessionFromRequest(request: NextRequest) {
  return verifySession(request.cookies.get(sessionCookieName)?.value);
}

export function canWrite(role: Role, collection: CollectionName) {
  if (role === "Admin") return true;
  if (role === "Manager") return !["orders"].includes(collection);
  return ["bookings", "leads"].includes(collection);
}

export function canDelete(role: Role, collection: CollectionName) {
  if (role === "Admin") return true;
  if (role === "Manager") return !["orders", "leads"].includes(collection);
  return false;
}
