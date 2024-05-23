import prisma from "@/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(
        credentials: Record<"username" | "password", string> | undefined
      ) {
        if (!credentials) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username,
            },
          });

          if (!user) {
            return null;
          }

          const isValidPassword = await compare(credentials.password, user.password);
          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            username: user.username,
          };
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      const user = await prisma.user.findUnique({
        where: {
          id: token.sub || session.user.username,
        },
      });

      console.log(user)

      if (user) {
        session.user.id = user.id;
      } else {
        console.log("User not found in the database");
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};
