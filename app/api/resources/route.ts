import { database } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { rows } = await database.query(
            'select distinct record_id, id, author_id, title, data, valid_from, valid_to, created_at from memories where author_id = $1',
            [req.cookies.get('user')?.value]
        );
        return NextResponse.json({ memories: rows }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `error fetching routes: ${error}` }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { title, data } = await req.json();
        const authorId = req.cookies.get('user')?.value;
        
        const { rows } = await database.query(
            'insert into records (owner_id) values ($1) returning id',
            [authorId]
        );
        const recordId = rows[0].id;

        await database.query(
            `insert into memories (record_id, author_id, title, data, valid_from, created_at) 
             values ($1, $2, $3, $4, NOW(), NOW())`,
            [recordId, authorId, title, {data}]
        );

        return NextResponse.json({ message: 'memory created successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: `error creating memory: ${error}` }, { status: 500 });
    }
}