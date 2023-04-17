import { NextResponse } from 'next/server';

export async function POST() {
    // {
    //     "bookId": 4,
    //     "quantity": 2,
    //     "customerName": "Asif"
    // }


    const data = { id: "abcd1234", created: true };

    // {
    //     "created": true,
    //     "orderId": "jOqtH-qcrFXaMdqv0sFr2"
    // }

    // respond!
    const responseJson = JSON.stringify(data);
    return new Response(responseJson, { headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }});

    // return NextResponse.json(data);
}

export const runtime = 'edge';