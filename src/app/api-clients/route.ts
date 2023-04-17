import { Pool } from '@neondatabase/serverless';
import {SignJWT } from 'jose';

function randomHash(length: number) {
    let pool = "0123456789abcdefghijklmnopqrstuvwxyz";
    
    let buf = "";
  
    for (let i = 0; i < length; i++) {
      buf += pool.charAt(Math.floor(Math.random() * pool.length));
    }
  
    return buf;
  }

async function sign(payload: { apiClientId: string, clientName: string, clientEmail: string, accessPermissions: string }, secret: string): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24; // 24 hours

    return new SignJWT({...payload})
        .setProtectedHeader({alg: 'HS256', typ: 'JWT'})
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(secret));
}

export async function POST(request: Request) {
    const {clientName }: {apiClientId: string, clientName: string, clientEmail: string, accessPermissions: string} = await request.json();

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    const clientEmail = '';
    const { rows } = await pool.query('SELECT * FROM api_clients WHERE apiClientId = $1', ['clientId from middleware']);
    let apiClientId: string = '';
    if (!rows || rows.length === 0) {
        const data1 = await pool.query('INSERT INTO api_clients(id, clientName, clientEmail) VALUES($1, $2, $3) RETURNING id', 
                                        [randomHash(64), clientName, clientEmail]);
        apiClientId = data1.rows[0].id;
    } else {
        apiClientId = rows[0].id
    }
    
    const clientAccessToken = await sign({apiClientId, clientName, clientEmail, accessPermissions:'/orders'}, process.env.JWT_SECRET as string);
    const data2 = await pool.query('INSERT INTO api_client_tokens(apiClientId, accessToken) VALUES($1, $2) RETURNING accessToken', 
                                    [apiClientId, clientAccessToken])

    // event.waitUntil(pool.end());  // doesn't hold up the response
    return new Response(JSON.stringify({accessToken: clientAccessToken}));

}

export const runtime = 'edge';