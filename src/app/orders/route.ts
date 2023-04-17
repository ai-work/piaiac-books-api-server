import { NextResponse } from 'next/server';

export async function POST() {
    const data = { id: "abcd1234", created: true };

    // respond!
    const responseJson = JSON.stringify(data);
    return new Response(responseJson, { headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }});

    // return NextResponse.json(data);
}
