import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { twoFactor } from "better-auth/plugins";
import { Resend } from "resend";
import { admin } from "better-auth/plugins";
import { adminRole, userRole } from "./permissions";

const resend = new Resend("re_gQ7dh4p7_7bjnEHEsoe4C9brUM68VUyVb");

export const auth = betterAuth({
  appName: "my-first-github-app",
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/v1/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.CLIENT_SIDE_URL!],
  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      redirectURI: `${process.env.CLIENT_SIDE_URL}/api/auth/callback/github`,
    },
  },
  plugins: [
    admin({
      adminRoles: ["admin", "user"],
      defaultRole: "user",
      roles: {
        admin: adminRole,
        user: userRole,
      },
    }),
    twoFactor({
      otpOptions: {
        period: 2, //koto minutes meyad thakbe
        async sendOTP({ user, otp }, ctx) {
          console.log({ user, otp });
          await resend.emails.send({
            from: "My app <onboarding@resend.dev>",
            to: user.email,
            subject: "Two factor authentication.",
            html: `<p><b>${otp}</b></p>`,
          });
        },
      },
    }),
  ],
});
