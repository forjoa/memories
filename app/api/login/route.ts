import { database } from "@/lib/database";
import { verify } from "argon2";
import { redirect } from "next/navigation";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.formData();
        const { username, password } = Object.fromEntries(body);

        const loginBy = username.toString().includes('@') ? 'email' : 'username';

        // check username or email already exists 
        const response = await database.query(
            `SELECT * FROM users WHERE ${loginBy} = $1`,
            [username]
        );

        if (response.rows.length == 0) {
            return NextResponse.redirect(new URL('/login?e=not_found', req.url));
        }

        const user = response.rows[0];

        if (!(await verify(user.password_hash, password.toString()))) {
            return NextResponse.redirect(new URL('/login?e=invalid_credentials', req.url));
        }
    } catch (error) {
        console.error({ error });
        return NextResponse.redirect(new URL('/login?e=server_error', req.url));
    }
    redirect('/resources');
}