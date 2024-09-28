/// <reference types="lucia" />
import type { Auth as LuciaAuth } from "./src/auth/lucia";
import { type User as DatabaseUser } from "@prisma/client";

declare namespace Lucia {
  type Auth = LuciaAuth;
  type DatabaseUserAttributes = DatabaseUser;
  //   type DatabaseSessionAttributes = {};
}
