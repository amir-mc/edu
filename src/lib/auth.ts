import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import db from './db';
import { User } from '@/types';

// This would be stored in an environment variable in production
const JWT_SECRET = new TextEncoder().encode('your-secret-key');

export async function signJwtToken(user: User) {
  const token = await new SignJWT({ 
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(JWT_SECRET);

  return token;
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function login(email: string, password: string) {
  // In a real app, we would verify the password against a hashed value in the database
  // For this demo, we're just checking if the user exists
  const user = await db.getUserByEmail(email);
  if (!user) {
    return null;
  }

  // In a real app, we would verify the password here
  // For demo purposes, let's assume the password is correct

  const token = await signJwtToken(user);
  return { user, token };
}

export async function logout() {
  cookies().delete('token');
}

export async function getSession() {
  const token = cookies().get('token')?.value;
  if (!token) return null;

  const payload = await verifyJwtToken(token);
  if (!payload) return null;

  const user = await db.getUserById(payload.id as string);
  if (!user) return null;

  return { user };
}

export async function requireAuth(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const payload = await verifyJwtToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return null; // No redirect needed, user is authenticated
}

export async function checkRole(allowedRoles: string[]) {
  const session = await getSession();
  if (!session) return false;

  return allowedRoles.includes(session.user.role);
}
