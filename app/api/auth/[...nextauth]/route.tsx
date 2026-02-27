import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    // ✅ Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),

    // ✅ Credentials Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials?.email });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  // --- CALLBACKS ---
  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      if (account?.provider === "google") {
        const existing = await User.findOne({ email: user.email });

        if (!existing) {
          // New Google user
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "user",
            provider: "google",
            password: null, // Important
          });
        }
      }

      return true;
    },

  async jwt({ token, user }) {
    // 1️⃣ First login: user exists
    if (user) {
      token.id = user.id || user.id?.toString();
      token.email = user.email;
      token.image = user.image;
      token.role = user.role || "user"; // default role
    }

    // 2️⃣ On every request after first login: refresh role from DB
    const dbUser = await User.findOne({ email: token.email });
    if (dbUser) {
      token.role = dbUser.role; // always take the latest role
    }

    return token;
  },


    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.image = token.image;
      session.user.role = token.role || "user";
      return session;
    },
  },

  
  // --- SESSION CONFIG ---
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // ✅ 24 hours in seconds
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
