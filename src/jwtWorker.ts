import { SignJWT, jwtVerify } from "jose";

import type { Env } from "./env";

export type UserJwtClaims = {
  sub: string;
  email: string;
  role: string;
};

function secretKey(env: Env): Uint8Array {
  const s = env.JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error("JWT_SECRET must be set (min 32 characters)");
  }
  return new TextEncoder().encode(s);
}

export async function signUserJwt(env: Env, claims: UserJwtClaims): Promise<string> {
  const key = secretKey(env);
  return new SignJWT({ email: claims.email, role: claims.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyUserJwt(
  env: Env,
  token: string,
): Promise<UserJwtClaims | null> {
  try {
    const key = secretKey(env);
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    const sub = payload.sub;
    const email = payload.email;
    const role = payload.role;
    if (
      typeof sub !== "string" ||
      typeof email !== "string" ||
      typeof role !== "string"
    ) {
      return null;
    }
    return { sub, email, role };
  } catch {
    return null;
  }
}
