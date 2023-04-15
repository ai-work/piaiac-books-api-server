export async function GET(request: Request) {
    return new Response(JSON.stringify({
        "status":"OK"
    }));
}

export const runtime = 'edge';