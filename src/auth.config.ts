import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/schemas/loginSchema";
import { getUserByEmail } from "./app/actions/authActions";
import { compare } from "bcryptjs";

export default {
  providers: [
    Credentials({
      name: "credentials",
      async authorize(creds) {
        const validated = loginSchema.safeParse(creds);

        //check if succes
        if (validated.success) {
          const { email, password } = validated.data;

          //get user from actions
          const user = await getUserByEmail(email);

          // if no user or password is different than hashed password return null /
          if (!user || !(await compare(password, user.passwordHash)))
            return null;
          return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
