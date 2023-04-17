import { Pool } from '@neondatabase/serverless';

export async function POST(request: Request) {
    const {clientName, clientEmail }: {clientName: string, clientEmail: string} = await request.json();

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    const { rows } = await pool.query('SELECT * FROM api_clients WHERE clientEmail = $1', [clientEmail]);
    let apiClientId: number = 0;
    if (!rows || rows.length === 0) {
        const data1 = await pool.query('INSERT INTO api_clients(clientName, clientEmail) VALUES($1, $2) RETURNING id', 
                                        [clientName, clientEmail]);
        apiClientId = data1.rows[0].id;
    } else {
        apiClientId = rows[0].id
    }
    
    const clientAccessToken = '5791hger';
    const data2 = await pool.query('INSERT INTO api_client_tokens(apiClientId, accessToken) VALUES($1, $2) RETURNING accessToken', 
                                    [apiClientId, clientAccessToken])

    // event.waitUntil(pool.end());  // doesn't hold up the response
    return new Response(JSON.stringify({accessToken: clientAccessToken}));

}

export const runtime = 'edge';