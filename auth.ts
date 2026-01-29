import clientPromise from "@/app/libs/mongodb-client";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "flowers",
  }),
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add role to token on first sign in
      if (user) {
        // Get user from database to check role
        const client = await clientPromise;
        const db = client.db("flowers");
        const dbUser = await db
          .collection("users")
          .findOne({ email: user.email });

        if (dbUser) {
          token.role = (dbUser as any).role || "user";
          token.userId = dbUser._id.toString();
        } else {
          token.role = "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});
