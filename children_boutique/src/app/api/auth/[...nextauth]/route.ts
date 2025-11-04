// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler: any = NextAuth(authOptions as any);

export const GET = handler as (request: Request) => Promise<Response>;
export const POST = GET;
