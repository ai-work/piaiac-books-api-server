import { NextResponse } from 'next/server';

export async function POST() {
    // {
    //     "clientName": "Postman",
    //     "clientEmail": "valentin@example.com"
    // }


    const data = { id: "abcd1234", created: true };

    // {
    //     "accessToken": "jOqtH-qcrFXaMdqv0sFr2"
    // }

    // respond!
    const responseJson = JSON.stringify(data);
    return new Response(responseJson, { headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }});

    // return NextResponse.json(data);
}
