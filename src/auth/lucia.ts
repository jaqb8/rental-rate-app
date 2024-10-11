import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "@/server/db";
import { type User as DatabaseUser } from "@prisma/client";
import dayjs from "dayjs";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      image: attributes.image,
      name: attributes.name,
      emailVerified: dayjs(attributes.emailVerified).format("DD-MM-YYYY HH:mm"),
    };
  },
});

export type Auth = typeof lucia;

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUser;
  }
}
