import { database } from "@/lib/database";
import { hash } from "argon2";
import { redirect } from "next/navigation";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.formData();
        const { username, email, password } = Object.fromEntries(body);

        // check username or email already exists 
        const response = await database.query(
            'SELECT id FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (response.rows.length > 0) {
            return NextResponse.redirect(new URL('/register?e=already_exists', req.url));
        }

        const passwordHash = await hash(password.toString())

        await database.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
            [username, email, passwordHash]
        );
    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.redirect(new URL('/register?e=server_error', req.url));   
    }
    redirect('/login');
}