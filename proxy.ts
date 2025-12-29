import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function proxy(req: NextRequest) {
    try {
        verifyToken(req, 'access');
    } catch (error) {
        try {
            verifyToken(req, 'refresh');
        } catch (error) {
            (await cookies()).delete('accessToken');
            (await cookies()).delete('refreshToken');
            (await cookies()).delete('user');
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
}

export const config = {
    matcher: ['/api/resources/:path*', '/resources/:path*', '/resources'],
}