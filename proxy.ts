import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
    try {
        const accessToken = req.cookies.get('accessToken');

        const accessTokenVerified = verify(accessToken?.value!, process.env.JWT_SECRET_ACCESS!, { complete: true });

        console.log(`[PROXY] by access ${JSON.stringify(accessTokenVerified.payload)}`);
    } catch (error) {
        try {
            const refreshToken = req.cookies.get('refreshToken');

            const refreshTokenVerified = verify(refreshToken?.value!, process.env.JWT_SECRET_REFRESH!, { complete: true });

            console.log(`[PROXY] by refresh ${JSON.stringify(refreshTokenVerified.payload)}`);
        } catch (error) {
            (await cookies()).delete('accessToken');
            (await cookies()).delete('refreshToken');
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
}

export const config = {
    matcher: ['/api/resources/:path*', '/resources/:path*', '/resources'],
}